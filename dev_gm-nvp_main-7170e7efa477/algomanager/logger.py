import sys
import logging
import logging.handlers

'''class Logger:
	def setup_logger(logger_name, log_file, level=logging.DEBUG):
		l = logging.getLogger(logger_name)
		formatter = logging.Formatter('%(asctime)s : %(message)s')
		fileHandler = logging.FileHandler(log_file, mode='w')
		fileHandler.setFormatter(formatter)
		streamHandler = logging.StreamHandler()
		streamHandler.setFormatter(formatter)

		l.setLevel(level)
		l.addHandler(fileHandler)
		l.addHandler(streamHandler)    

	def writeToFile(self, line):
		if self.Loggers.propagate == True:
			self.Loggers.debug(line)

	def closeFile(self):
		if self.Loggers.propagate == True:
			self.Loggers.propagate = False
'''
'''
def setup_logger(logger_name, log_file, level=logging.DEBUG):
	l = logging.getLogger(logger_name)
	l.propagate = False
	formatter = logging.Formatter('%(asctime)s : %(message)s')
	fileHandler = logging.FileHandler(log_file, mode='w+')
	fileHandler.setFormatter(formatter)
	streamHandler = logging.StreamHandler()
	streamHandler.setFormatter(formatter)
	l.setLevel(level)
	l.addHandler(fileHandler)
	l.addHandler(streamHandler)  
'''

def setup_logger(logger_name, log_file, level=logging.DEBUG):
        l = logging.getLogger(logger_name)
	l.propagate = False
	if not l.handlers:
		formatter = logging.Formatter('%(asctime)s : %(message)s')
        	fileHandler = logging.handlers.RotatingFileHandler(log_file)
       		fileHandler.setFormatter(formatter)
		l.setLevel(level)
        	l.addHandler(fileHandler)
