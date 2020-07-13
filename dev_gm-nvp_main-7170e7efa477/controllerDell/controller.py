import loggers
import logging
import tornado.web
from tornado import gen
from tornado import httpserver
from tornado.ioloop import IOLoop

from camera.api import CameraHandler
from camera.training import TrainingHandler

logger = logging.getLogger(__name__)
loggers.logged()

class MainHandler(tornado.web.RequestHandler):
	print "HIII main"
	def get(self):
		print "welcome"
		print "MainHandler GET"
		self.write("Welcome to Smart-Surveillance Controller.")

class Application(tornado.web.Application):
	"""docstring for Application"""
	def __init__(self):
		handlers = [
			(r"/?", MainHandler),
			(r"/camera/", CameraHandler),
			(r"/training/", TrainingHandler)
		]
		print "Handlers : " , handlers
		tornado.web.Application.__init__(self, handlers, debug=True)

def main(port=8000):
	app = Application()
	app.listen(port)
	print "app listening on port {}".format(port)
	IOLoop.instance().start()

if __name__ == '__main__':
	main()
