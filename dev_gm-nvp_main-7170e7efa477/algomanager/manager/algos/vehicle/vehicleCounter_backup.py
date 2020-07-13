import traceback
import cv2
import sys
import time
import json
import traceback
import math

from  requests import post
import cPickle
from zmqclient_vehicle import zmqConnect

sys.path.insert(0, '/home/sadhna/graymatics/own/nvp/algomanager/manager/algos/Kalman')
import kalmanWorker_backup


def deepDetection(url="http://localhost:8085/detect/", frame=None):
	print frame.shape
	data = {"frame" : cPickle.dumps(frame)}
	response = post(url, data = data)
	print response.status_code
	print type(response.text)
	res = json.loads(response.text)
	if res['detect'] is not None:
		return cPickle.loads(str(res['detect']))
	else: return []


class VehicleCounter(object):
	"""docstring for VehicleCounter"""
	def __init__(self, arg=None):
		super(VehicleCounter, self).__init__()
		self.arg = arg	
		self.__name = 'VEHICLE_TRACKING'
		self.tracker = None
		self.min_dist = 170
		try:
			self.detector = zmqConnect()
		except Exception as e:
			print "ZMQ error : ", e
		try:
			self.kalman = kalmanWorker_backup.KalmanWorker(arg.roi)
		except:
			self.kalman = kalmanWorker_backup.KalmanWorker({})
		self.total_count = 0
		self.zmqCount = 0
	
	@property
	def name(self):
		return self.__name

	
	def magnitude(self, a, b):
		
		Xcord = (a[0] - b[0])**2
		Ycord = (a[1] - b[1])**2
		displ = math.sqrt(Xcord + Ycord)
		return displ

	def analyze(self, frame, send_end, _id=None,  scale=1):
		if self.zmqCount == 0:
			self.zmqCount += 1
			self.detector = zmqConnect()
		start_time = time.time()
		print frame.shape
		print("I am here in VehicleCounter")		
		count = 0
		box = []
		to_return = []
		result = {}
		try:
			result['vehicle'] = {}
			centers = []
			print frame.shape
			#(det, frame, res) = self.detector.runFrame(frame)	
			#res = deepDetection(frame=frame)
			
			res = self.detector.send('frame',frame)
			
			plate = " "
			print res
			for i in xrange(len(res)):
				cls =res[i]["label"]
				x,y,w,h = res[i]["topleft"]['x'], res[i]["topleft"]['y'], res[i]["bottomright"]['x'], res[i]["bottomright"]['y']
				center = ((res[i]["topleft"]['x']+res[i]["bottomright"]['x'])/2, (res[i]["topleft"]['y'] + res[i]["bottomright"]['y'])/2)
				if cls =='car' or cls == 'truck' or cls == 'motorbike':
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
			self.total_count = cnt
			for i in xrange(len(self.kalman.tracks)):
				for j in xrange(len(centers)):
					k = self.magnitude(self.kalman.tracks[i].prediction, res[j])
					#print("Min_dist:{}").format(k)
					if k < self.min_dist:
						result['vehicle'][self.kalman.tracks[i].trackID+1] = res[j]
					
						for i in xrange(len(self.kalman.tracks)):
							if len(self.kalman.tracks[i].trace) > 1:
									for j in xrange(len(self.kalman.tracks[i].trace)-1):
										print self.kalman.tracks[i].prediction
										#frame = cv2.putText(frame, str(self.kalman.tracks[i].trackID+1), (self.kalman.tracks[i].prediction[0],self.kalman.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
			result['count'] = count
			result['total'] = self.total_count
			result['plate'] = plate
		except Exception as e:
			print "VehicleWorker{err}:"
			traceback.print_exc()
		print "return : ",result 
		return result
		#send_end.send(result)

# if __name__=="__main__":

# 	#cap = cv2.VideoCapture('https://s3.amazonaws.com/acloudapi-video/vehicle-tracking/Graymatics_FaceRecognition.mp4')
# 	cap = cv2.VideoCapture(sys.argv[1])
# 	p = VehicleCounter()
# 	send_end = ''
# 	while(cap.isOpened()):
# 		_, frame  = cap.read()
# 		start_time = time.time()
# 		r = p.analyze(frame, send_end)
# 		print time.time() - start_time, r
