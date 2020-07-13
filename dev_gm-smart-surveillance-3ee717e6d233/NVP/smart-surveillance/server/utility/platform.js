/**
 * Annotation utility.
 * process results
*/

var rest = require('restler');
var logger = require('../utility/logger');

exports.start_camera = function(url,callback) {
    var annotation_array = [];
    rest.get(url)
    .on('complete', 
    	function(result) {
		if (result instanceof Error) {
			logger.error('Error:', result.message);
			this.retry(5000); // try again after 5 sec 
		} else {
			callback(result);
		}
	});
}	

exports.stop_camera = function(url,callback) {
    var annotation_array = [];
    rest.get(url)
    .on('complete', 
    	function(result) {
		if (result instanceof Error) {
			logger.error('Error:', result.message);
			this.retry(5000); // try again after 5 sec 
		} else {
			callback(result);
		}
	});
}

exports.frame_selector = function(url,callback) {
    var annotation_array = [];
    rest.get(url)
    .on('complete', 
    	function(result) {
		if (result instanceof Error) {
			logger.error('Error:', result.message);
			this.retry(5000); // try again after 5 sec 
		} else {
			callback(result);
		}
	});
}	