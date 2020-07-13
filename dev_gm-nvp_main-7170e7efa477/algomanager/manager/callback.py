from requests import post
import traceback

def post_callback(url, data):
	# print "callback data : ", data
	try:
		print "posting call back to ", url
		response = post(url, data = data)
		return response
	except Exception as e:
		#traceback.print_exc()
		print "---------error : ", e
		return {"error" : "Failed to establish connection with the given callback url: [Errno 113] No route to host"}
