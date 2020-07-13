
from camera import Camera
from state import State
from algoManager import AlgoManager

class Context(object):
	cameras = {}

	def start(arg):
		# _id = int(arg['cam_id'][0])
		_id = str(arg['cam_id'][0])
		if not _id in Context.cameras:
			camera = Camera(arg)
			print "before AlgoManager ::: ", camera, arg
			manager = AlgoManager(camera)
			Context.cameras[_id] = camera
			camera.status = State.RUNNING
			camera.manager = manager
	connect = staticmethod(start)

	def camera(_id):
		print Context.cameras
		if _id in Context.cameras:
			return Context.cameras[_id]
		return None
	camera = staticmethod(camera)

	def status(_id):
		if _id in Context.cameras:
			camera = Context.cameras[_id]
			return camera.status
		return False
	status = staticmethod(status)


	def update(args,_id):
		if _id in Context.cameras:
			Context.stop(_id)
			print "updating ARGS context :: ", args
			Context.connect(args)
			Context.start(_id)
			return True
		return False

	update = staticmethod(update)

	def stop(_id):
		if _id in Context.cameras:
			del Context.cameras[_id].manager
			del Context.cameras[_id]
			return True
		return False
	stop = staticmethod(stop)
