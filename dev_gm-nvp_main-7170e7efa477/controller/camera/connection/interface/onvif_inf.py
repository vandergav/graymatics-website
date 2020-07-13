from onvif import ONVIFCamera
import re
import cv2
import time
import cPickle
import base64
import urllib2
import subprocess
from skimage import io
from multiprocessing import Process

from interface import Interface
from protocol.rtsp import RTSPProtocol
from asyncRabbit import Rabbit
from pred import Cache

class OnvifInterface(Interface):
	def __init__(self, arg):
		self.camera = arg

		# self.set_up()
		self.__protocol()
		# self.__snapshot_url()
		# self.__stream_url()
		# self.qhandler = Rabbit()
		# self.cacheHandler =  Cache()
		
		if self.camera.src is not None:
			self.camera.snapshot_url = self.camera.src
			self.camera.stream_url = self.camera.src

		self.__frame()

	def set_up(self, wsdl = "/usr/local/wsdl/"):
		self.cam = ONVIFCamera(self.camera.src, self.camera.port, self.camera.username, self.camera.passwd, wsdl_dir=wsdl)
		self.media_service = self.cam.create_media_service()
		self.profiles = self.media_service.GetProfiles()
		self.token = self.profiles[0]._token


	def __protocol(self):
		self.protocol = None
		# Get all video encoder configurations
		# configurations_list = media_service.GetVideoEncoderConfigurations()
		# if 'rtsp' == self.camera.protocol:
		# 	self.protocol = RTSPProtocol(self.token, self.media_service)


	def __stream_url(self):
		url = self.protocol.stream_url
		# TODO: auth
		# self.stream_url = "rtsp://admin:admin@192.168.1.250:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"
		if self.camera.username and self.camera.passwd:
			split = url.split("//")
			link = split[0] + self.camera.username + ":" + self.camera.passwd + "@" + split[1]
			print "onvif_inf:__stream_url ", link, split
			self.camera.stream_url = link
		else:
			self.camera.stream_url = url


	def __snapshot_url(self):
		self.camera.snapshot_url = self.protocol.snapshot_url
		self.camera.status = True

	def __frame(self):


		cam = cv2.VideoCapture(self.camera.snapshot_url)
		# retry for 10 times
		for _ in range(0,10):
			ret, frame = cam.read()
			frame_shape = list(frame.shape)

			if ret:
				# convert to base64
				retval, buffer = cv2.imencode('.jpg', frame)
				self.camera.frame = "data:image/jpg;base64,"+base64.b64encode(buffer)
				self.camera.shape = frame_shape[:-1]
				break


		# auth_type, realm = self.get_realm(self.camera.snapshot_url)
		# self.install_opener(self.camera.snapshot_url, auth_type, self.camera.username, self.camera.passwd)
		# image = io.imread(self.camera.snapshot_url)
		# # RGB -> BGR
		# image = image[:,:,::-1]
		# # convert to base64
		# retval, buffer = cv2.imencode('.jpg', image)
		# self.camera.frame = "data:image/jpg;base64,"+base64.b64encode(buffer)
		
	def get_realm(self, url):
		auth_type = None
		realm = None
		try:
			cmd = 'curl -I {}'.format(url)
			p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
			p.wait()
			out, err = p.communicate()
			#print out
			#print err
			re_realm = re.search(r"WWW-Authenticate:\s{1}(?P<type>[a-zA-Z]+)\s{1}(realm\=\")(?P<realm>([a-zA-Z0-9 ]+))\"", out, re.DOTALL)	
			if re_realm is not None:
				t = re_realm.groupdict()
				auth_type =  t['type']
				realm = t['realm']	
		except Exception as e:
			raise e
		return auth_type, realm

	def install_opener(self, url, auth_type=None, username='admin', password='admin'):
		mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
		mgr.add_password(None, url, username, password)
		opener = None
		if auth_type == "Digest":
			opener = urllib2.build_opener(urllib2.HTTPDigestAuthHandler(mgr))
		elif auth_type == "Basic":
			opener = urllib2.build_opener(urllib2.HTTPBasicAuthHandler(mgr))
		else:
			opener = urllib2.build_opener(urllib2.HTTPBasicAuthHandler(mgr), urllib2.HTTPDigestAuthHandler(mgr))
		urllib2.install_opener(opener)


	def start_streaming(self):
		# self.camera.q = "surv_{}".format(self.camera.id)
		# self.qhandler.initProduce(self.camera.q)
		# self.proc = Process(target=self.live)
		# self.proc.daemon = True
		# self.proc.start()
		#print "START STREAMING"
		pass


	def live(self):
		stream_url = self.camera.stream_url
		##setup Queue
		##Enq frame with header-info === Camera obj
		##need multiprocess + multithreading.
		#print "LIVE : ONVIF"
		cam = cv2.VideoCapture(stream_url)
		i = 0;
		while True:
			i = i+1
			ret, frame = cam.read()
			if ret:
				# produce
				header = {}
				header['id'] = self.camera.id
				header['user_id'] = self.camera.user_id
				header['algos'] = self.camera.algos
				key = "{}_{}_{}".format(self.camera.id, i, time.time())
				self.cacheHandler.hset(key, "frame", cPickle.dumps(frame))
				#print self.camera.id, i, frame.shape
				# self.cacheHandler.SetValue(key, cPickle.dumps(frame))
				header['frame_id'] = key
				header['time_stamp'] = time.time() # get time stamp of camera
				header['roi'] = self.camera.roi
				header['callback_url'] = self.camera.callback_url
				self.qhandler.produce(self.camera.q, header)
			pass


	def stop_streaming(self):
		self.camera.q = "surv_{}".format(self.camera.id)
		#stop the streaming
		self.qhandler.close(self.camera.q)
		# self.qhandler.stopConsuming(self,channel)
		# stop the process
		self.proc.stop()
		pass


	def download_image(self, url, dst):
		page = urllib2.urlopen(url)
		meta = page.info()
		file_size = int(meta.getheaders("Content-Length")[0])
		#print meta
		file_size_dl = 0
		block_sz = 8192
		f = open(dst, 'wb')
		#print dst
		while True:
			buffer = page.read(block_sz)
			if not buffer: break
			file_size_dl += len(buffer)
			f.write(buffer)
			progress = r"%10d  [%3.2f%%]" % (file_size_dl, file_size_dl * 100. / file_size)
			progress = progress + chr(8)*(len(progress)+1)
			#print progress
		f.close()
