import zmq
import numpy as np
import cv2
import json
import time
import zlib, cPickle as pickle
import darknet_server as dn


class PersonVehicleCounter(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(PersonVehicleCounter, self).__init__()
		self.arg = arg

		#name of the algo
		self.__name = 'PEOPLE_VEHICLE_COUNTING'

		#load the model
		self.net = dn.load_net("/home/sadhna/algos/darknet/cfg/yolov3.cfg", "/home/sadhna/algos/darknet/yolov3.weights", 0)
		self.meta = dn.load_meta("/home/sadhna/algos/darknet/cfg/coco.data")
		print self.net, self.meta

	@property
	def name(self):
		return self.__name


	#edit analyse and write your function which accept the frame and can modify the detected result
	def analyze(self, frame,send_end,  _id=None,  scale=1):
		#res = self.detector.send('frame',frame)
		res = dn.detect(self.net, self.meta, frame)
		result = {}
		# change to vehicle classes in coco.name for vehicle
		result['count'] = 0
		result['object'] = {}
		# result['person'] = {}
		for obj in res:
			cls = obj[0]
			conf = obj[1]
			x, y, w, h = obj[2]
			##### If you want to exclude a certain region using ROI
			# if((cls == 'person') and not (point_in_poly(int(x), int(y), camera_config_dict['ROI']))):
			# if(cls == 'person'):  # change to vehicle classes in coco.name for vehicle
			result['count'] += 1
			# convert to left, top, right, bottom
			left, top, right, bottom = int(x - 0.5 * w), int(y - 0.5 * h), int(x + 0.5 * w), int(y + 0.5 * h)
			# result['person'][result['count']] = [left, top, right, bottom]
			result['object'][result['count']] = cls, conf, [left, top, right, bottom]
			cv2.rectangle(frame, (left, top), (right, bottom), (255, 255, 255), 2)
			cv2.putText(frame, cls, (left, top - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)


		print result, type(result)
		return result
		#send_end.send(result)
		print result, type(result)
		return result
		#send_end.send(result)


if __name__=="__main__":

	cap = cv2.VideoCapture('/home/sadhna/graymatics/development/vehicle.mp4')
	# cap = cv2.VideoCapture(sys.argv[1])
	p = PersonVehicleCounter()
	send_end = ""
	i =0
	while(True):
		i +=1
		ret, frame  = cap.read()
		start_time = time.time()
		r = p.analyze(frame,send_end)
		cv2.imshow('video',frame)
		if (cv2.waitKey(1) & 0xFF) == ord('q'): # Hit `q` to exit
			break
		print "\n \n **********total :::" , time.time() - start_time
	cap.close()

