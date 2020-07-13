import traceback
import cv2
import sys
import zmq
import time
sys.path.append('../../../')
import logging
import logger
from zmqclient import zmqConnect


logger.setup_logger("themes",'themes.log')
logger_1 = logging.getLogger("themes")


        

class themesClassifier(object):
        """docstring for PeoleCounter"""
        def __init__(self, arg=None):
                super(themesClassifier, self).__init__()
                self.arg = arg  
                self.__name = 'THEMES'
                self.tracker = None
                self.min_dist = 170
                self.total_count = 0
                #self.detector = zmqConnect()

        @property
        def name(self):
                return self.__name

        def analyze(self, frame,send_end,  _id=None,  scale=1):
                algo_startTime = time.time()
                print("I am here in themesClassifier")          
                count = 0
                box = []
                to_return = []
                result = {}
                try:
                        centers = []
                        print("I am here just about to analyze")
                        print frame.shape
                        t = time.time() 
                        try:
                                self.detector = zmqConnect()
                        except Exception as e:
                                print "ZMQ error : ", e
                                logger_1.debug({"Api " : "person Count", "error": str(e)})
                        resAlgo= self.detector.send('frame',frame)
                        result['themes'] = ""
                        result['confidence'] = 0.0
                        for data in resAlgo["predictions"]:
                        	if data["confidence_index"] >= result['confidence'] :
                        		result['themes'] = data["object"]
                        		result['confidence'] = data["confidence_index"]

                        self.detector.stop() 
                except Exception as e:
                        print "themesClassifier{err}:"
                        traceback.print_exc()
                print "ALGO DURATION : ", time.time()-algo_startTime
                print("RESULTTTTTT: {}").format(result)
                return result
'''
if __name__=="__main__":

	cap = cv2.VideoCapture('/home/sadhna/graymatics/development/vehicle.mp4')
	p = themesClassifier()
	send_end = ""
	while(cap.isOpened()):
		_, frame  = cap.read()
		start_time = time.time()

		r = p.analyze(frame, send_end)
		print r
		print time.time() - start_time, r

'''
