import json
import tornado.web
from tornado import gen
from tornado.escape import json_encode
from tornado.escape import json_decode
from context import Context

class CameraHandler(tornado.web.RequestHandler):
	
	# Status
	@gen.coroutine
	def get(self):
		print "CameraHandler GET"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments

		#_id = int(args['cam_id'][0])
		_id = str(args['cam_id'][0])
		Context.status(_id)
		self.write("GET - Camera")

	# start
	@gen.coroutine
	def post(self):
		print "CameraHandler POST"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments

		
		# yield Context.connect(args)
		Context.connect(args)
		#cam = Context.camera(int(args['cam_id'][0]))
		cam = Context.camera(str(args['cam_id'][0]))
		print "API:POST", cam
		if cam is not None:
			args['status'] = cam.status
		self.write(json_encode(args))


	# stop
	@gen.coroutine
	def delete(self):
		print "CameraHandler DELETE"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments

		#_id = int(args['cam_id'][0])
		_id = str(args['cam_id'][0])
		Context.stop(_id)
		self.write("DELETE - Camera")

	# update
	@gen.coroutine
	def patch(self):
		print "CameraHandler PATCH"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments
		print "algo update args :: ----- ", args
		#_id = int(args['cam_id'][0])
		_id = str(args['cam_id'][0])
		Context.update(args, _id)
		self.write(json.dumps({"status":True}))
		
