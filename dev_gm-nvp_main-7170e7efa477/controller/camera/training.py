import cv2
import json
import base64
import traceback
import tornado.web
from tornado import gen
from tornado.escape import json_encode
from tornado.escape import json_decode
from requests import post

def request_call(url, data, method="POST"):
	try:
		# print "in controller api : ", url, data
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

class TrainingHandler(tornado.web.RequestHandler):
	
	# Status
	@gen.coroutine
	def get(self):
		print "TrainingHandler GET"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments
		print "ARGS : GET : ", args, type(args)
		self.write("GET - Camera")

	# start
	@gen.coroutine
	def post(self):
		print "TrainingHandler POST "
		try:
			args = json_decode(self.request.body)
		except TypeError as e:
			pass
		finally:
			args = self.request.body
		args = json.loads(args)
		print "ARGS POST :: ", args, type(args)
		b64 = ""
		cap = cv2.VideoCapture(args["source"])
		b,firstFrame= cap.read()
		if b:
			retval, buffer = cv2.imencode('.jpg', firstFrame)
			b64 = "data:image/jpg;base64,"+base64.b64encode(buffer)
		self.write(json.dumps({"status" : "success", "face_id" : args["face_id"], "frame" : b64 }))

	# start
	@gen.coroutine
	def put(self):
		print "TrainingHandler Put "
		try:
			args = json_decode(self.request.body)
		except TypeError as e:
			pass
		finally:
			args = self.request.body
		args = json.loads(args)
		print "ARGS PUT :: ", args, type(args)
		request_call("http://127.0.0.1:8080/faceTraining/", data=args, method="POST")
		self.write(json.dumps({"status":True}))


	# stop
	@gen.coroutine
	def delete(self):
		print "TrainingHandler DELETE"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments

		_id = int(args['cam_id'][0])
		Context.stop(_id)
		self.write("DELETE - Camera")

	# update
	@gen.coroutine
	def patch(self):
		print "TrainingHandler PATCH"
		try:
			args = json_decode(self.request.body_arguments)
		except TypeError as e:
			pass
		finally:
			args = self.request.body_arguments
		_id = int(args['cam_id'][0])
		Context.update(args, _id)
		self.write(json.dumps({"status":True}))
		
