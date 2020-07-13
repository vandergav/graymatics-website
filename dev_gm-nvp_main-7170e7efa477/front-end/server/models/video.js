/**
 * Table `t_site`
 * @param {Integer} camera_id
 * @param {Integer} user_id
 */

var db = require("../lib/Database_Singletone"),
	dateHelper = require("../helpers/DateHelper"),
	logger = require('../utility/logger');


/**
 * Constructor
 * @param {Object} params
 */
var video = function(params) {
	if (typeof params === "undefined") {
		params = {}
	}

	if (typeof params.camera_id !== 'undefined') {
		this.camera_id = params.camera_id
	}

	if (typeof params.user_id !== 'undefined') {
		this.user_id = params.user_id
	}

	if (typeof params.name !== 'undefined') {
		this.name = params.name
	}

	if (typeof params.source !== 'undefined') {
		this.source = params.source
	}

	if (typeof params.protocol !== 'undefined') {
		this.protocol = params.protocol
	}

	if (typeof params.interface !== 'undefined') {
		this.interface = params.interface
	}

	if (typeof params.fps !== 'undefined') {
		this.fps = params.fps
	}

	if (typeof params.algo !== 'undefined') {
		this.algo = params.algo
	}

	if (typeof params.parameters !== 'undefined') {
		this.parameters = params.parameters
	}

	if (typeof params.addi_info !== 'undefined') {
		this.addi_info = params.addi_info
	}

	if (typeof params.roi !== 'undefined') {
		this.roi = params.roi
	}

	if (typeof params.type !== 'undefined') {
		this.type = params.type
	}

	if (typeof params.status !== 'undefined') {
		this.status = params.status
	}

	if (typeof params.agent !== 'undefined') {
		this.agent = params.agent
	}

	if (typeof params.frame !== 'undefined') {
		this.frame = params.frame
	}

}

/**
 * Method for insert new site.
 * @param {Function} callback callback function with result
 */
video.prototype.save = function(callback) {
	var self = this
	// for now static data
	self.protocol = 'RTSP';
	self.interface = 'onvif';
	var algo_list = JSON.stringify(self.algo);
	this.insertValidate(callback, function() {
		var SQLQUERY =	db.mysql.query("INSERT INTO `videos` SET ?",
							{
								user_id: self.user_id, 
								name: self.name,
								type: self.type,
								source: self.source,
								protocol: "RTSP", 
								interface: "onvif", 
								fps: self.fps,
								algo: algo_list,
								addi_info: self.addi_info,
								parameters: self.parameters,
								status : self.status,
								agent: self.agent,
								created_dtime: dateHelper.toMySQL(new Date()),
								modified_dtime: dateHelper.toMySQL(new Date())
							},
							function(err, result, fields) {
							    if (!err) {
							    	logger.info("Video is created successfully.")
									self.camera_id = result.camera_id
									result.video_name = self.name
							    }else if(err){
							    	logger.error(SQLQUERY.sql+":"+err.message)
							    }
							    callback(err, result)
							}
						)
	})
	
}

/**
 * Validate fields
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
video.prototype.insertValidate = function(callbackError, callbackOK) {
	var self = this
	var index = 0
	var callbacks = [];
	var errors = [];

	// Check if have errors
	callbacks.push(function() {
		if (typeof errors[0] === "undefined") {
			callbackOK();
		} else {
			if(errors){
				logger.error(errors)
			}
			callbackError(errors)
		} 
	})

	callbacks[index]()
}

video.prototype.update = function(callback) {
	var self = this
	this.updateData(callback)
}


video.prototype.updateData = function(callback) {
	var obj = {}
	if (typeof this.name !== "undefined") {
		obj.name = this.name
	}

	if (typeof this.type !== "undefined") {
		obj.type = this.type
	}

	if (typeof this.source !== "undefined") {
		obj.source = this.source
	}

	if (typeof this.protocol !== "undefined") {
		obj.protocol = this.protocol
	}

	if (typeof this.fps !== "undefined") {
		obj.fps = this.fps
	}

	if (typeof this.agent !== "undefined") {
		obj.agent = this.agent
	}

	if (typeof this.status !== "undefined") {
		obj.status = this.status
	}

	// if (typeof this.algo !== "undefined") {
	// 	obj.algo = this.algo
	// }

	if (typeof this.addi_info !== "undefined") {
		obj.addi_info = this.addi_info
	}

	if (typeof this.parameters !== "undefined") {
		obj.parameters = this.parameters
	}

	if (typeof this.roi !== "undefined") {
		obj.roi = JSON.stringify(this.roi)
	}

	if (typeof this.frame !== "undefined") {
		obj.frame = this.frame
	}

	obj.modified_dtime = dateHelper.toMySQL(new Date())

	var SQLQUERY =	db.mysql.query("UPDATE `videos` SET ? WHERE `camera_id` = " + this.camera_id,
						obj,
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}else{
								logger.info("Video has been updated.");
							}
							callback(err, result)
						}
					)
}

/**
 * Get user cams information
 * @param {Function} callback callback function with results
 */
video.prototype.getUserVideos = function(user_id,callback) {
	var self = this
	logger.info("Model Parameters : req.params: " +user_id);
	var SQLQUERY =	db.mysql.query("SELECT * FROM `videos` WHERE `user_id` = ?",
						[user_id],
						function(err, result, fields) {
						  if(err){
							  logger.error(SQLQUERY.sql+":"+err.message)
						  }else{
							  logger.info("User videos has been listed.")
						  }
						  callback(err, result)
						}
					)	
}

/**
 * Get user cameara  information
 * @param {Function} callback callback function with results
 */
video.prototype.getVideoDetails = function(camera_id,callback) {
	var self = this

	var SQLQUERY =	db.mysql.query("SELECT * FROM `videos` WHERE `camera_id` = ?",
						[camera_id],
						function(err, result, fields) {
						  if(err){
							  logger.error(SQLQUERY.sql+":"+err.message)
						  }else{
							  logger.info("Video information fetched.")
						  }
						  callback(err, result)
						}
					)	
}

/**
 * Delete video
 * @param {Function} callback callback function with result
 */
video.prototype.remove = function(camera_id, callback) {
	
	logger.info('Model: executing remove() ', camera_id);

	var self = this
	var SQLQUERY = 	db.mysql.query("DELETE FROM `videos` WHERE " +
						" `camera_id` = " + camera_id,
						function(err, result, fields) {
							if (!err) {
						    	logger.info("Video has been deleted.")
						    }else if(err){
						    	logger.error(SQLQUERY.sql+":"+err.message)
						    }
					    	callback(err, result)
						}
					)
}

exports.video = video