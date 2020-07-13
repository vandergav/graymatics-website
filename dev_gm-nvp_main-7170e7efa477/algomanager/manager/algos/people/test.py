import sys
import cv2
import traceback
from personCounter_backup import PersonCounter

# if __name__ == "__main__":
#         url_path = 'http://video.graymatics.com/vehicle-tracking/nguyenchithanh-far-2.mp4'
#         video = cv2.VideoCapture(url_path)
#         worker = PersonCounter()
#         from time import time
#         start = time()
#         try:
#                 frame_start = time()
#                 frame_cnt = 0
#                 _, frame = video.read()
#                 print 'frame_id ', frame_cnt
#                 frame_cnt += 1
#                 res = worker.analyze(frame)
#                 print res
#                 print 'total time taken %s'%(time() - frame_start)
#                 while True:
#                         frame_start = time()
#                         _, frame = video.read()
#                         frame_cnt += 1
#                         print 'frame_id ', frame_cnt
#                         res = worker.analyze(frame)
#                         print res
#                         print 'total time taken %s'%(time() - frame_start)
#                         #x = raw_input('continue')
#         except Exception,e:
#                 print traceback.print_exc(file=sys.stdout)
#                 pass
#         print 'total time taken %s'%(time()-start)
