# vim: expandtab:ts=4:sw=4

#####################################
# Graymatics
#
# Lize Cai, 2018/04/25
#####################################
import os
import errno
import argparse
import numpy as np
import cv2
import tensorflow as tf

from keras.applications import *


def _run_in_batches(f, data_dict, out, batch_size=32):
    #data_len = len(out[0])
    data_len = len(out)
    num_batches = int(data_len / batch_size)

    s, e = 0, 0
    for i in range(num_batches):
        print("batch: {} ...", i)
        s, e = i * batch_size, (i + 1) * batch_size
        batch_data_dict = {k: v[s:e] for k, v in data_dict.items()}
        out[s:e] = f(batch_data_dict)
    if e < data_len:
        batch_data_dict = {k: v[e:] for k, v in data_dict.items()}
        out[e:] = f(batch_data_dict)


def extract_image_patch(image, bbox, patch_shape):
    """Extract image patch from bounding box.

    Parameters
    ----------
    image : ndarray
        The full image.
    bbox : array_like
        The bounding box in format (x, y, width, height).
    patch_shape : Optional[array_like]
        This parameter can be used to enforce a desired patch shape
        (height, width). First, the `bbox` is adapted to the aspect ratio
        of the patch shape, then it is clipped at the image boundaries.
        If None, the shape is computed from :arg:`bbox`.

    Returns
    -------
    ndarray | NoneType
        An image patch showing the :arg:`bbox`, optionally reshaped to
        :arg:`patch_shape`.
        Returns None if the bounding box is empty or fully outside of the image
        boundaries.

    """
    bbox = np.array(bbox)

    # convert to top left, bottom right
    bbox[2:] += bbox[:2]
    bbox = bbox.astype(np.int)

    # clip at image boundaries
    bbox[:2] = np.maximum(0, bbox[:2])
    bbox[2:] = np.minimum(np.asarray(image.shape[:2][::-1]) - 1, bbox[2:])
    if np.any(bbox[:2] >= bbox[2:]):
        #print("patch shape return none")
        return None
    sx, sy, ex, ey = bbox
    image = image[sy:ey, sx:ex]
    
    #cv2.imshow("image patch", image)
    image = cv2.resize(image, tuple(patch_shape[::-1]))


    return image

def prepocess_img(rgb_img):
    #image = raw_input[:,:,::-1] # to rgb

    #x = np.asarray(ret, dtype=np.float32)
    #x = np.expand_dims(x, axis=0)

    # setup the preprocess_input for each model
    #x = xception.preprocess_input(rgb_img)

    x = resnet50.preprocess_input(rgb_img)

    return x


def decode_predictions(preds, class_name, top=3):
    """Decodes the prediction of an ImageNet model.

    # Arguments
        preds: Numpy tensor encoding a batch of predictions.
        top: Integer, how many top-guesses to return.

    # Returns
        A list of lists of top class prediction tuples
        `(class_name, class_description, score)`.
        One list of tuples per sample in batch input.

    # Raises
        ValueError: In case of invalid shape of the `pred` array
            (must be 2D).
    """
    if len(preds.shape) != 2 or preds.shape[1] != len(class_name):
        raise ValueError('`decode_predictions` expects '
                         'a batch of predictions '
                         '(i.e. a 2D array of shape (samples, class_num)). '
                         'Found array with shape: ' + str(preds.shape))

    top = min(top, len(class_name))
    results = {}
    for pred in preds:
        top_indices = pred.argsort()[-top:][::-1]
        #result = [tuple(class_name[i]) + (pred[i],) for i in top_indices]
        result = [{"object":str(class_name[i]), "confidence_index":float(pred[i])} for i in top_indices]
	#result.sort(key=lambda x: x["confidence"], reverse=True)
	results.update({"predictions":result})
    return results


class SingleOutClassifier(object):

    def __init__(self, checkpoint_filename=None, mapping_file=None, threshold=0.9, top=None, input_name="input_1",
                 output_name="attributes", graph_name="net_single_test",primary_class="primary_class"):
        print("Load model for %s classifier..." % primary_class)
        # Config
        self.tfconfig = tf.ConfigProto(allow_soft_placement=True, log_device_placement=False)
        self.tfconfig.gpu_options.allow_growth = True
        self.tfconfig.gpu_options.per_process_gpu_memory_fraction = 0.3

        self.session = tf.Session(graph=None, config=self.tfconfig)
        if checkpoint_filename is None:
            this_dir = os.path.dirname(__file__)
            checkpoint_filename = os.path.join(this_dir, "model/model.pb")
        with tf.gfile.GFile(checkpoint_filename, "rb") as file_handle:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(file_handle.read())
        tf.import_graph_def(graph_def, name=graph_name)

        # Print the name of operations in the session
        #for op in tf.get_default_graph().get_operations():
        #        print("Operation Name :",op.name)         # Operation name
        #        print("Tensor Stats :",str(op.values()))     # Tensor name

        self.input_var = tf.get_default_graph().get_tensor_by_name('%s/%s:0' % (graph_name, input_name)) # Input Tensor
        #self.output_var_age = tf.get_default_graph().get_tensor_by_name('net/output_node0:0') # Output Tensor
        self.output_var = tf.get_default_graph().get_tensor_by_name('%s/%s:0' % (graph_name, output_name)) # Output Tensor
        #self.output_var = [self.output_var_age, self.output_var_gender, self.output_var_ethn]

        #assert len(self.output_var.get_shape()) == 2
        assert len(self.input_var.get_shape()) == 4
        self.output_dim = self.output_var.get_shape().as_list()[-1]
        #print("output dimension: ", self.output_dim)
        #self.feature_dim = self.output_var.get_shape().as_list()[-1]
        self.image_shape = self.input_var.get_shape().as_list()[1:]
        #print("image shape: ", self.image_shape)
        CLASS = []
        if mapping_file is None:
            this_dir = os.path.dirname(__file__)
            mapping_file = os.path.join(this_dir, "model/mapping.txt")
        with open(mapping_file) as f:
            lines = f.read().splitlines()
            #for line in lines:
            #    CLASS.append(line.split(","))
            CLASS = [x.strip() for x in lines] 
        self.attri_class = CLASS
        #print("test class: ", self.attri_class)
        self.primary_class = primary_class
        self.thresh = threshold
        self.top = top
        print("%s classifier(single output) is sucessfully loaded" % primary_class)

    def __call__(self, data_x, batch_size=32):
        #out = np.zeros((len(data_x), self.feature_dim), np.float32)
        # a list of 3 numpy array with number of image x label size
        num_data = len(data_x)
        out = np.zeros((len(data_x), self.output_dim), dtype=np.float32)
        _run_in_batches(
            lambda x: self.session.run(self.output_var, feed_dict=x),
            {self.input_var: data_x}, out, batch_size)
        result = [{} for _ in range(num_data)]


        if self.top is not None:
            result = decode_predictions(out, self.attri_class, top=self.top)
            #print(result)
        else:

            for i_indx in range(num_data):
                i_res = out[i_indx,:]
                class_idx = np.argmax(i_res)


                if self.thresh is not None:
                    if i_res[class_idx] >= self.thresh:
                        result[i_indx].update({self.primary_class : self.attri_class[class_idx], 'confidence':i_res[class_idx]})
                    else: # unknown
                        result[i_indx].update({self.primary_class : "unknown", 'confidence':i_res[class_idx], 'possible result':self.attri_class[class_idx]})
                else:
                    result[i_indx].update({self.primary_class : self.attri_class[class_idx], 'confidence':i_res[class_idx]})
            #print ("res: {}, class: {}".format(indx, CLASS[indx][class_idx]))

        return result


def create_single_classifier(model_filename=None, mapping_file=None, threshold=0.9, top=None, input_name="input_1",
                       output_name="attributes",graph_name="net_single_test", primary_class='primary_class',batch_size=32):

    test_classifier = SingleOutClassifier(model_filename, mapping_file, threshold, top, input_name, output_name, graph_name,primary_class)
    image_shape = test_classifier.image_shape

    def classifier(rgb_image, bboxes):
        boxes = bboxes[:,:4]
        image_patches = np.zeros((boxes.shape[0], image_shape[0], image_shape[1], 3), dtype=np.float32)
        #image = image[:,:,::-1] # convert to rgb
        for idx, box in enumerate(boxes):
            patch = extract_image_patch(rgb_image, box, image_shape[:2])
            if patch is None:
                print("WARNING: Failed to extract image patch: %s." % str(box))
                patch = np.random.uniform(
                    0., 255., image_shape).astype(np.uint8)

            x = np.asarray(patch, dtype=np.float32)
            image_patches[idx] = x

        image_patches = prepocess_img(image_patches)
        #print("shape of image_patches",image_patches.shape)

        return test_classifier(image_patches, batch_size)

    return classifier



def create_single_classifier_pure(model_filename=None, mapping_file=None, threshold=0.9, top=None, input_name="input_1",
                       output_name="attributes",graph_name="net_single_test",primary_class='primary_class', batch_size=32):

    test_classifier = SingleOutClassifier(model_filename, mapping_file, threshold, top, input_name, output_name, graph_name, primary_class)
    image_shape = test_classifier.image_shape

    def classifier(rgb_image):
        rgb_shape = rgb_image.shape
        #print("rgb_shape size", rgb_shape)
        if len(rgb_shape) == 4:
            n = rgb_shape[0]

            if rgb_shape[1] == image_shape[1] and rgb_shape[2] == image_shape[1]:
                #print("same size")
                rgb_image = np.asarray(rgb_image,dtype=np.float32)
                image_patches = prepocess_img(rgb_image)
            else:
                #print("different size")

                image_patches = np.zeros((n, image_shape[0], image_shape[1], 3), dtype=np.float32)
                for idx in range(n):
                    x = cv2.resize(rgb_image[idx], tuple(image_shape[:2][::-1]))
                    x = np.asarray(x, dtype=np.float32)
                    image_patches[idx] = x
                image_patches = prepocess_img(image_patches)

        else:
            assert len(rgb_shape) == 3
            #print("single rgb image")
            # single rgb image
            x = cv2.resize(rgb_image, tuple(image_shape[:2][::-1]))
            x = np.asarray(x, dtype=np.float32)
            x = np.expand_dims(x, axis=0)
            image_patches = prepocess_img(x)

        #print("shape of image_patches",image_patches.shape)
        return test_classifier(image_patches, batch_size)

    return classifier




