from detector import ObjectDetector
# from vehicle_detection import VehicleDetector

import cv2
import time
import json
import traceback
import sys
#from algos.kalman import kalmanWorker
import random as rd
from zmqclient import zmqConnect

class IntrusionWorker(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(IntrusionWorker, self).__init__()
		self.arg = arg
		self.img_cnt = 1
		self.__name = 'Intrusion_Detector'
		self.tracker = None
		self.rects = []
		self.total_count = 0
		self.regions = []
		self.areas = []

	@property
	def name(self):
		return self.__name

	def analyze(self, frame, send_end, _id=None, scale=1):
		
		count = 0
		result = {}	
		height, width = frame.shape[:2]
		#result['intrusion'] = False
		
		try:
			result['intrusion'] = 'false'
                	centers = []

			"""
			connect to the zmq server
			"""
                        try:
                                self.detector = zmqConnect()
                        except Exception as e:
                                print "ZMQ error : ", e

			"""
			Initialize the contours and make the bounding boxes over them
			"""
			if self.img_cnt == 1:
				try:
					for i in xrange(len(self.arg["roi"])):
						region = np.array(self.arg["roi"][i]).astype('int32')
						x,y,w,h = cv2.boundingRect(region)
						cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
						self.rects.append([x,y,w,h])
						area = w*h
						cropped_image = frame[y:y+h, x:x+w]
						cropped_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
						self.regions.append(cropped_image)
						self.areas.append(area)
						self.img_cnt += 1

				#if roi is not defined, parse a fixed exception
				except:
					x = 200 #width/2
					y = 200
					w = 1200 #-10
					h = 1000 #-10
					
					area = w*h
					self.areas.append(area)
					self.rects.append([x,y,w,h])
					cropped_image = frame[y:y+h, x:x+w]
					cropped_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
					self.regions.append(cropped_image)
					self.img_cnt += 1
		
			"""
			PRE-PROCESSING
			"""

			self.img_cnt += 1
			result['object'] = ""		

			for i in xrange(len(self.rects)):
				#self.frMat = frame[self.rects[i][1]: self.rects[i][1]+self.rects[i][3], self.rects[i][0]: self.rects[i][0]+self.rects[i][2]]
				#self.frMat = cv2.cvtColor(self.frMat, cv2.COLOR_BGR2GRAY)
				#self.frMat = cv2.absdiff(self.frMat, self.regions[i])
				#_, self.frMat = cv2.threshold(self.frMat, 35, 255, cv2.THRESH_BINARY)
				
				"""
				Check the object in ratio
				"""
				#total_white_pixels = cv2.countNonZero(self.frMat)
				#object_in_ratio = total_white_pixels/self.areas[i]

				#cv2.rectangle(frame, (self.rects[i][0],self.rects[i][1]), (self.rects[i][0]+self.rects[i][2], self.rects[i][1]+self.rects[i][3]), (255, 0, 0), 5)
				"""
				If the object in ratio is high check the type of object
				"""
				#if object_in_ratio > 0.01:
				#result['intrusion'] = True
				#print "Intrusion Detected"
				cv2.rectangle(frame, (self.rects[i][0],self.rects[i][1]), (self.rects[i][0]+self.rects[i][2], self.rects[i][1]+self.rects[i][3]), (0, 0, 255), 5)
				frame_for_analysis = frame[self.rects[i][1]:self.rects[i][1]+self.rects[i][3], self.rects[i][0]:self.rects[i][0]+self.rects[i][2]]
				object_type = self.detector.send('frame',frame_for_analysis)
				#print object_type
				for i in xrange(len(object_type)):
					if object_type[i]['label'] == 'person' or object_type[i]['label'] == 'car':
						result['intrusion'] = 'true'
						result['object'] = object_type[i]['label']
			return result
			#send_end.send(result)
		except Exception as e:
			print "Intrusion{err}:"
			traceback.print_exc()
 
		#return result



# if __name__=='__main__':

# 	args1 = {
#                 "cam_id" : 1,
#                 "algos" : ["intrusion_detection"],
# 		"roi" : {1:[[5,5],[211,8],[211,211],[34,27],[3,234]] }
#         }	

# 	p = IntrusionWorker(args1)
# 	cap = cv2.VideoCapture(sys.argv[1])
	
# 	while(cap.isOpened()):
# 		_, frame = cap.read()
# 		ret_param = p.analyze(frame)
# 		print ret_param
