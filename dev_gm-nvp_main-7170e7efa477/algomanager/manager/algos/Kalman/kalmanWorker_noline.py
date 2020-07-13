import cv2
import numpy as np 
import Kalman as kalman
import time
import sys
from hung import Munkres, print_matrix, make_cost_matrix
import demo
import math, os
import random
import matplotlib.pyplot as plt
import imutils
import urllib

min_area = 8000
acceleration = 0.2
max_distance = 70
max_misses = 30
max_trace = 1
dt = 0.2

flag = 0
tracks = []
assignment_track = []
#global NextID
NextID = 0
count =0
counter = 0


def magnitude(a, z):
    return a-z 

#Padding for a non square matrix
def pad_to_square(a, pad_value=0):
	m = a.reshape((a.shape[0], -1))
	padded = pad_value * np.ones(2 * [max(m.shape)], dtype=m.dtype)
	padded[0:m.shape[0], 0:m.shape[1]] = m
	return padded

def rotateImage(image, angle):
  cols, rows = image.shape[:2]
  rot_mat = cv2.getRotationMatrix2D((rows/2, cols/2),angle,1)
  result = cv2.warpAffine(image, rot_mat, (cols, rows),flags=cv2.INTER_LINEAR)
  return result


select_color = [(0,0,0),(0,0,255),(0,255,0),(255,0,0),(255,0,255),(255,255,0),(0,255,255),(255,255,255),(0,0,127),(0,127,0),(127,0,0),(127,0,127),(127,127,0),(0,127,127),(127,127,127)]

module = demo.TFrun()

json_data = {}
results = []
new_data = {}
global car_counter, bike_counter, bicycle_counter, person_counter
car_counter = 0
bike_counter = 0
bicycle_counter = 0
person_counter = 0

class kalman_track():


        def __init__(self,pt,dt,acceleration):
                self.KF = kalman.TKalmanFilter(pt,dt,acceleration)
                global NextID
                self.misses = 0
                self.trace = []
		self.begin_time = time.time()
		self.prediction = pt
		self.points = []
		self.Count = 0
                self.trackID = NextID
		self.objectclass = []
                NextID += 1

def check_line(t, h):
	
	return (t - (h/2))




def Update(detections, clist):	
	global car_counter, bike_counter, bicycle_counter, person_counter
	global counter
	if len(tracks) == 0:
		
		#-----------------------------------------------------------------
		#If there is no tracks yet, then every point begins it's own track
		#-----------------------------------------------------------------		
		for i in range(len(detections)):
	
			tr = kalman_track(detections[i],dt,acceleration)
			tracks.append(tr)
			tracks[i].objectclass.append(clist[i])

	N = len(tracks)
	M = len(detections)
	Cost = []
	assignment = []

	for i in range(N): #len(tracks)):
		for j in range(M): #len(detections)):
			diff = (magnitude(tracks[i].prediction[0], detections[j][0]) , magnitude(tracks[i].prediction[1],detections[j][1]))
			dist = math.sqrt(diff[0]*diff[0] + diff[1]*diff[1])
			Cost.append(dist)


	Cost = np.reshape(Cost, (N,M)).astype('float32')
	if M > N:
		pass
	else:
		Cost = pad_to_square(Cost,555)
	
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
	#Not assigned tracks
	for i in range(len(assignment)):

		if assignment[i] != -1:
			if int(Cost[i][assignment[i]])>max_distance:
				assignment[i] = -1
					
				#Mark unassigned tracks, and increment skipped frames counter,
				#when skipped frames would be larger than threshold, reack will ve deleted 
				not_assigned_tracks.append(i)
		
		else:
			
			tracks[i].misses += 1

	#-------------------------------------------------------
	#If track didn't get detected for a long time, delete it
	#-------------------------------------------------------
		
	for i in range(len(tracks)):
		if flag == 1:
			flag == 0
			i -= 1
		try:
			if(tracks[i].misses > max_misses):

				del tracks[i]
				#del tracks[:i]
				del assignment[i]
				#del val_assignment[:i]
				#del assignment[:i]
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
			print("not assigned :{}").format(not_assigned_detections)
		
	#----------------------------	
	#Start a new tracker for them
	#----------------------------
	if len(not_assigned_detections) != 0:
		for i in range(len(not_assigned_detections)):
			tr = kalman_track(detections[not_assigned_detections[i]],dt,acceleration)
			tracks.append(tr)
			tracks[not_assigned_detections[i]].objectclass.append(clist[not_assigned_detections[i]])
	#--------------------
	#Update Kalman filter
	#-------------------
	
	for i in range(len(assignment)):
		tracks[i].KF.GetPrediction()
		if(assignment[i] != -1):
			tracks[i].misses = 0
			tracks[i].prediction = tracks[i].KF.Update(detections[assignment[i]],1)
			tracks[i].points.append(tracks[i].prediction)
                        for p in tracks[i].points:
                                channel = i%14

                                #cv2.circle(frame, p, 3, select_color[channel], thickness=-1, lineType=cv2.LINE_AA, shift=0)


		
		else:
			tracks[i].prediction = tracks[i].KF.Update((0,0),0)

		if(len(tracks[i].trace) > max_trace):
			l = len(tracks[i].trace)
			p = l - max_trace
			del tracks[i].trace[:p] #check

		tracks[i].trace.append(tracks[i].prediction)
		tracks[i].KF.LastResult = tracks[i].prediction
		print("object here is {}").format(tracks[i].objectclass)



	results = []
	new_data = {}
	
	for i in range(len(tracks)):
		cv2.putText(frame, "Count: "+str(counter), (10,60), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(0,0,0),2,cv2.LINE_AA)
		#cv2.putText(frame, "Last contribution by: Track " + str(tracks[i].trackID+1), (30,60), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,0,0),3,cv2.LINE_AA)

		if len(tracks[i].points) > 3:
			keep_track = {}
			keep_track['id'] = tracks[i].trackID + 1
			keep_track['coordinates'] = tracks[i].points
			results.append(keep_track)
			new_data['results'] = results
		if len(tracks[i].points) > 6 and tracks[i].Count == 0:
			tracks[i].Count += 1
			counter += 1
			"""
			if tracks[i].objectclass[0] == "motorbike": 
					bike_counter += 1
			if tracks[i].objectclass[0] == "car":
					car_counter += 1
			if tracks[i].objectclass[0] == "person":
					person_counter += 1
			if tracks[i].objectclass[0] == "bicycle":
					bicycle_counter += 1
			#except: pass
			
			#print("track : {}, count : {}, class: {}").format(tracks[i].trackID+1, tracks[i].Count, tracks[i].objectclass)
	if bicycle_counter != 0:
		cv2.putText(frame, "Bicycle Count: "+str(bicycle_counter), (10,60), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(255,255,255),2,cv2.LINE_AA)
        if person_counter != 0:
		cv2.putText(frame, "Person Count: "+str(person_counter), (40,60), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(255,255,255),2,cv2.LINE_AA)
        if car_counter != 0:
		cv2.putText(frame, "Car Count: "+str(car_counter), (70,60), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(255,255,255),2,cv2.LINE_AA)
        if bike_counter != 0:
		cv2.putText(frame, "Bike Count: "+str(bike_counter), (100,60), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(255,255,255),2,cv2.LINE_AA)
	"""
	#print new_data
			
			

# if __name__ == "__main__":
# 	cnt = 0
# 	#detections = something
# 	url = sys.argv[1]
# 	centers = []
# 	cap = cv2.VideoCapture(url)
# 	#print "videcapture created"
# 	#fgbg = cv2.createBackgroundSubtractorMOG2()
# 	#print "bk created"
# 	frameid = 0

# 	kernel = np.ones((5,5),np.uint8)
# 	while True:
# 		frameid += 1		
# 		ret, frame = cap.read()
# 		#frame = cv2.resize(frame, (640,480))
# 		h,w = frame.shape[:2]
# 		#print "height width: {}".format((h,w))
# 		k = cv2.waitKey(30) & 0xff
# 		if k == 27:
# 			break
	
# 		centers = []
# 		classlist = []
# 		#frame = rotateImage(frame,-180)
#                 result, frame = module.runFrame(frame)
# 		for (cent, class_name) in result:
# 			centers.append(cent)
# 			classlist.append(class_name)

#                 if len(centers) > 0:
# 			#print "CENTERS: {}".format(centers)
#                         Update(centers, classlist)
#                         for i in xrange(len(tracks)):
#                                 if len(tracks[i].trace) > 1:
#                                         for j in xrange(len(tracks[i].trace)-1):
#                                                 cv2.putText(frame, str(tracks[i].trackID+1), (tracks[i].prediction[0],tracks[i].prediction[1]), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,255,255),3,cv2.LINE_AA)					
# 						#pass
# 						#cv2.imshow('final', frame)
# 		cv2.imwrite('/media/graymatics/9114c6cf-928a-4210-9b8a-1504cfb979a1/tracks/'+str(frameid) + '.jpg', frame)