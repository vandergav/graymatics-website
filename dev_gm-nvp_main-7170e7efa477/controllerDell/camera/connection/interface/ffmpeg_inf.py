from interface import Interface

class FFMpegInterface(Interface):
	def __init__(self, arg):
		self.camera = arg

	def stream_url(self):
		pass