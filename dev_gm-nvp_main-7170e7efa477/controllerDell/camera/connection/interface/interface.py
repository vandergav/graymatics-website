class Interface(object):
	def __init__(self):
		self.__protocol = None

	def stream_url(self):pass

	@property
	def protocol(self):
		return self.__protocol

	@protocol.setter
	def protocol(self, _protocol):
		self.__protocol = _protocol

	def start_streaming(self): pass

	def stop_streaming(self): pass