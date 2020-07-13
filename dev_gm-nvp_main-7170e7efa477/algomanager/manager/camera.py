from state import State

class __Node(object):
	"""docstring for __Node
		Internal/private for camera attributes.
		Implements attributes getter and setter.
	"""

	def __init__(self):
		self.__id = None
		self.__name = None
		self.__user_id = None
		self.__stream_url = None
		self.__status = None

		self.__roi = None
		self.__algos = None
		self.__add_info = None
		self.__parameters = None

	@property
	def id(self):
		return self.__id
	
	@id.setter
	def id(self, _id):
		self.__id = _id

	@property
	def roi(self):
		return self.__roi
	
	@roi.setter
	def roi(self, _roi):
		self.__roi = _roi

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
	def stream_url(self):
		return self.__stream_url

	@stream_url.setter
	def stream_url(self, _stream_url):
		self.__stream_url = _stream_url

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

	def interface():
		doc = "The camera interface property."
		def fget(self):
			return self._interface
		def fset(self, value):
			self._interface = value
		def fdel(self):
			del self._interface
		return locals()
	interface = property(**interface())



	def callback_url():
		doc = "The camera callback_url property."
		def fget(self):
			return self._callback_url
		def fset(self, value):
			self._callback_url = value
		def fdel(self):
			del self._callback_url
		return locals()
	callback_url = property(**callback_url())


	def manager():
		doc = "The algo manager property."
		def fget(self):
			return self._manager
		def fset(self, value):
			self._manager = value
		def fdel(self):
			del self._manager
		return locals()
	manager = property(**manager())

	def __del__(self):
		del self


class Camera(__Node):
	"""docstring for Camera
		Camera node with it's attributes.
	"""
	def __init__(self, arg):
		self.arg = arg
		self.__set_values()

	def update(self, arg):
		self.arg = arg
		self.__set_values()

	def __set_values(self):
		""" internal function for setting up camera attribute values.
		"""
		# self.id = int(self.arg['cam_id'][0]) if 'cam_id' in self.arg else None
		self.id = str(self.arg['cam_id'][0]) if 'cam_id' in self.arg else None
		self.roi = self.arg['roi'] if 'roi' in self.arg else None
		self.media_type = str(self.arg['media_type'][0]) if 'media_type' in self.arg else None
		# self.user_id = int(self.arg['user_id'][0]) if 'user_id' in self.arg else None
		self.user_id = str(self.arg['user_id'][0]) if 'user_id' in self.arg else None
		self.name = str(self.arg['name'][0]) if 'name' in self.arg else None
		self.q = str(self.arg['qname'][0]) if 'qname' in self.arg else None
		self.interface = str(self.arg['interface'][0]) if 'interface' in self.arg else None
		self.stream_url = str(self.arg['stream_url'][0]) if 'stream_url' in self.arg else None
		self.algos = self.arg['algos'] if 'algos' in self.arg else None
		self.add_info = self.arg['add_info'] if 'add_info' in self.arg else None
		self.parameters = self.arg['parameters'] if 'parameters' in self.arg else None
		self.callback_url = str(self.arg['callback_url'][0]) if 'callback_url' in self.arg else None
		self.video_length = None
		# default initialization
		self.status = State.FAIL
		self.manager = None

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