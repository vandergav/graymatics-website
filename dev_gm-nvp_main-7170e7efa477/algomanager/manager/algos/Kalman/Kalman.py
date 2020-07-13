import cv2
import numpy as np
import math


class TKalmanFilter(object):

	def __init__(self,pt,dt=0.2, Accel_noise_mag=0.5):

		deltatime = dt #0.2
	
		#Since we don't know the acceleration we assume it to be a process noise
		#But we can guess the range of acceleration values which can be achieved by the tracked object
		#Process noise. (standard deviation of acceleration:)
		#float Accel_noise_mag = 0.5
	
		#4 state variables and 2 self.measurements
		self.kalman = cv2.KalmanFilter( 4,2,0 )

		#Transition Matrix
		self.kalman.transitionMatrix = np.array([[1,0,deltatime,0],[0,1,0,deltatime],[0,0,1,0],[0,0,0,1]]).astype('float32')
		#print self.kalman.transitionMatrix
		
		#print self.kalman.statePre
		#initialization
		self.LastResult = pt
		
		self.kalman.statePre = np.array([[pt[0]], [pt[1]], [0],[0]]).astype('float32')

		self.kalman.statePost = np.array([[pt[0]], [pt[1]], [0],[0]]).astype('float32')
	
		#cv2.setIdentity(self.kalman.measurementMatrix)
		
		self.kalman.measurementMatrix = np.array([(1,0,0,0),(0,1,0,0)]).astype('float32')
		
		self.kalman.processNoiseCov = np.array([[math.pow(deltatime,4.0)/4.0,0,math.pow(deltatime,3.0)/2.0,0] , [0, math.pow(deltatime,4.0)/4.0,0,math.pow(deltatime,3.0)/2.0], [math.pow(deltatime,3.0)/2.0,0,math.pow(deltatime,2.0),0], [0,math.pow(deltatime,3.0)/2.0,0,math.pow(deltatime,2.0)]]).astype('float32')
	
		self.kalman.processNoiseCov *= Accel_noise_mag
		
		#0.1 * cv2.setIdentity(self.kalman.measurementNoiseCov) #= 0.1 * np.eye(4)
		self.kalman.measurementNoiseCov = 1e-1 * np.eye(2, 2).astype('float32')
	
		self.kalman.errorCovPost = 1e-1 * np.eye(4,4).astype('float32')
		.1 * cv2.setIdentity(self.kalman.errorCovPost) #= .1 * np.eye(4)
		
	
	def GetPrediction(self):
	
		self.prediction = self.kalman.predict()
		self.LastResult = (self.prediction[0][0], self.prediction[1][0])
		return self.LastResult

	def Update(self,p, DataCorrect):
	
		
		if not DataCorrect:
			self.measurement = self.LastResult

		else:

			self.measurement = p
			
		self.measurement = np.array(self.measurement).astype('float32')
		self.measurement = np.reshape(self.measurement, (2,1))
		self.estimated = self.kalman.correct(self.measurement)
	
		self.LastResult = self.estimated[0][0], self.estimated[1][0]
		return self.LastResult

