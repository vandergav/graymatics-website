import zmq
import numpy as np
import cv2
import json
import zlib, cPickle as pickle
import sys
import time


class SerializingSocket(zmq.Socket):
    """A class with some extra serialization methods
    
    send_array sends numpy arrays with metadata necessary
    for reconstructing the array on the other side (dtype,shape).
    Also sends array name for display with cv2.show(image).
    recv_array receives dict(arrayname,dtype,shape) and an array
    and reconstructs the array with the correct shape and array name.
    """

    def send_array(self, A, arrayname="NoName",flags=0, copy=True, track=True):
        """send a numpy array with metadata and array name"""
        md = dict(
            arrayname = arrayname,
            dtype = str(A.dtype),
            shape = A.shape,
        )
        self.send_json(md, flags|zmq.SNDMORE)
	print "send_array ", md
        return self.send(A, flags, copy=copy, track=track)

    def recv_array(self, flags=0, copy=True, track=False):
        """recv a numpy array, including arrayname, dtype and shape"""
        md = self.recv_json(flags=flags)
        msg = self.recv(flags=flags, copy=copy, track=track)
        A = np.frombuffer(msg, dtype=md['dtype'])
        return (md['arrayname'], A.reshape(md['shape']))


class SerializingContext(zmq.Context):
    _socket_class = SerializingSocket


class zmqConnect():
    '''A class that opens a zmq REQ socket on the headless computer
    '''
    def __init__(self, connect_to="tcp://localhost:7070"):
        '''initialize zmq socket for sending images to display on remote computer'''
        '''connect_to is the tcp address:port of the display computer'''
	self.zmq_context = SerializingContext()
        self.zmq_socket = self.zmq_context.socket(zmq.REQ)
        self.zmq_socket.connect(connect_to)

    def send(self, arrayname, array):
        '''send image to display on remote server'''
	start_time = time.time()
	#logger_1.debug({"in zmq send" :array})
	if array.flags['C_CONTIGUOUS']:
            # if array is already contiguous in memory just send it
            print self.zmq_socket.send_array(array, arrayname, copy=False)
        else:
            # else make it contiguous before sending
            array = np.ascontiguousarray(array)
            self.zmq_socket.send_array(array, arrayname, copy=False)
        message = self.zmq_socket.recv()
        return pickle.loads(message)

#client = zmqConnect()
#import cv2, numpy as np
#img = cv2.imread('/home/paddy/Pictures/bluelady.jpg')
#client.imshow("frame", img)
