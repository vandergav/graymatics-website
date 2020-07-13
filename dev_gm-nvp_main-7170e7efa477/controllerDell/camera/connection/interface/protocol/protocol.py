class Protocol(object):

	def __init__(self):
		self.__token = None
		self.__media_service = None
		self.__stream_url = None
		self.__snapshot_url = None

	@property
	def token(self):
		return self.__token

	@token.setter
	def token(self, _token):
		self.__token = _token

	@property
	def media_service(self):
		return self.__media_service

	@media_service.setter
	def media_service(self, _media_service):
		self.__media_service = _media_service

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