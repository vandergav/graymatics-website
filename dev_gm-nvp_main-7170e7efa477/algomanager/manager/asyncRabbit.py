#!usr/bin/python
########################################################################
#Graymatics RabbitMQ wrapper for python components
#Version 0.1
#maitreya@graymatics.com
#Description: This python class acts as a wrapper around RabbitMQ for use
#in python components of graymatics cloud
########################################################################
import pika
import sys
import json
import threading

class Rabbit:
	
	""" Graymatics RabbitMQ Wrapper for python components.
	Uses pika framework for python.
	
	Functions:
	initConsume(String queue,int Count) -> int
	consume()
	produce(String queue, string workload) -> boolean
	
	"""
	# 10.200.101.238
	def __init__(self,server="127.0.0.1", port=5672, heartbeat=True):
		
		"""Initializes the server and port instance variables
		
		Constructor Arguments:
		server -- The IP address of the rabbitmq server (default:localhost)
		port -- The rabbitmq port (default: default rmq port)
		
		"""
		
		self.server = server
		self.port = port
		#enabling heartbeat on pika 0.9.9
		if (heartbeat == False) :
			self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.server,port=self.port,heartbeat_interval=0))
		else :
			print "ENabling heartbeat"
			self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.server,port=self.port,heartbeat_interval=36000))
		print "self.connection :" , self.connection
		self.consChannel = None
		self.prodChannel = None
		self.prodExchange = ''
		self.workload = None
		self.callbackFunc = None
	
	##Callback function for consumption 	
	def __callback(self,ch,method,properties,body):
		try :
			body = json.loads(unicode(body))
			#return value of the function needs to be used to decide to send
			#acknowledgement or not. future improvement.(use exceptions here)
			#ch.basic_ack(delivery_tag = method.delivery_tag)
			threading.Thread(target = self.callbackFunc, args=(ch, method, body)).start()
		except :
			import traceback
			print "There was an error in the main callback function"
			traceback.print_exc()
		#ch.basic_ack(delivery_tag = method.delivery_tag)
		
	def initConsume(self,queue,callbackFunc,count=1):
		
		"""Consumes number of requests from the rabbit server.
		
		Arguments:
		queue -- name of the queue to consume the request from
		count -- number of requests to fetch (default 1)
		callback function -- a call back function where the message is 
		passed on to
		
		"""
		
		if (queue == None or queue == ''):
			print "Invalid Queue Parameter"
			return 1
		if (callbackFunc == None):
			print "Invalid CallBack Function"
			return 1
		self.queue = queue
		if (self.consChannel == None):
			self.consChannel = self.connection.channel()
		print "initConsume"
		self.callbackFunc = callbackFunc
		self.consChannel.queue_declare(queue=queue, durable=True)
		self.consChannel.basic_qos(prefetch_count=int(count))
		self.consChannel.basic_consume(self.__callback,queue=queue)
		return 0
	
	def consume(self):
		
		"""Starts consumption from a queue defined by initConsume.
		
		Arguments:
		None
		
		"""
		print "consume"
		self.consChannel.start_consuming()
		
	
	def stopConsuming(self,ch):
		# self.consChannel = self.connection.channel()
		# self.consChannel.queue_declare(queue=queue)
		# method_frame, header_frame, body = self.consChannel.basic_get(queue = queue)        
		# if method_frame.NAME == 'Basic.GetEmpty':
		# 	connection.close()
		# 	return ''
		# else:            
		# 	self.consChannel.basic_ack(delivery_tag=method_frame.delivery_tag)
		# 	connection.close() 
		ch.stop_consuming()

	

	def initProduce(self,queue,persistence=2):
		
		""" Initialize parameters for producing to a queue.
		
		Arguments:
		queue (String) --- Name of the queue to produce to
		persistence (int) --- 2/0 To make the message persistent/not 
		
		"""
		if (self.prodChannel == None):
			self.prodChannel = self.connection.channel()
		self.prodChannel.queue_declare(queue=queue, durable=True)
		self.persistence = persistence
		
	def produce(self,queue,message):
		
		""" Adds a task to the queue defined by initProduce. Converts the
		message to json before sending over
		
		Arguments:
		queue (string) -- queue to produce to
		message(dict) -- the message which needs to be added to the queue
		
		
		"""
		
		#try except because long running idle connections will tend to 
		#break.
		try :
			self.prodChannel.basic_publish(exchange=self.prodExchange,
					  routing_key=queue,
					  body=json.dumps(message),
					  properties=pika.BasicProperties(
						 delivery_mode = self.persistence, 
					  ))
		except :
			self.__reinit_produce(queue)
			print self.prodChannel.basic_publish(exchange=self.prodExchange,
					  routing_key=queue,
					  body=json.dumps(message),
					  properties=pika.BasicProperties(
						 delivery_mode = self.persistence, 
					  ))
		 
		
	def __reinit_consume(self):
		
		"""reinitializes if a connection is lost and if the consumption 
		fails
		"""
		
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.server,port=self.port,heartbeat_interval=600))
		self.initConsume(self.queue,self.callbackFunc)
	
	def __reinit_produce(self,queue):
		"""reinitializes if a connection is lost and if the consumption 
		fails
		"""
		print "reinitializing connection and produce queues"	
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.server,port=self.port,heartbeat_interval=0))
		self.initProduce(queue)
	
	def message_count(self, queue):
		messageCount = queue.method.message_count	
		print "queue : {}, messageCount : {}".format(queue, messageCount)	
		return messageCount
	
	def close(self):
		
		self.connection.close()
		
	def __del__(self,queue):
		self.consChannel = self.connection.channel()
		self.stopConsuming(self.consChannel)
		self.consChannel.queue_delete(queue= queue)
		self.connection.close()
