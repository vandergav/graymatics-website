from state import State
import json

class __Node(object):
	"""docstring for __Node
		Internal/private for camera attributes.
		Implements attributes getter and setter.
	"""

	def __init__(self):
		self.__id = None
		self.__name = None
		self.__username = None
		self.__passwd = None
		self.__user_id = None

		self.__fps = None
		self.__src = None
		self.__port = None
		self.__encoder = None # H.264/H.265/MPEG...
		self.__channel = None
		self.__protocol = None # RTSP/RTMP/HLS...
		self.__interface = None # ONVIF/FFMPEG.../Storage(for S3/Minio)
		self.__stream_url = None
		self.__snapshot_url = None
		# self.__interface_env = None

		self.__frame = None
		self.__status = None
		# self.__q = None

		self.__roi = None
		self.__algos = None
		self.__add_info = None
		self.__parameters = None
		self.__callback_url = None
		

	@property
	def id(self):
		return self.__id
	
	@id.setter
	def id(self, _id):
		self.__id = _id

	@property
	def username(self):
		return self.__username

	@username.setter
	def username(self, _username):
		self.__username = _username

	@property
	def passwd(self):
		return self.__passwd

	@passwd.setter
	def passwd(self, _passwd):
		self.__passwd =  _passwd

	@property
	def roi(self):
		return self.__roi
	
	@roi.setter
	def roi(self, _roi):
		self.__roi = _roi

	@property
	def fps(self):
		return self.__fps
	
	@fps.setter
	def fps(self, _fps):
		self.__fps = _fps

	@property
	def src(self):
		return self.__src
	
	@src.setter
	def src(self, _src):
		self.__src = _src

	@property
	def port(self):
		return self.__port
	
	@port.setter
	def port(self, _port):
		self.__port = _port

	@property
	def user_id(self):
		return self.__user_id
	
	@user_id.setter
	def user_id(self, _user_id):
		self.__user_id = _user_id

	@property
	def name(self):
		return self.__name
	
	@name.setter
	def name(self, _name):
		self.__name = _name

	@property
	def algos(self):
		return self.__algos
	
	@algos.setter
	def algos(self, _algos):
		self.__algos = _algos

	@property
	def encoder(self):
		return self.__encoder
	
	@encoder.setter
	def encoder(self, _encoder):
		self.__encoder = _encoder

	@property
	def channel(self):
		return self.__channel

	@channel.setter
	def channel(self, _channel):
		self.__channel = _channel

	@property
	def protocol(self):
		return self.__protocol
	
	@protocol.setter
	def protocol(self, _protocol):
		self.__protocol = _protocol

	@property
	def interface(self):
		return self.__interface

	@interface.setter
	def interface(self, _interface):
		self.__interface = _interface

	@property
	def add_info(self):
		return self.__add_info
	
	@add_info.setter
	def add_info(self, _add_info):
		self.__add_info = _add_info


	@property
	def parameters(self):
		return self.__parameters
	
	@parameters.setter
	def parameters(self, _parameters):
		self.__parameters = _parameters


	@property
	def callback_url(self):
		return self.__callback_url
	
	@callback_url.setter
	def callback_url(self, _callback_url):
		self.__callback_url = _callback_url

	@property
	def status(self):
		return self.__status
	
	@status.setter
	def status(self, _status):
		self.__status = _status

	@property
	def frame(self):
		return self.__frame

	@frame.setter
	def frame(self, _frame):
		self.__frame = _frame

	@property
	def stream_url(self):
		return self.__stream_url

	@stream_url.setter
	def stream_url(self, _stream_url):
		self.__stream_url = _stream_url

	@property
	def snapshot_url(self):
		return self.__snapshot_url

	@snapshot_url.setter
	def snapshot_url(self, _snapshot_url):
		self.__snapshot_url = _snapshot_url

	def interface_env():
	    doc = "The interface_env property."
	    def fget(self):
	        return self._interface_env
	    def fset(self, value):
	        self._interface_env = value
	    def fdel(self):
	        del self._interface_env
	    return locals()
	interface_env = property(**interface_env())

	def q():
	    doc = "The q property."
	    def fget(self):
	        return self._q
	    def fset(self, value):
	        self._q = value
	    def fdel(self):
	        del self._q
	    return locals()
	q = property(**q())

	def __del__(self):
		del self

class Camera(__Node):
	"""docstring for Camera
		Camera node with it's attributes.
	"""
	#print "CAMERA ::: "
	def __init__(self, arg):
		self.arg = arg
		self.__set_values()

	def update(self, arg):
		self.arg = arg
		self.__set_values()

	def __set_values(self):
		""" internal function for setting up camera attribute values.
		"""
		self.id = int(self.arg['cam_id'][0]) if 'cam_id' in self.arg else None
		self.roi = self.arg['roi'] if 'roi' in self.arg else None
		self.media_type = str(self.arg['media_type'][0]) if 'media_type' in self.arg else None
		self.fps = int(self.arg['fps'][0]) if 'fps' in self.arg else None
		self.src = str(self.arg['src'][0]) if 'src' in self.arg else None
		self.port = int(self.arg['port'][0]) if 'port' in self.arg else None
		self.user_id = int(self.arg['user_id'][0]) if 'user_id' in self.arg else None
		self.username = str(self.arg['username'][0]) if 'username' in self.arg else None
		self.passwd = str(self.arg['passwd'][0]) if 'passwd' in self.arg else None
		self.name = str(self.arg['name'][0]) if 'name' in self.arg else None
		self.algos = json.loads(self.arg['algos'][0] )if 'algos' in self.arg else None
		self.encoder = str(self.arg['encoder'][0]) if 'encoder' in self.arg else None
		self.channel = str(self.arg['channel'][0]) if 'channel' in self.arg else None
		self.protocol = str(self.arg['protocol'][0]) if 'protocol' in self.arg else None
		self.interface = str(self.arg['interface'][0]) if 'interface' in self.arg else None
		self.add_info = self.arg['add_info'] if 'add_info' in self.arg else None
		self.parameters = self.arg['parameters'] if 'parameters' in self.arg else None
		self.callback_url = str(self.arg['callback_url'][0]) if 'callback_url' in self.arg else None
		# default initialization
		self.status = State.FAIL
		self.frame = None
		self.stream_url = None
		self.snapshot_url = None
		self.interface_env = None
		self.shape = None
		self.q = None
		x = {"id"  :  self.id, "roi" :self.roi, "fps" :self.fps,  "src" : self.src, "port" : self.port, "user_id": self.user_id, "passwd" : self.passwd, "algos" : self.algos, "encoder" : self.encoder, "channel" : self.channel, "protocol" : self.protocol,"interface": self.interface, "interface_env" : self.interface_env }
		print "features : ", x
	def __str__(self):
		_str = "\n\
		id : {}\n\
		name : {}\n\
		user : {}\n\
		stream : {}\n\
		algos : {}\
		".format(self.id, self.name, self.user_id, self.stream_url, self.algos)
		return _str

	def __del__(self):
		super(type(self), self).__del__()
		del self.arg


