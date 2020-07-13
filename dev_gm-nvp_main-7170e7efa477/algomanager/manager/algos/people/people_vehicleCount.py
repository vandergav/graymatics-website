import zmq
import numpy as np
import cv2
import json
import time
import zlib, cPickle as pickle
# import darknet_server as dn
import imageio
# imageio.plugins.ffmpeg.download()
from zmqclient import zmqConnect

class PersonVehicleCounter(object):
	"""docstring for PeoleCounter"""
	def __init__(self, arg=None):
		super(PersonVehicleCounter, self).__init__()
		self.arg = arg	

		#name of the algo
		self.__name = 'PEOPLE_VEHICLE_COUNTING'

		#Connect to zmqclient
		try:
			self.detector = zmqConnect()
		except Exception as e:
			print "ZMQ error : ", e


		##### add kalman tracker if needed
		# try:
		# 	self.kalman = kalmanWorker_backup.KalmanWorker(arg.roi)
		# 	# self.kalman = kalmanWorker_backup.KalmanWorker(json.loads(roi[0]))
		# except:
		# 	self.kalman = kalmanWorker_backup.KalmanWorker({})

	@property
	def name(self):
		return self.__name


	#edit analyse and write your function which accept the frame and can modify the detected result
	def analyze(self, frame,send_end,  _id=None,  scale=1):
		res = self.detector.send('frame',frame)
		result = {}
		entry_count = 0
		for obj in res:
			result[entry_count] = {}
			result[entry_count]['label'] = obj[0]
			result[entry_count]['confidence'] = obj[1]
			x, y, w, h = obj[2]
			result[entry_count]['left'] = int(x - 0.5 * w)
			result[entry_count]['right'] = int(x + 0.5 * w)
			result[entry_count]['top'] = int(y - 0.5 * h)
			result[entry_count]['bottom'] = int(y + 0.5 * h)
			entry_count += 1

		for entry_count in result.keys():
			for key, value in result[entry_count].items():
				print('{}: {}'.format(key, value))
			print('')
			cv2.rectangle(frame, (result[entry_count]['left'], result[entry_count]['top']), (result[entry_count]['right'], result[entry_count]['bottom']), (255, 255, 255), 2)
			cv2.putText(frame, result[entry_count]['label'], (result[entry_count]['left'], result[entry_count]['top'] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
		print result, type(result)
		return result
		#send_end.send(result)

'''

if __name__=="__main__":

	cap = cv2.VideoCapture('/home/sadhna/graymatics/development/vehicle.mp4')
	p = PersonVehicleCounter()
	send_end = ""
	i =0
	fps = cap.get(cv2.CAP_PROP_FPS)
	writer = imageio.get_writer('peopleVehicleCount.mp4', fps=fps)
	while(True):
		i +=1
		ret, frame  = cap.read()
		start_time = time.time()
		r = p.analyze(frame,send_end)
		frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
		writer.append_data(frame[:, :, ])
		cv2.imshow('video',frame)
		if (cv2.waitKey(1) & 0xFF) == ord('q'): # Hit `q` to exit
			break
		print "\n \n **********total :::" , time.time() - start_time
	cap.close()
	writer.close()
	cv2.destroyAllWindows()


'''