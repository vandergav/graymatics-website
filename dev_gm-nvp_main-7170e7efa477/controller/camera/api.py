import json
import tornado.web
import traceback
import logging
import logging
from tornado import gen
from requests import post, patch, delete
from tornado.escape import json_encode
from tornado.escape import json_decode
from context import Context

logger = logging.getLogger(__name__)

def request_call(url, data, method="POST"):
	try:
		print "in controller api : ", url, data
		response = None
		if "POST" == method.upper():
			response = post(url, data = data)
		elif "PATCH" == method.upper():
			response = patch(url, data = data)
		elif "DELETE" == method.upper():
			response = delete(url, data = data)
		print "response"
		return response
	except Exception as e:
		traceback.print_exc()
		return None

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

		_id = int(args['cam_id'][0])
		Context.status(_id)
		self.write("GET - Camera")

	# connect
	@gen.coroutine
	def post(self):
		print "CameraHandler POST  "
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments
		print "CAM POST ::: ", args
		print 'cam_id ', args['cam_id'][0]
		print "got algo :: ---------------", args['algos'][0],  type(args['algos'][0])
		#print args
		# yield Context.connect(args)
		Context.connect(args)
		cam = Context.camera(int(args['cam_id'][0]))
		print "API:POST", cam
		if cam is not None:
			args['status'] = cam.status
			if cam.status:
				args['frame_src'] = cam.frame
				args['frame_shape'] = cam.shape
		# print "returnargs   ------------- : ", args
		self.write(json_encode(args))


	# start
	@gen.coroutine
	def put(self):
		print "CameraHandler PUT "
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments
		print "ARGSSSSS :  ::   ", args
		_id = int(args['cam_id'][0])
		print "camera ", _id
		print "args PUT :: ", args

		Context.start(_id)
		cam = Context.camera(_id)
		print "CAM CONTEXT  :  ", cam
		if "roi" in args :
			print args["roi"][0], type(args["roi"][0])
			cam.roi = args["roi"][0]
		data = {
			"cam_id" : _id,
			"name" : cam.name,
			"user_id" : cam.user_id,
			"stream_url" : cam.stream_url,
			"interface" : cam.interface,
			"algos" : cam.algos,
			"roi" : cam.roi,
			"qname" : cam.q,
			"callback_url" : cam.callback_url,
			"media_type" :cam.media_type
		}
		print "put Data : ", data
		logger.debug({"put data" : data})
		request_call("http://192.168.1.240:8080/algo/", data=data, method="POST")
		self.write(json.dumps({"status":True}))

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
		#print "delete : args ::: ", args
		
		_id = int(args['cam_id'][0])
		Context.stop(_id)
		data = {
			"cam_id" : _id,
		}
		response = request_call("http://192.168.1.240:8080/algo/", data=data, method="DELETE")
		if 200 == response.status_code:
			self.write(json_encode({"status" : True}))
		else:
			self.write(json_encode({"status" : False}))

	# update
	@gen.coroutine
	def patch(self):
		print "CameraHandler PATCH : ",self.request.body, type(self.request.body)
		try:
			args = json_decode(self.request.body)
		except TypeError as e:
			pass
		finally:
			args = self.request.body
		args = json.loads(args)
		print "\nPATCH ARGS : ", args
		_id = int(args['cam_id'][0])
		Context.update(args,_id)
		src = str(args['src'])
		roi = args['roi']
		print roi, type(roi)
		data = {
			"src" : src,
			"cam_id" : _id,
			"roi" : roi

			# remaining data
		}
		request_call("http://192.168.1.240:8080/algo/", data=data, method="PATCH")
		self.write(json.dumps({"status":True}))
		


	#trace


	# #delete
	# @gen.coroutine
	# def delete(self):
	# 	print "CameraHandler DELETE"
	# 	try:
	# 		args = json_decode(self.request.body_arguments)
	# 	except TypeError as e:
	# 		pass
	# 	finally:
	# 		args = self.request.body_arguments
	# 	#print "delete : args ::: ", args
		
	# 	_id = int(args['cam_id'][0])
	# 	Context.stop(_id)
	# 	data = {
	# 		"cam_id" : _id,
	# 	}
	# 	response = request_call("http://192.168.1.240:8080/algo/", data=data, method="DELETE")
	# 	if 200 == response.status_code:
	# 		self.write(json_encode({"status" : True}))
	# 	else:
	# 		self.write(json_encode({"status" : False}))
