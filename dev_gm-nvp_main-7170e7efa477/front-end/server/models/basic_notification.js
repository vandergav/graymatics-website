/**
 * Table `t_site`
 * @param {Integer} user_id
 * @param {String} notification_id
 * @param {String} type
 * @param {String} status
 */

var db = require("../lib/Database_Singletone"),
dateHelper = require("../helpers/DateHelper"),
logger = require('../utility/logger');


/**
* Constructor
* @param {Object} params
*/
var basic_notification = function(params) {

    logger.info(params);
    
    if (typeof params === "undefined") {
        params = {}
    }

    if (typeof params._id !== 'undefined') {
        this._id = params._id
    }


    if (typeof params.user_id !== 'undefined') {
        this.user_id = params.user_id
    }

    if (typeof params.type !== 'undefined') {
        this.type = params.type
    }

    if (typeof params.media_type !== 'undefined') {
        this.media_type = params.media_type
    }

    if (typeof params.status !== 'undefined') {
        this.status = params.status
    }

}

/**
* Method for insert new site.
* @param {Function} callback callback function with result
*/
basic_notification.prototype.save = function(callback) {
    var self = this

    logger.info('Model: executing save() ', self);

    this.insertValidate(callback, function() {
        var SQLQUERY =	db.mysql.query("INSERT INTO `basic_notification` SET ?",
                        {
                            _id:self._id,
                            user_id: self.user_id, 
                            type: self.type,
                            status:self.status,
                            media_type: self.media_type,
                            start_time: dateHelper.toMySQL(new Date())
                        },
                        function(err, result, fields) {
                            if (!err) {
                                logger.info("Basic Notification is created successfully.")
                                self.camera_id = result.camera_id
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
basic_notification.prototype.insertValidate = function(callbackError, callbackOK) {
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

basic_notification.prototype.findByIdAndUpdate = function(callback) {
    var self = this
    this.updateData(callback)
}


basic_notification.prototype.updateData = function(callback) {
    var obj = {}

    if (typeof this.status !== "undefined") {
        obj.status = this.status
    }
    logger.info("Model: update basic notifcation ",obj)
    // obj.modified_dtime = dateHelper.toMySQL(new Date())

    var SQLQUERY =	db.mysql.query("UPDATE `basic_notification` SET ? WHERE _id = '" + this._id + "'",
                        obj,
                        function(err, result, fields) {
                            if(err){
                                logger.error(SQLQUERY.sql+":"+err.message)
                            }else{
                                logger.info("Basic notication has been updated.");
                            }
                            callback(err, result)
                        }
                    )
}

/**
* Get user cams information
* @param {Function} callback callback function with results
*/
basic_notification.prototype.getNotificationCount = function(callback) {
    var self = this
    self.start_time = dateHelper.today(new Date());
    logger.info("Model Parameters : req.params: ", self);
    // var SQLQUERY =	db.mysql.query("SELECT COUNT(*) AS count FROM `basic_notification` WHERE `user_id` = ? AND `type` = ? AND `media_type` = ? AND `start_time` >= ?",
    var SQLQUERY =	db.mysql.query("SELECT COUNT(*) AS count FROM `basic_notification` WHERE `user_id` = ? AND `type` = ? AND `media_type` = ?",
                        [self.user_id,self.type,self.media_type],
                        // [self.user_id,self.type,self.media_type,self.start_time],
                        function(err, result, fields) {
                        if(err){
                            logger.error(SQLQUERY.sql+":"+err.message)
                        }else{
                            logger.info("Notification count has returned.")
                        }
                        callback(err, result)
                        }
                    )	
}

/**
* Get user cameara  information
* @param {Function} callback callback function with results
*/
basic_notification.prototype.getActionNotificationCount = function(callback) {
    var self = this
    self.start_time = dateHelper.today(new Date());
    self.status = "complete";
    self.user_id = parseInt(self.user_id);
    logger.info("Model Parameters : req.params: ", self);
    // var SQLQUERY =	db.mysql.query("SELECT COUNT(*) AS count FROM `basic_notification` WHERE `user_id` = ? AND `type` = ? AND `media_type` = ? AND `start_time` >= ? AND `status` = ?",
    var SQLQUERY =	db.mysql.query("SELECT COUNT(*) AS count FROM `basic_notification` WHERE `user_id` = ? AND `type` = ? AND `media_type` = ? AND `status` = ?",
                        [self.user_id,self.type,self.media_type,self.status],
                        // [self.user_id,self.type,self.media_type,self.start_time,self.status],
                        function(err, result, fields) {
                        if(err){
                            logger.error(SQLQUERY.sql+":"+err.message)
                        }else{
                            logger.info("Notification count has returned.")
                        }
                        callback(err, result)
                        }
                    )	
}


exports.basic_notification = basic_notification