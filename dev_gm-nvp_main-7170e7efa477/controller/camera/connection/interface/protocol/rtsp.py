from protocol import Protocol

class RTSPProtocol(Protocol):
	def __init__(self, _token, _media_service):
		self.token = _token
		self.media_service = _media_service
		self.__stream_uri()
		self.__snapshot_uri()

	def __stream_uri(self, stream = 'RTP-Multicast', transport_protocol = 'UDP'):
		obj = self.media_service.create_type('GetStreamUri')
		obj.ProfileToken = self.token
		obj.StreamSetup.Stream = stream
		obj.StreamSetup.Transport.Protocol = transport_protocol
		
		_transport = {'Protocol':'RTSP'}
		StreamSetup = {'Stream' : 'RTP+multicast', 'Transport':_transport}
		args = {'StreamSetup' : StreamSetup, 'ProfileToken':self.token}
		# stream = media_service.GetStreamUri({'StreamSetup' : {'Stream' : 'RTP+unicast', 'Transport':{'Protocol':'UDP'}}, 'ProfileToken':token})
		stream = self.media_service.GetStreamUri(args)
		#print "RTSPProtocol:__stream_uri ", stream
		self.stream_url = stream.Uri

	def __snapshot_uri(self):
		token_obj = {'ProfileToken' : self.token}
		obj = self.media_service.GetSnapshotUri(token_obj)
		self.snapshot_url = obj.Uri
		print self.snapshot_url
