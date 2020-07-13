import cv2
import time
import base64
import cPickle
import eventlet
import json
import logging
import threading
import traceback
import numpy as np
from skimage import io
from datetime import datetime
from multiprocessing import Process


from pred import Cache
from protocol.s3 import S3
from asyncRabbit import Rabbit
from interface import Interface

logger = logging.getLogger(__name__)

eventlet.monkey_patch()
def url_to_image(args, index, url, cacheHandler):
	try:
		logger.debug({"api"  : "S3 Controller", "CPU usage " : psutil.cpu_percent(), "memory usage " : psutil.virtual_memory()})
		# print "url ", index, url
		start_time = time.time()
		with eventlet.Timeout(5):
			image = io.imread(url)
			# convert image from RGB -> BGR
			image = image[:,:,::-1] 
			scale = 1
			# scale, image = resize(image)
			try:
				if image.shape[0] > 0:
					fr_name = url.split('/')[-1]
					fr_name = fr_name.split('.')[0]
					args["frame_name"] = fr_name

					key = "{}_{}_{}".format(args["id"], index, time.time())
					# print "pickle: ", cacheHandler.hset(key, "frame", cPickle.dumps(image))
					# print "pickle Val: ", cacheHandler.hget(key, "frame")
					if True: #cacheHandler.hset(key, "frame", cPickle.dumps(image)):
						args['frame_id'] = key
						args["frame_src"] = url
						args["frame"] = str(cPickle.dumps(image))
						args["scale"] = scale
						# print "url_to_image: ", args
			except Exception as e:
				traceback.print_exc()
			# print image.shape, args['frame_id']
			# print "download time {}/{} : {} {}".format(args['id'], index, time.time()-start_time, url)
		print "kry : ", key, "   time each frame : ", time.time()-start_time
		logger.debug({"kry : ":  key, "   time each frame : " : time.time()-start_time})
	except Exception as e:
		traceback.print_exc()



class StorageInterface(Interface):
	def __init__(self, arg):
		self.camera = arg
		self.protocol = 's3'
		self.bucket = "smart-surveillance"
		self.key = self.camera.src
		self.imgs = []
		self.__protocol()
		self.__snapshot_url()
		self.__stream_url()
		self.__frame()
		self.qhandler = Rabbit()
		self.cacheHandler =  Cache()



	#check
	def __protocol(self):
		# Get all video encoder configurations
		# configurations_list = media_service.GetVideoEncoderConfigurations()
		self.protocol = S3()#self.bucket, self.key)
		#print ' bucket ', self.bucket, ' key ', self.key
		self.objects = self.protocol.list_objects(self.bucket, self.key)


	def __stream_url(self):
		self.camera.stream_url = "{}/{}".format(self.bucket, self.key)


	def __snapshot_url(self):
		for __object in self.objects:
			if len(__object.key.split('.')) < 2:
				continue
			self.imgs.append(__object.key)
		self.imgs.sort()
		
		self.camera.snapshot_url = self.imgs[0]
		self.camera.status = True


	def __frame(self):
		#print "StorageInterface:__frame E", self.camera.snapshot_url
		url = self.camera.snapshot_url
		dst = './test_{}.jpg'.format(self.key.split('/')[0])
		self.protocol.downloadFile(self.bucket, url, dst)
		img = cv2.imread(dst)
		retval, buffer = cv2.imencode('.jpg', img)
		b64 = "data:image/jpg;base64,"+base64.b64encode(buffer)
		self.camera.frame = b64
		print "StorageInterface:__frame X"


	def start_streaming(self):
		# run a subprocess
		# store process id
		# delete the process on camera stop.
		# create Q - producer
		# Q name = surv_camera-id
		self.camera.q = "surv_{}".format(self.camera.id)
		self.qhandler.initProduce(self.camera.q)

		self.proc = Process(target=self.live)
		self.proc.daemon = True
		self.proc.start()
		pass


	def live(self):
		stream_url = self.camera.stream_url
		##setup Queue
		##Enq frame with header-info === Camera obj
		##need multiprocess + multithreading.
		ind = 0;
		num_threads = 1
		base = self.protocol.base_url(self.bucket)

		while True:
			try:
				threads = {}
				for i in range(0, num_threads):
					threads[i] = {}
					img = "%s%s"%(base, self.imgs[ind])
					ind = (ind+1)%len(self.imgs)
					
					header = {}
					header['id'] = self.camera.id
					header['user_id'] = self.camera.user_id
					header['algos'] = self.camera.algos
					header['time_stamp'] = time.time() # get time stamp of camera
					header['roi'] = self.camera.roi
					header['callback_url'] = self.camera.callback_url
					header["time_stamp"] = datetime.now().strftime("%A %d %B %Y %I:%M:%S%p")
					threads[i]['msg'] = header
					th = threading.Thread(target=url_to_image, args=(header, ind, img, self.cacheHandler))
					th.start()
					threads[i]['thread'] = th

				for i in range(0, num_threads):
					th = threads[i]['thread']
					th.join()
					msg = threads[i]['msg']
					#print "publish ", msg
					#time.sleep(1)	
					#print "\n"
					if "frame_id" in msg:
						self.qhandler.produce(self.camera.q, msg)
						time.sleep(0.5)

			except Exception as e:
				traceback.print_exc()


	def stop_streaming(self):
		if self.proc.is_alive(): 
			self.proc.terminate()
		

	def __del__(self):
		self.stop_streaming()
		del self.proc
		del self.camera
		del self.protocol
		del self.bucket
		del self.key
		del self.imgs
		del self.qhandler
		del self.cacheHandler
