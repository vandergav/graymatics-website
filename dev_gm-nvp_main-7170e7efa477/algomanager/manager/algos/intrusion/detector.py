from openpyxl import load_workbook
from darkflow.net.build import TFNet


def load_data(filename):
	wb = load_workbook(filename = filename, read_only=True)
	header = []
	ind = 0
	data = {}
	
	for row in wb['Sheet1'].rows:
		if ind == 0:
			for col in row:
				header.append(str(col.value))
			print header
			ind += 1
			continue

		frame_id = row[0].value
		data[frame_id] = {}
		for i in range(1, len(header)):
			if row[i].value is not None:
				data[frame_id][header[i]] = str(row[i].value)

	return data



class ObjectDetector(object):
	
	def __init__(self):
		self.options = {"model": "/home/gmind/algos/darkflow/cfg/yolo.cfg", "load": "/home/gmind/algos/darkflow/yolo.weights", "threshold": 0.35, "gpu": 0.9}

		self.tfnet = TFNet(self.options)

	def runFrame(self, frame):

                to_return = []
                self.result = self.tfnet.return_predict(frame)
                self.Image_to_ret = self.tfnet.drawImage(frame)
                for i in xrange(len(self.result)):
                        cls = self.result[i]["label"]
                        center = ((self.result[i]["topleft"]['x']+self.result[i]["bottomright"]['x'])/2, (self.result[i]["topleft"]['y'] + self.result[i]["bottomright"]['y'])/2)
                try: return cls
                except: pass


# if __name__ == '__main__':
# 	vd = VehicleDetector.vehicles
# 	# import os
# 	# for i in vd:
# 	# 	print i
# 	# 	file = "/home/gmind/graymatics/development/vtest/vehilce{:05d}.jpg".format(i)
# 	# 	print file
# 	# 	dst = "/home/gmind/graymatics/development/vlabel/vehicle{:05d}.jpg".format(i)
# 	# 	os.system('cp {} {}'.format(file, dst))
# 	print len(vd)
# 	for x in vd:
# 		print x, vd[x]
