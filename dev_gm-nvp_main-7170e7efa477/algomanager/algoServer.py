import tornado.web
from tornado import gen
from tornado import httpserver
from tornado.ioloop import IOLoop

from manager.api import CameraHandler

class MainHandler(tornado.web.RequestHandler):
	def get(self):
		print "MainHandler GET"
		self.write("Welcome to Smart-Surveillance AlgoManager.")

class Application(tornado.web.Application):
	"""docstring for Application"""
	def __init__(self):
		handlers = [
			(r"/?", MainHandler),
			(r"/algo/", CameraHandler)
		]
		tornado.web.Application.__init__(self, handlers)

def main(port=8080):
	app = Application()
	app.listen(port)
	print "app listening on port {}".format(port)
	IOLoop.instance().start()

if __name__ == '__main__':
	main()
