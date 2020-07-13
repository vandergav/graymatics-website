from PIL import Image
import ConfigParser
import sys
import time
from zmqclient_plate import zmqConnect

#initializing the mapping (CLASSES), the path of the prototxt file and corresponding caffemodel

CLASSES = ('__background__','plate')


def saveimage(image,number):
    os.chdir(image_path)
    cv2.imwrite(str(number) + '.jpg', image)

def ConfigSectionMap(Config,section):
    dict1 = {}
    print section
    options = Config.options(section)
    for option in options:
        try:
            dict1[option] = Config.get(section, option)
            if dict1[option] == -1:
                DebugPrint("skip: %s" % option)
        except:
            print("exception on %s!" % option)
            dict1[option] = None
    return dict1

class plateCrop(object):

	def __init__(self, country='indo'):

		self.country = country
		self.detector = zmqConnect()
		self.Config = ConfigParser.ConfigParser()
		self.frame_id = 0
		"""Read the configuration file for cropping info"""
		self.Config.read('/home/gmind/graymatics/development/graySmart/smart-surveillance/platform/algomanager/manager/algos/vehicle/indo.ini')
		section = self.Config.sections()
		print "sections:{}".format(section)
		self.right_index = float(ConfigSectionMap(self.Config, "post_processing")['plate_cropping_index_x'])
		self.left_index = float(ConfigSectionMap(self.Config, "post_processing")['plate_cropping_index_y'])

	def crop(self, frame):
		start_time = time.time()
	
		try:
			self.detector = zmqConnect() 
		except Exception as e:
			print "ZMQ error : ", e
			
		""" Send the frame to zmqclient"""
		obj_info = self.detector.send('frame',frame)
		""" Check for the ini file to crop accordingly """
		self.frame_id += 1

		for dets, classname in obj_info:
			for i in range(len(dets)):
				bbox = dets[i,:4]
				scores = dets[i,-1]
                        	xmin = int(round(float(bbox[0])))
                        	ymin = int(round(float(bbox[1])))
                        	xmax = int(round(float(bbox[2])))
                        	ymax = int(round(float(bbox[3])))

				print "xmin, ymin, xmax, ymax: {} {} {} {}".format(xmin,ymin,xmax,ymax)
				roi_for_analysis = frame[ymin:ymax, xmin:xmax]
				ww, hh = roi_for_analysis.shape[:2]

				"""Bounding box adjustment for cropping"""
				roi_for_analysis = roi_for_analysis[int(ww*self.right_index):int(1-self.right_index*ww),int(self.left_index):int(1-self.left_index*hh)]

			#try: saveimage(roi_for_analysis,frame_id)
			#except: pass
			try: return roi_for_analysis
			except: pass

