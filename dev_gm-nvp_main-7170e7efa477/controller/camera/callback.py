from requests import post
import traceback

def post_callback(url, data):
	print url
	try:
		print "posting call back to ", url
		response = post(url, data = data)
		print "response ", response
		return response
	except Exception as e:
		traceback.print_exc()
		return None
