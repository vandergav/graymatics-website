import sys
import logging
import logging.handlers

def logged():
	# logger = logging.getLogger('Controller')
	# hdlr = logging.FileHandler('Controller.log')
	# formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
	# hdlr.setFormatter(formatter)
	# logger.addHandler(hdlr) 
	# logger.setLevel(logging.DEBUG)
	fh = logging.handlers.RotatingFileHandler('Controller.log', maxBytes=1000000, backupCount=5)
	fh.setLevel(logging.DEBUG)
	# fh2 = logging.handlers.RotatingFileHandler('pokerprogram_info_only.log', maxBytes=1000000, backupCount=5)
	# fh2.setLevel(logging.INFO)
	# er = logging.handlers.RotatingFileHandler('errors.log', maxBytes=2000000, backupCount=2)
	# er.setLevel(logging.WARNING)
	# ch = logging.StreamHandler(sys.stdout)
	# ch.setLevel(1)
	fh.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
	# fh2.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
	# er.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
	# ch.setFormatter(logging.Formatter('%(name)s - %(levelname)s - %(message)s'))
	root = logging.getLogger()
	root.setLevel(logging.DEBUG)
	# alternatively:
	# root.setLevel(min([fh.level, fh2.level, ch.level, er.level])

	root.addHandler(fh)
	# root.addHandler(fh2)
	# root.addHandler(ch)
	# root.addHandler(er)
	return root
