import traceback
import cv2
import time
import json
import traceback
import math

from person_detection import PersonDetector
import sys
sys.path.insert(0, '/home/gmind/graymatics/development/graySmart/smart-surveillance/platform/algomanager/manager/algos/Kalman/')
import kalmanWorker

class PersonCounter(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(PersonCounter, self).__init__()
		self.arg = arg	
		self.__name = 'PEOPLE_TRACKING'
		self.detector = PersonDetector()
		self.tracker = None
		try:
			self.kalman = kalmanWorker.KalmanWorker(arg['roi'])
		except:
			self.kalman = kalmanWorker.KalmanWorker({})
		self.total_count = 0

	@property
	def name(self):
		return self.__name

	
	def magnitude(self, a, b):
		
		Xcord = (a[0] - b[0])**2
		Ycord = (a[1] - b[1])**2
		displ = math.sqrt(Xcord + Ycord)

	def analyze(self, frame, _id=None,  scale=1):
		
		count = 0
		result = {}
		try:
			result['person'] = {}
                	centers = []
                	(det, frame, res) = self.detector.runFrame(frame)
                	for (cent, class_name) in det:
                        	centers.append(cent)

			count = len(centers)
                	if len(centers) > 0:
                        	#print "CENTERS: {}".format(centers)
                        	cnt = self.kalman.Update(centers, frame)
				self.total_count = cnt
				for p in range(len(centers)):
					result['person'][res['id'][p]] = {'box' : res['box'][p]}
                        	for i in xrange(len(self.kalman.tracks)):
                                	if len(self.kalman.tracks[i].trace) > 1:
                                        	for j in xrange(len(self.kalman.tracks[i].trace)-1):
							print self.kalman.tracks[i].prediction
                                                	frame = cv2.putText(frame, str(self.kalman.tracks[i].trackID+1), (self.kalman.tracks[i].prediction[0],self.kalman.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
			result['count'] = count
			result['total'] = self.total_count
                except Exception as e:
                        print "PeopleWorker{err}:"
                        traceback.print_exc()
		return result

# if __name__=="__main__":

# 	cap = cv2.VideoCapture('https://s3.amazonaws.com/acloudapi-video/vehicle-tracking/Graymatics_FaceRecognition.mp4')
# 	p = PersonCounter()
# 	while(cap.isOpened()):
# 		_, frame  = cap.read()
# 		start_time = time.time()
# 		r = p.analyze(frame)
# 		print time.time() - start_time, r
