import os
try:
	from StringIO import StringIO
except ImportError:
	from io import StringIO
import traceback
import boto3
from botocore.client import Config

class S3:
	
	def __init__(self):
		self.s3 = boto3.resource('s3', aws_access_key_id = "AKIAIRNNBTLVNSZWEDRQ",
         aws_secret_access_key = "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")
		self.bucket = None
		self.BucketName = None
		self.retries = 0
		self.MAX_RETRIES = 3

	def createBucket(self,BucketName,Region='us-east-1'):
		try:
			self.s3.make_bucket(BucketName)
		except ResponseError as err:
			print('[*] Error : ', err)

	def list_objects(self, bucket, prefix):
		print "S3:list_objects ",bucket, prefix
		if(self.BucketName != bucket):
			self.BucketName = bucket.lower()
		try:
			objects = self.s3.Bucket(self.BucketName).objects.filter(Prefix=prefix)
			return objects
		except Exception as e:
			traceback.print_exc()
			return None

	def uploadFile(self,SourceFile, bucket, FileName):
		if (self.BucketName != bucket):
			self.BucketName = bucket.lower()
		try:
			self.s3.Bucket(self.BucketName).upload_file(SourceFile, FileName)
		except ResponseError as err:
			print('[*] Error : ', err)
			traceback.print_exc()

	def uploadData(self,data,BucketName,FileName):
		"""Uploads string data to a file in S3.  BucketName is translated
		to lower case before execution

		Arguments :
		data (String) : Data to upload
		BucketName (string) : Destination Bucket Name
		FileName : (string) :key for the uploaded file (complete parth under the bucket) 
		"""
		try:
			BucketName = BucketName.lower()
			f = open(FileName, 'w+')
			f.write(data)
			f.close()
			self.uploadFile(FileName, BucketName, FileName)
			os.remove(FileName)
		except Exception as e:
			traceback.print_exc()
			os.remove(FileName)
	

	def downloadFile(self,BucketName,key,DestPath):
		try:
			print("BucketName ", BucketName, "key ", key, "Path ", DestPath)
			data = self.s3.Bucket(BucketName).download_file(key, DestPath)
			print('downlaod success')
		except Exception as e:
			traceback.print_exc()

	def uploadDirectory(self,src_dir, _id, BucketName):
		if not os.path.exists(src_dir):
			return 1
		if id == None:
			return 1
		if (self.BucketName != BucketName):
			self.BucketName = BucketName.lower()
		
		for path,_dir,files in os.walk(src_dir):
			for _file in files:
				path_raw = os.path.join(src_dir, _file)
				path_out = '{}/{}'.format(_id, _file)
				self.uploadFile(path_raw, self.BucketName, path_out)

	def base_url(self, bucket):
		return "https://s3.amazonaws.com/{}/".format(bucket)




if __name__ == "__main__":
	s3 = S3()
	bucket = "smart-surveillance"
	img_file = "vehicle/2017_August_31/vehilce00001.jpg"
	# s3.downloadFile(bucket, img_file, 'temp.jpg')
	prefix = "vehicle/2017_August_31"
	# objs = s3.list_objects(bucket, prefix)
	# ind = 0
	# for obj in objs:
	# 	print obj.key
	# 	ind += 1
	# 	break
	# print ind

	img_file = "vehicle/2017_August_31/vehilce00001.jpg"
	dst = "temp.jpg"
	# s3.downloadFile(bucket, img_file, dst)
	import cv2, imutils
	img = cv2.imread(dst)
	img = imutils.resize(img, width=min(640, img.shape[1]))
	print img.shape
	cv2.imshow("img", img)
	cv2.waitKey(0)
