#!/usr/bin/python

import redis

class Cache:
	
	"""Class representing cache objects to write into and fetch from a
	redis instance
	"""
	
	def __init__(self,server="34.226.183.28",port=6379):
		
		"""constructor to instantiate connections
		"""
		
		self.server = server
		self.port = port
		self.redcache = redis.StrictRedis(host=self.server,port=self.port)
	
	def SetValue(self,key,value):
		
		"""Sets a value to the given key
		"""
		try :
			return self.redcache.set(key,value)
		except:
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.set(key,value)
	
	def SetTTL(self,key,time):
		
		"""sets the time to live for the given key
		"""
		
		try:
			return self.redcache.expire(key,time)
		except :
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.expire(key,time)
			
	def AppendMetaData(self,key,value):
		
		"""Appends a string to a existing/inexisting key in the cache
		"""
		try :
			return self.redcache.lpush(key,value)
		except :
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.lpush(key,value)
	
	def IncreaseHashCounter(self,key,field,value):
		
		"""Increments the hash counter for the field by the integral value
		"""
		
		try:
			return self.redcache.hincrby(key,field,value)
		except:
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.hincrby(key,value)
		
	def DeleteHashField(self,key,field):
		
		"""Deletes a hash field from a hash named by key
		"""
		
		try :
			print "pred[DeleteHashField]: ", key, field
			return self.redcache.hdel(key,field)
		except:
			import traceback
			print traceback.print_exc()
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.hdel(key,field)
	
	def GetValue(self,key):
		
		"""Fetches a value given a key
		"""
		try:
			return self.redcache.lrange(key,0,-1)
		except:
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.lrange(key,0,-1)

	def hset(self, key, iKey, value):
		try:
			return self.redcache.hset(key, iKey, value)
		except Exception, e:
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.hset(key, iKey, value)

	def hget(self, key, iKey):
		try:
			return self.redcache.hget(key, iKey)
		except Exception, e:
			self.redcache = redis.StrictRedis(host=self.server,port=self.port)
			return self.redcache.hget(key, iKey)
			

#Usage Examples	
"""
cac = cache()
cac.AppendMetaData("abcd","a")
cac.AppendMetaData("abcd","b")
print cac.GetValue("abcd")
print cac.IncreaseHashCounter("a","1",1)
print cac.IncreaseHashCounter("a","1",5)
print cac.IncreaseHashCounter("a","2",1)
print cac.IncreaseHashCounter("a","2",3)
print cac.DeleteHashField("a","2")
print cac.IncreaseHashCounter("a","2",1)
cac.SetValue("ab","5566")
cac.SetTTL("ab",10)
"""
