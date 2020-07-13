import cv2
#import matplotlib.pyplot as plt
import traceback
import numpy as np 
import Kalman as kalman
import time
import sys
from hung import Munkres, print_matrix, make_cost_matrix
import math
import random
#from zmqclient import zmqConnect

max_distance = 80
max_misses = 30
max_trace = 1

flag = 0
assignment_track = []
#global NextID
NextID = 0
count =0

def line(center, point1, point2):
	ori = (center[1] - point1[1])  - ((point2[1] - point1[1])/(point2[0] - point1[0]))*(center[0] - point1[0])
	if ori > 1: return 1
	elif ori < 1: return -1
	else: return 0


class kalman_track():

	def __init__(self,pt,dt,acceleration):
		self.KF = kalman.TKalmanFilter(pt,dt, acceleration)
		global NextID
		self.misses = 0
		self.trace = []
		self.begin_time = time.time()
		self.prediction = pt
		self.points = []
		self.box = []
		self.Count = 0
		self.line = []
		self.trackID = NextID
		NextID += 1



class KalmanWorker:

	def __init__(self, roi):
		print "kalman ROI : ", roi
		self.ROIDATA = roi
		print("KalmanWorker")
		self.colors = [(0,0,0),(0,0,255),(0,255,0),(255,0,0),(0,255,255),(255,0,255),(255,255,0),(255,255,255),(0,0,127),(0,127,0),(127,0,0),(0,127,127),(127,0,127),(127,127,0),(127,127,127)]
		self.tracks = [] 
		self.acceleration = 0.2
		self.dt = 0.2
		self.up_counter = 0
		self.down_counter = 0
		self.counter = 0	
		self.initParams(roi)


	def initParams(self, roi):
		print "initParams : ", roi, type(roi), len(roi)
		# roiVal = roi
		try:
			if "image" not in roi:
				roi = {"image":{"width":1920, "height":1080}}
				h = roi["image"]["height"]
				w = roi["image"]["width"]
			else :
				h = roi["image"]["height"]
				w = roi["image"]["width"]
			if len(roi) > 1:
				pt1 = (int(roi["roiPoints"][0][0]), int(roi["roiPoints"][0][1]))
				pt2 = (int(roi["roiPoints"][-1][0]), int(roi["roiPoints"][-1][1]))
				print "pointssss : ", pt1, pt2
				self.counting_line_points1 = pt1
				self.counting_line_points2 = pt2
				print  "Count line pointssss :: ", self.counting_line_points1, self.counting_line_points2
			else:
				self.counting_line_points1 = (0, h) #changess
				self.counting_line_points2 = (w, h/2) #changess
		except Exception as e:
				print "KalmanWorker{err}:"
				traceback.print_exc()


	def magnitude(self, a, z):
		return a-z

	#Padding for a non square matrix
	def pad_to_square(self, a, pad_value=0):
		m = a.reshape((a.shape[0], -1))
		padded = pad_value * np.ones(2 * [max(m.shape)], dtype=m.dtype)
		padded[0:m.shape[0], 0:m.shape[1]] = m
		return padded

	def Update(self, rects, frame):
		print "\n Roi kalmana dataa   : ", self.ROIDATA
		detections = []
		for i in xrange(len(rects)):
			center_f = ((rects[i][0] + rects[i][2])/2, (rects[i][1] + rects[i][3])/2)
			detections.append(center_f)
	
		if len(self.tracks) == 0:
			
			#-----------------------------------------------------------------
			#If there is no self.tracks yet, then every point begins it's own track
			#-----------------------------------------------------------------		
			for i in range(len(detections)):
	
				tr = kalman_track(detections[i],self.dt,self.acceleration)
				self.tracks.append(tr)

		N = len(self.tracks)
		M = len(detections)
		Cost = []
		assignment = []

		for i in range(N): #len(self.tracks)):
			for j in range(M): #len(detections)):
				diff = (self.magnitude(self.tracks[i].prediction[0], detections[j][0]) , self.magnitude(self.tracks[i].prediction[1],detections[j][1]))
				dist = math.sqrt(diff[0]*diff[0] + diff[1]*diff[1])
				Cost.append(dist)


		Cost = np.reshape(Cost, (N,M)).astype('float32')
		if M > N:
			pass
		else:
			Cost = self.pad_to_square(Cost,555)
	
		#Assignment Solving using hungarian algorithm
		m = Munkres()
		assignment = m.compute(Cost.copy())
		val_assignment = []
		not_assigned_tracks = []
		total = 0	
		for i in range(len(assignment)):
			if int(Cost[i][assignment[i]])>max_distance:
				assignment[i] = -1



		#---------------------------------------------------
		#Clean the assignment from pairs with large Distance
		#---------------------------------------------------
		#Not assigned self.tracks
		for i in range(len(assignment)):

			if assignment[i] != -1:
				if int(Cost[i][assignment[i]])>max_distance:
					assignment[i] = -1
					
					#Mark unassigned self.tracks, and increment skipped frames counter,
					#when skipped frames would be larger than threshold, reack will ve deleted 
					not_assigned_tracks.append(i)
		
			else:
			
				self.tracks[i].misses += 1

		#-------------------------------------------------------
		#If track didn't get detected for a long time, delete it
		#-------------------------------------------------------
		
		for i in range(len(self.tracks)):
			if flag == 1:
				flag == 0
				i -= 1
			try:
				if(self.tracks[i].misses > max_misses):

					del self.tracks[i]
					del assignment[i]
					#del val_assignment[:i]
					global flag
					flag = 1
		
			except:
				pass
	

		#-----------------------------	
		#Search for unassigned detects
		#----------------------------
		not_assigned_detections = []
		for i in range(len(detections)):
			if i not in assignment:
				not_assigned_detections.append(i)
			
		#----------------------------	
		#Start a new tracker for them
		#----------------------------
		if len(not_assigned_detections) != 0:
			for i in range(len(not_assigned_detections)):
				tr = kalman_track(detections[not_assigned_detections[i]],self.dt,self.acceleration)
				#tr.box.append(list_of_box[not_assigned_detections[i]])
				self.tracks.append(tr)
		
		#--------------------
		#Update Kalman filter
		#-------------------
		
		for i in range(len(assignment)):
			self.tracks[i].KF.GetPrediction()
			#self.tracks[i].box[0] = list_of_box[i]
			if(assignment[i] != -1):
				self.tracks[i].misses = 0
				self.tracks[i].prediction = self.tracks[i].KF.Update(detections[assignment[i]],1)
				self.tracks[i].points.append(self.tracks[i].prediction)
				for p in self.tracks[i].points:
					channel = i%14
					#cv2.circle(frame, p, 3, self.colors[channel], thickness=-1, lineType=cv2.LINE_AA, shift=0)
			
			else:
				self.tracks[i].prediction = self.tracks[i].KF.Update((0,0),0)
			if self.counting_line_points1[0] < self.tracks[i].prediction[0] < self.counting_line_points2[0]:
				self.tracks[i].line.append(line(self.tracks[i].prediction, self.counting_line_points1,self.counting_line_points2))
	
			if(len(self.tracks[i].trace) > max_trace):
				l = len(self.tracks[i].trace)
				p = l - max_trace
				del self.tracks[i].trace[:p] #check
	
			self.tracks[i].trace.append(self.tracks[i].prediction)
			self.tracks[i].KF.LastResult = self.tracks[i].prediction
	
	
		res = {}
		
		for i in range(len(self.tracks)):
			
			res['id'] = self.tracks[i].trackID+1
			try: res['center'] = self.tracks[i].points[-1]
			except: pass
			#if len(self.tracks[i].points) > 3:
				#keep_track = {}
				#keep_track['id'] = self.tracks[i].trackID + 1
				#keep_track['coordinates'] = self.tracks[i].points
				#results.append(keep_track)
				#new_data['results'] = results

			if len(self.tracks[i].line) > 3 and self.tracks[i].Count == 0:
				
				if (self.tracks[i].line[-1] > 0 and (self.tracks[i].line[-4] and self.tracks[i].line[-3] and self.tracks[i].line[-2]) < 0):
					self.up_counter += 1

				elif (self.tracks[i].line[-1] < 0 and (self.tracks[i].line[-4] and self.tracks[i].line[-3] and self.tracks[i].line[-2]))> 0:
					self.down_counter += 1
	
				self.counter = self.down_counter + self.up_counter	
				print "\nSELF COUNTER  :  ", self.counter	
				#new_data['total'] = self.counter

		cv2.line(frame,self.counting_line_points1,self.counting_line_points2,(255,0,0),5)
		return (int(self.counter),res)


"""
	def process(self, frame):

				centers = []
				result = self.socket.send('frame',frame)
				det, frame = result
				for (cent, class_name) in det:
						centers.append(cent)

				if len(centers) > 0:
						#print "CENTERS: {}".format(centers)
						res = self.Update(centers, frame)
						for i in xrange(len(self.tracks)):
								if len(self.tracks[i].trace) > 1:
										for j in xrange(len(self.tracks[i].trace)-1):
												cv2.putText(frame, str(self.tracks[i].trackID+1), (self.tracks[i].prediction[0],self.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
						res['notify'] = True
						return res

		
		centers = []	
		result = self.socket.send('frame',frame)
		for (dets, class_name) in result:
			inds = np.where(dets[:,-1] >= 0.7)[0]
						for i in inds:
								# box is defineds as [x, y, w, h]
								score = dets[i,-1]
								x,y,w,h = int(dets[i][0]), int(dets[i][1]), int(dets[i][2]), int(dets[i][3])
								cv2.rectangle(frame, (x, y), (w,h), (255, 0, 255), 5)
								#cv2.putText(frame,"%s"%(class_name), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
								centre = x+(w-x) / 2, y+(h-y) / 2
								cv2.circle(frame, centre, 10, (0, 255, 0), thickness=-1, lineType=cv2.LINE_AA, shift=0)
								centers.append(centre)

				if len(centers) > 0:
						#print "CENTERS: {}".format(centers)
						res = self.Update(centers, frame)
						for i in xrange(len(self.tracks)):
								if len(self.tracks[i].trace) > 1:
										for j in xrange(len(self.tracks[i].trace)-1):
												cv2.putText(frame, str(self.tracks[i].trackID+1), (self.tracks[i].prediction[0],self.tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)
			res['notify'] = True
			return res
		"""
