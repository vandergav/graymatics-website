import zmq
import numpy as np
import cv2
import json
import time
import zlib, cPickle as pickle
import numpy as np
import logging
import logger
from themeClassifier.single_classifier import deep_test


logger.setup_logger("themesServer",'themesServer.log')
logger_1 = logging.getLogger("themesServer")


CLASSES = ('__background__','plate')


class SerializingSocket(zmq.Socket):

    def send_array(self, A, arrayname="NoName",flags=0, copy=True, track=False):
        """send a numpy array with metadata and array name"""
        md = dict(
            arrayname = arrayname,
            dtype = str(A.dtype),
            shape = A.shape,
        )
        self.send_json(md, flags|zmq.SNDMORE)
        return self.send(A, flags, copy=copy, track=track)

    def recv_array(self, flags=0, copy=True, track=False):
        """recv a numpy array, including arrayname, dtype and shape"""
        md = self.recv_json(flags=flags)
        msg = self.recv(flags=flags, copy=copy, track=track)
        A = np.frombuffer(msg, dtype=md['dtype'])
        return (md['arrayname'], A.reshape(md['shape']))

class SerializingContext(zmq.Context):
    _socket_class = SerializingSocket


class zmqImageShowServer():
    '''A class that opens a zmq REP socket on the display computer to receive images
    '''
    def __init__(self, open_port="tcp://*:7050"):
        '''initialize zmq socket on viewing computer that will display images'''
        self.zmq_context = SerializingContext()
        self.zmq_socket = self.zmq_context.socket(zmq.REP)
        self.zmq_socket.bind(open_port)
        # threshold for classification
        self.threshold_cls = 0.9
        # load classifier
        self.classifer = deep_test.create_single_classifier_pure(model_filename='themeClassifier/single_classifier/model/Deep_Themes210.pb',
                                        threshold=self.threshold_cls, top=3, input_name="input_1",output_name='themes_0',primary_class = 'themes')

    def imshow(self, copy=False):
        '''receive and show image on viewing computer display'''
        start_time = time.time()
        _, image = self.zmq_socket.recv_array(copy=False)
        detect_time = time.time()
        print ("detect_time : ", detect_time)
        tf_res = self.classifer(image)
        print detect_time - start_time, time.time() - detect_time, time.time()-start_time, "\t",tf_res
        p = pickle.dumps(tf_res)
        print self.zmq_socket.send(p)


if __name__ == "__main__":
    server = zmqImageShowServer()
    while True:
        server.imshow()
