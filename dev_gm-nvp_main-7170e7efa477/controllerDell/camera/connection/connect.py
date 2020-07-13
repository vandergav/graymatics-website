import cv2
import base64
import requests

from interface.factory import InterfaceEnvironment

class Connect(object):
	def __init__(self, camera):
		self.camera = camera
		print "Connect: ",self.camera
		self.env = InterfaceEnvironment(self.camera)
		self.interface = self.env.interface
		self.camera.interface_env = self.interface
