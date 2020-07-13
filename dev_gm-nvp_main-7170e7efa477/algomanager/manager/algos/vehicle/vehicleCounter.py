import traceback
import cv2
import time
import json
import traceback

from vehicle_detection import VehicleDetector
import sys
sys.path.insert(0, '/home/gmind/graymatics/development/graySmart/smart-surveillance/platform/algomanager/manager/algos/Kalman')
import kalmanWorker

class VehicleCounter(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(VehicleCounter, self).__init__()
		self.arg = arg
		self.__name = 'VEHICLE_TRACKING'
		self.detector = VehicleDetector()
		self.tracker = None
		try:
			self.kalman = kalmanWorker.KalmanWorker(arg['roi'])
		except:
			self.kalman = kalmanWorker.KalmanWorker({})
		self.total_count = 0
		#self.dumb = VehicleDetector.vehicles

	@property
	def name(self):
		return self.__name

	def analyze(self, frame, _id=None, scale=1):
		
		count = 0
		result = {}
		try:
			result['vehicle'] = {}
                	centers = []
                	det, frame = self.detector.runFrame(frame)
			
                	for (cent, class_name) in det:
                        	centers.append(cent)
			
			count = len(centers)

                	if len(centers) > 0:
                        	#print "CENTERS: {}".format(centers)
                        	res = self.kalman.Update(centers, frame)
				self.total_count = res
                        	for i in xrange(len(self.kalman.tracks)):
                                	if len(self.kalman.tracks[i].trace) > 1:
                                        	for j in xrange(len(self.tracks[i].trace)-1):
                                                	cv2.putText(frame, str(self.tracks[i].trackID+1), (self.tracks[i].prediction[0],self.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
                        result['count'] = count
			result['total'] = self.total_count

                except Exception as e:
                        print "PeopleWorker{err}:"
                        traceback.print_exc()
                return result


# if __name__=="__main__":

#         cap = cv2.VideoCapture('https://s3.amazonaws.com/acloudapi-video/vehicle-tracking/Graymatics_FaceRecognition.mp4')
#         p = VehicleCounter()
#         while(cap.isOpened()):
#                 _, frame  = cap.read()
#                 r = p.analyze(frame)
#                 print r
                                                         
