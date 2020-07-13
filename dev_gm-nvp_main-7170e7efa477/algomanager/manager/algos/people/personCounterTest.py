import traceback
import cv2
import sys
import zmq
import time
import json
import traceback
import math
from  requests import post
import cPickle
sys.path.append('../../../')
import logging
import logger
from zmqclient import zmqConnect
sys.path.insert(0, '/home/gmind/graymatics/development/graySmart/smart-surveillance/platform/algomanager/manager/algos/Kalman/')
import kalmanWorkerTest

logger.setup_logger("people",'people.log')
logger_1 = logging.getLogger("people")


def deepDetection(url="http://localhost:8085/detect/", frame=None):
        print frame.shape
        data = {
        "frame" : cPickle.dumps(frame)
        }
	#socket.send("%d" %(data))
	response = post(url, data = data)
        print response.status_code
        print type(response.text)
        res = json.loads(response.text)
	print res
	if res['detect'] is not None:
        	return cPickle.loads(str(res['detect']))
	else: return []
	

class PersonCounter(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(PersonCounter, self).__init__()
		self.arg = arg	
		self.__name = 'PEOPLE_TRACKING'
		self.tracker = None
		self.min_dist = 170
		
		print "args : ", self.arg
		try:
			# self.kalman = kalmanWorker_backup.KalmanWorker(arg.roi)
			self.kalman = kalmanWorkerTest.KalmanWorker(self.arg)
		except:
			self.kalman = kalmanWorkerTest.KalmanWorker({})
		self.total_count = 0
		#self.detector = zmqConnect()

	@property
	def name(self):
		return self.__name

	
	def magnitude(self, a, b):
		
		Xcord = (a[0] - b[0])**2
		Ycord = (a[1] - b[1])**2
		displ = math.sqrt(Xcord + Ycord)
		return displ

	def analyze(self, frame,send_end, _id=None,  scale=1):
		print("I am here in PersonCounter")		
		count = 0
		box = []
		to_return = []
		result = {}
		try:
			result['person'] = {}
                	centers = []
			print("I am here just about to analyze")
			print frame.shape
			t = time.time()	
			try:
				self.detector = zmqConnect()
			except Exception as e:
				print "ZMQ error : ", e
				logger_1.debug({"Api " : "person Count", "error": str(e)})
			res = self.detector.send('frame',frame)
			print("Detection time: {}").format(time.time() -t)
			#print res
			print("I have done the analysis")
			
			for i in xrange(len(res)):
				cls =res[i]["label"]
				x,y,w,h = res[i]["topleft"]['x'], res[i]["topleft"]['y'], res[i]["bottomright"]['x'], res[i]["bottomright"]['y']
				center = ((res[i]["topleft"]['x']+res[i]["bottomright"]['x'])/2, (res[i]["topleft"]['y'] + res[i]["bottomright"]['y'])/2)
				if cls =='person':
					box.append([x,y,w,h])
					to_return.append((center,cls))
					cv2.rectangle(frame,(res[i]["topleft"]['x'],res[i]["topleft"]['y']),(res[i]["bottomright"]['x'], res[i]["bottomright"]['y']),(255,255,255),3)

			det, res = (to_return, box)
							
                	for (cent, class_name) in det:
                        	centers.append(cent)

			count = len(centers)
                	if len(centers) > 0:
                        	#print "CENTERS: {}".format(centers)
                        	cnt, id_dict = self.kalman.Update(res, frame)
                        	print "\n ---------------cbt : ", cnt
				self.total_count = cnt
				for i in xrange(len(self.kalman.tracks)):
					for j in xrange(len(centers)):
						k = self.magnitude(self.kalman.tracks[i].prediction, res[j])
						#print("Min_dist:{}").format(k)
						if k < self.min_dist:
							result['person'][self.kalman.tracks[i].trackID+1] = res[j]
						
                        	for i in xrange(len(self.kalman.tracks)):
                                	if len(self.kalman.tracks[i].trace) > 1:
                                        	for j in xrange(len(self.kalman.tracks[i].trace)-1):
							print self.kalman.tracks[i].prediction
                                                	#frame = cv2.putText(frame, str(self.kalman.tracks[i].trackID+1), (self.kalman.tracks[i].prediction[0],self.kalman.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
			result['count'] = count
			result['total'] = self.total_count
                except Exception as e:
                        print "PeopleWorker{err}:"
                        traceback.print_exc()
		print("RESULTTTTTT: {}").format(result)
		return result
		#send_end.send(result)

# if __name__=="__main__":

# 	cap = cv2.VideoCapture('/home/gmind/graymatics/development/videoProceesing/crp/ch05_20171231172453.mp4')
	
# 	send_end = ""
# 	i =0 
# 	while(True):
# 		i =i +1
# 		ret, frame  = cap.read()
		
# 		if i == 1 :
# 			h, w,c = frame.shape
# 			roi = {}
# 			roi["image"] = {}
# 			roi["image"]["width"] = w
# 			roi["image"]["height"] = h
# 			roiPoints = [[200.22328411314433, 144.9001906917531], [1446.26563367495876, 600.9034189702908]]
# 			roi = {"image" : {"height" : h, "width" : w}, "roiPoints" : roiPoints}

# 			p = PersonCounter(roi)
# 		start_time = time.time()
		
# 		r = p.analyze(frame, send_end)
# 		print r
# 		if ret :
# 			cv2.imshow('frame',frame)
# 			if cv2.waitKey(1) & 0xFF == ord('q'):
# 				break
# 		print time.time() - start_time, r
