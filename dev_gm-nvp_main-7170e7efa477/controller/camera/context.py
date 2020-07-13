from camera import Camera
from connection.connect import Connect
from state import State
import logging
# from stream.live import Stream

logger = logging.getLogger(__name__)

class Context(object):
	cameras = {}

	def connect(arg):
		_id = int(arg['cam_id'][0])
		if not _id in Context.cameras:
			camera = Camera(arg)
			print "_____CAMERA______", camera,"\n_________________" 
			Connect(camera)
			camera.status = State.READY
			Context.cameras[_id] = camera
	connect = staticmethod(connect)

	def camera(_id):
		#print Context.cameras
		if _id in Context.cameras:
			print Context.cameras[_id]
			return Context.cameras[_id]
		return None
	camera = staticmethod(camera)

	def status(_id):
		if _id in Context.cameras:
			camera = Context.cameras[_id]
			return True
		return False
	status = staticmethod(status)

	def start(_id):
		if _id in Context.cameras:
			camera = Context.cameras[_id]
			if camera.status == State.READY:
				interface = camera.interface_env
				interface.start_streaming()
				camera.status = State.RUNNING
			return True
		return False
	start = staticmethod(start)

	def update(args,_id):
		# check source interface and protocol
		if _id in Context.cameras:
			Context.stop(args['cam_id'][0])
			Context.connect(args)
			Context.start(args['cam_id'][0])
			return True
		# check for algo manager 
		return False
	update = staticmethod(update)

	def stop(_id):
		print "context stop"
		if _id in Context.cameras:
			camera = Context.cameras[_id]
			interface = camera.interface_env
			interface.stop_streaming()
			del interface
			del camera
			del Context.cameras[_id]
			return True
		return False
	stop = staticmethod(stop)

	def delete(_id):
		print "context delete"
		if _id in Context.cameras:
			camera = Context.cameras[_id]
			interface = camera.interface_env
			interface.stop_streaming()
			del interface
			del camera
			del Context.cameras[_id]
			return True
		return False
	delete = staticmethod(delete)
