from onvif_inf import OnvifInterface
from ffmpeg_inf import FFMpegInterface
from storage_inf import StorageInterface

class InterfaceEnvironment(object):
	def __init__(self, arg):
		self.camera = arg
		self.interface = self.make_interface()
		self.protocol = self.interface.protocol

	def make_interface(self):
		_interface = self.camera.interface.lower()
		if 'onvif' == _interface:
			return OnvifInterface(self.camera)
		if 'ffmpeg' == _interface:
			return FFMpegInterface(self.camera)
		if 'storage' == _interface:
			return StorageInterface(self.camera)
