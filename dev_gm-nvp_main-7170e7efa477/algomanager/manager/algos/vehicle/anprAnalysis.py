from openalpr import Alpr
import cv2
import sys, traceback
import os

class AnprWorker:

        def __init__(self):
                global alpr
                self.plateCounter = 0
                alpr = Alpr("in", "/home/gmind/algos/openalpr/src/build/config/openalpr.conf", "/home/gmind/algos/openalpr/runtime_data")
                if not alpr.is_loaded():
                        print("Error loading OpenALPR")
                        sys.exit(1)


        def process(self, frame):
                ret, enc = cv2.imencode("*.jpg", frame)

                alpr.set_top_n(1)
                alpr.set_default_region("jkt")
                #alpr.set_detect_region(False)
                self.plateCounter += 1
                results = alpr.recognize_array(bytes(bytearray(enc)))

                try:
                        res = {}
                        plates =  [plate for plate in results['results']]
                        ### POST-process the ANPR result.... 
                        ### selecting the highest confidence
                        if len(plates) > 0:
                                res['result'] = ""
                                res['notify'] = ""
                                for plate in plates:
                                        print plate
                                        number = "%12s "%(plate['plate'])
                                        print 'AnprWorker: plate %12s %12s'%(number, plate['coordinates'][0])
                                        print 'number. ', number.encode('ascii', 'replace')
                                        number = number.encode('ascii', 'replace')
                                        print 'number.. ', number, type(number)
                                        #conf = [plate['confidence'] for plate in plates]
                                        print 'add result'
                                        res['result'] += number


                except Exception as e:
                        print "AnprWorker: ",e

                print "AnprWorker: ", res
                return str(number)


