"""Code for individual character segmentation and classification"""
import cv2
import time
from PIL import Image
import sys, os
import pytesseract
import plateDetector


class charSegmentation(object):

	def __init__(self):
		#self.path = os.getcwd() + '/runtime_data/ocr/tessdata/'
		#tessdata_dir_config = '--tessdata-dir "/home/graymatics/openalpr/runtime_data/ocr/tessdata/"'
		self.rcnn_init = plateDetector.plateCrop()

	def segmentation(self, frame):
		#cv2.imshow('ff', frame)	
		start_time = time.time()
		self.get_cropped_frame = self.rcnn_init.crop(frame)
		#cv2.imshow('c', self.get_cropped_frame)
		self.img = cv2.cvtColor(self.get_cropped_frame, cv2.COLOR_BGR2GRAY)
		thresh = cv2.threshold(self.img, 0, 255,cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

		"""PRE PROCESSING AND MORPHOLOGICAL OPERATIONS"""
		kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 2))
		thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
		#thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
		#thresh = cv2.dilate(thresh,kernel,iterations = 2)
		thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
		thresh = cv2.dilate(thresh,kernel,iterations = 1)
		"""POST PROCESSING/ BINARIZATION"""
		thresh = cv2.bitwise_not(thresh)
		#cv2.imshow('ll', thresh)

		"""CONVERSION TO STR"""
		conv_img = Image.fromarray(thresh)

		"""Finding contours and extracting blocks"""

		rectangles = []
		im2, contours, hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
		for cnt in contours:
        		x, y, w, h = cv2.boundingRect(cnt)
        		if w >= 12 and (h >= 2 and h <= 80):
                		centre = x + w / 2, y + h / 2
                		rectangles.append([(x,y), (x+w, y+h)])
		plate = ""
		id = 1
		

		"""Loop over the detections and classify individual Characters"""
		for rect in rectangles:
        		cv2.rectangle(self.get_cropped_frame, rect[0], rect[1], (0, 0, 255), 4)
        		im_crop = thresh[rect[0][1]:rect[1][1],rect[0][0]:rect[1][0]]
        		img_t = Image.fromarray(im_crop)
        		#cv2.imshow(str(id), im_crop)
        		#cv2.imwrite(str(id) + '.jpg',im_crop)
        		text = pytesseract.image_to_string(img_t,config='-psm 10')#lang='lus', config=tessdata_dir_config)
        		id += 1

        		try: plate += str(text)
        		except: pass
		#cv2.imshow('rect', self.get_cropped_frame)
		plate = plate[::-1]
		#if cv2.waitKey(0) & 0xff == ord('q'):
		#	cv2.destroyAllWindows()
		print plate
		return plate

if __name__ == "__main__":
	
	#num_plate = cv2.imread(sys.argv[1])
	cap = cv2.VideoCapture(sys.argv[1])
	p = charSegmentation()
	while(1):
		_,num_plate = cap.read()
		#p = charSegmentation()
		t = p.segmentation(num_plate)
		#ibreak
		print t

