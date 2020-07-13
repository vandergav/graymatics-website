import json
import tornado.web
from tornado import gen
from tornado.escape import json_encode
from tornado.escape import json_decode
from context import Context
from callback import post_callback

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
		# _id = int(args['cam_id'][0])
		# Context.status(_id)
		self.write("GET - Camera")

	# start
	@gen.coroutine
	def post(self):
		print "TrainingHandler POST : ", self.request.body, type(self.request.body)

		try:
			args = json_decode(self.request.body)
		except TypeError as e:
			pass
		finally:
			args = self.request.body
		args = json.loads(args)
		print "ARGS POST :: ", args, type(args)
		self.write("Post  - Face_training")
		# request = Face_training(args)
		# if args["type"] == "training" :
		# 	dataCollectionResponse = request.dataCollection(args)
		# 	self.write(json.dumps({"status":"success", "frame" : dataCollectionResponse['frame']}))
		# 	dataSplit = request.split_data()
		# 	print "dataCollectionSplit"
		# 	dataTraining1 = request.start_training1()
		# 	dataTraining2 = request.start_training2()
		# 	print "start_training : ", dataTraining2
		# 	self.write(json.dumps({"status":True}))
		# if args["type"] == "inference" :
		# 	print "yes---------------------------------"
		# 	predictData = request.inferencing()
		# 	print "predictData ::: ", predictData


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
		
