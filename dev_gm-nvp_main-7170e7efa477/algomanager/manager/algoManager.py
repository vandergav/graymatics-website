import os
import sys
import cv2
import time
import json
import glob
import base64
import psutil
import cPickle
import datetime
import threading
sys.path.append('../')
import logging
import logger
import traceback
import numpy as np
from dsQueue import Queue
from multiprocessing import Process, Pipe

# from asyncRabbit import Rabbit
from callback import post_callback
# from algos.people.peopleCount import PersonCounter
# from algos.people.peopleTracking import PersonTracker
# from algos.vehicle.vehicleCount import VehicleCounter
# from algos.vehicle.vehicleTracking import VehicleTracker
# from algos.intrusion.intrusionDetector import IntrusionWorker
# from algos.themes.themesClassification import themesClassifier

from algos.people.personCounter_backup import PersonCounter
from algos.vehicle.vehicleCounter_backup import VehicleCounter
from algos.intrusion.intrusionDetector import IntrusionWorker
from algos.people1.people_vehicleCount import PersonVehicleCounter


def algo_instance(algo, args):

	if "PERSON_TRACKING" == algo.upper():
		# print "argS : ", args
		return PersonCounter(args)
	elif "VEHICLE_TRACKING" == algo.upper():
		# print "argS : ", args
		return PersonVehicleCounter(args)
	elif "INTRUSION" == algo.upper():
		return IntrusionWorker(args)

	# if "PEOPLE_COUNT" == algo.upper():
	# 	return PersonCounter(args)
	# elif "VEHICLE_COUNT" == algo.upper():
	# 	return VehicleCounter(args)
	# elif "PERSON_TRACKING" == algo.upper():
	# 	return PersonTracker(args)
	# elif "VEHICLE_TRACKING" == algo.upper():
	# 	return VehicleTracker(args)
	# elif "VEHICLE_SPEED" == algo.upper():
	# 	return VehicleCounter(args)
	# elif "THEMES" == algo.upper():
	# 	return themesClassifier(args)
def roi_data(camera):
	stream = cv2.VideoCapture(camera.stream_url)
	vid_len = int(stream.get(cv2.CAP_PROP_FRAME_COUNT))

	ret, frame = stream.read()
	h, w,c = frame.shape
	roi = {}
	if ret:
		roi["image"] = {}
		roi["image"]["width"] = w
		roi["image"]["height"] = h
		roiPoints = json.loads(camera.roi[0])
		roi = {"image" : {"height" : h, "width" : w}, "roiPoints" : roiPoints}
		return roi, vid_len

	else :
		return camera.roi, vid_len


class AlgoManager(object):
	# print "HJHGJHJHHLH"
	"""docstring for AlgoManager"""
	def __init__(self, arg=None):
		super(AlgoManager, self).__init__()
		self.camera = arg
		# self.qhandle = Rabbit()
		self.algos = []

		self.start_camera(self.camera)

	
	def stop_camera(self):
		if self.proc.is_alive(): 
			self.proc.terminate()


	def start_camera(self, camera):
		info, vid_len = roi_data(camera)
		camera.roi = info
		camera.video_length = vid_len
		if type(camera.algos) == str:
			for algo in json.loads(camera.algos[0]):
				print "ALGO START if: ", algo, type(algo)
				self.algos.append(algo_instance(str(algo), camera))
				print "appended algo : ", self.algos
		else:
			for algo in (camera.algos):
				print "ALGO START else : ", algo, type(algo)
				self.algos.append(algo_instance(str(algo), camera))
				print "appended algo : ", self.algos

		#start q listener in thread, for storage protocol
		if "s3" == self.camera.interface.lower():
			pass
			# self.qhandle.initConsume(camera.q, self.camera_manager)
			# self.proc = Process(target=self.qhandle.consume)
			# self.proc.daemon = False
			# self.proc.start()

		# start direct streaming
		elif "onvif" == self.camera.interface.lower():
			if "camera" == self.camera.media_type.lower():
				self.proc = Process(target=self.stream_analyzer)
				self.proc.daemon = False
				self.proc.start()

			elif "video" == self.camera.media_type.lower():
				self.proc = Process(target=self.storage_analyzer)
				self.proc.daemon = False
				self.proc.start()

	def stream_analyzer(self):
		stream = cv2.VideoCapture(self.camera.stream_url)
		#stream = cv2.VideoCapture("/home/ubuntu/smart-surveillance/platform/algomanager/manager/algos/anpr/NVR-6_IP Camera10_NVR-6_20170829100000_20170829101000_2645179.mp4")
				
		frame_id = 0
		while True:
			logger.setup_logger(self.camera.name,str(datetime.datetime.today().date())+"_"+ str(self.camera.id)+'.log')
			logger_1 = logging.getLogger(self.camera.name)
			logger_1.debug({"api"  :  "Before RTSP Streaming", "CPU usage " : psutil.cpu_percent(), "memory usage " : psutil.virtual_memory()})
			start_time = time.time()
			ret, frame = stream.read()
			if not ret:
				# retry connection
				for _ in range(0,20):
					time.sleep(0.5)
					start_time = time.time()
					try:
						ret, frame = stream.read()
						logger_1.debug({"camera_id ": self.camera.id, "RET " : ret, "frame_id " :frame_id, "try " : _})
					except Exception as e :
						logger_1.debug({"error" : str(e), "cam_id" : self.camera.id})
						#logger.error({"error" : e, "cam_id" : self.camera.id})	
					if ret:
						break
			if not ret:
				break;
			time_stamp = time.time()
			frame_id += 1
			result = {}
			#frame = cv2.resize(frame, (480, 640), interpolation = cv2.INTER_AREA)
			logger_1.debug({"cam_id" :self.camera.id, "frame_id" : frame_id,"time to get frame " : time_stamp-start_time,  "api"  :  "After RTSP Streaming", "CPU usage " : psutil.cpu_percent(), "memory usage " : psutil.virtual_memory()})
					
			send_end = ""
			print "self.algos : ", self.algos

			for algo in self.algos:
				# print "ALGO : ", algo, algo.name
				try:
					result[algo.name] = algo.analyze(frame, send_end)
					# print "Result : " , result[algo.name]
					logger_1.debug({"noerror" : result})
				except Exception as e:
					# print "NOOOOOOOOOOOOOOOOOOOOoooo"
					logger_1.debug({"error" : e, "Algo" : algo})
			
			sendAlgo_time = time.time()
			retval, buffer = cv2.imencode('.jpg', frame)
			b64 = "data:image/jpg;base64,"+base64.b64encode(buffer)
			logger_1.debug({"api"  :  "RTSP Algo", "CPU usage " : psutil.cpu_percent(), "memory usage " : psutil.virtual_memory()})
			# trigger callback_url
			# print "result :::: ", result
			message = {}
			message['cam_id'] = self.camera.id
			message['user_id'] = self.camera.user_id
			message['cam_name'] = self.camera.name
			message['frame_id'] = frame_id
			message['frame_src'] = b64
			message['time_stamp'] = time_stamp
			message['media_type'] = "camera"
			message['result'] = json.dumps(result)
			c_t = time.time()
			#time.sleep(0.5)
			response = post_callback(self.camera.callback_url, message)
			message.pop('frame_src', None)
			ack_time = time.time()
			logger_1.debug({"camera Id ": self.camera.id,  "fram_id" :frame_id,"message ": message, "time to get the frame " : time_stamp-start_time,"frame time+detection" : ack_time-start_time,"algoSend time " :sendAlgo_time-time_stamp, "detection time acknowlege " :ack_time-c_t})
			time.sleep(.05)		
		stream.release()	
			
