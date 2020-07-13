/**
 * Table `t_site`
 * @param {Integer} _id
 * @param {Integer} user_id
 * @param {String} scene_id
 * @param {String} camera_id
 * @param {String} camera_name
 * @param {String} type
 * @param {String} timestamp
 * @param {String} message
 * @param {String} status
 * @param {String} end_time
 * @param {String} start_time
 */

var docClient = require("../lib/DynamoClient"),
    dateHelper = require("../helpers/DateHelper"),
    logger = require('../utility/logger');


/**
* Constructor
* @param {Object} params
*/
var notification = function(params) {

    if (typeof params === "undefined") {
        params = {}
    }

    if (typeof params._id !== 'undefined') {
        this._id = params._id
    }

    if (typeof params.camera_id !== 'undefined') {
        this.camera_id = params.camera_id
    }

    if (typeof params.user_id !== 'undefined') {
        this.user_id = params.user_id
    }

    if (typeof params.scene_id !== 'undefined') {
        this.scene_id = params.scene_id
    }

    if (typeof params.camera_name !== 'undefined') {
        this.camera_name = params.camera_name
    }

    if (typeof params.type !== 'undefined') {
        this.type = params.type
    }

    if (typeof params.timestamp !== 'undefined') {
        this.timestamp = params.timestamp
    }

    if (typeof params.message !== 'undefined') {
        this.message = params.message
    }

    if (typeof params.status !== 'undefined') {
        this.status = params.status
    }

    if (typeof params.start_time !== 'undefined') {
        this.start_time = params.start_time
    }

    if (typeof params.end_time !== 'undefined') {
        this.end_time = params.end_time
    }

    if (typeof params.frame !== 'undefined') {
        this.frame = params.frame
    }

    if (typeof params.result !== 'undefined') {
        this.result = params.result
    }
}

/**
* Method for insert new site.
* @param {Function} callback callback function with result
*/
var table = "notifications-local";
// var table = "notifications";
notification.prototype.save = function(callback) {
    var self = this;

    logger.info("Model: adding a new item...");

    var data = {
        "_id": self._id,
        "scene_id": self.scene_id,
        "user_id": self.user_id,
        "camera_id": self.camera_id,
        "camera_name": self.camera_name,
        "type": self.type,
        "timestamp": self.timestamp,
        "message": self.message,
        "status": self.status,
        "frame": self.frame,
        "result": self.result,
        "live":"T",
        "start_time": dateHelper.toMySQL(new Date()),
        "end_time": dateHelper.toMySQL(new Date())
    };

    var params = {
        TableName:table,
        Item: data
    };
    
    docClient.put(params, function(err, data) {
        if (err) {
            logger.info("Model: Unable to add notification. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: Notification added", JSON.stringify(data, null, 2));
        }
        callback(err,data);
    });
}

notification.prototype.findByIdAndUpdate = function(callback) {
    
    var self = this;
    
    logger.info("Model: updating the notification...");

    var update_info =  "set camera_id = :camera_id, \
                            camera_name = :camera_name, \
                            user_id = :user_id, \
                            message = :message, \
                            status = :status, \
                            frame = :frame, \
                            result = :result, \
                            end_time = :end_time";
    var params = {
        TableName:table,
        Key:{
            "_id": self._id
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues:{
            ':status': self.status
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    docClient.update(params, function(err, data) {
        if (err) {
            logger.error("Unable to update item. Error JSON: updateNotification()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: updateNotification succeeded:", JSON.stringify(data, null, 2));
        }
        callback(err,data);
    });
}

notification.prototype.getNotifications = function(callback) {
    
    var self = this;
   
    logger.info('Model: executing getNotifications() ');

    var params = {
        TableName: table,
        FilterExpression: "#scene_id = :scene_id",
        ExpressionAttributeNames:{
            "#scene_id": "scene_id"
        },
        ExpressionAttributeValues: {
            ":scene_id": self.scene_id
        }
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: getNotifications()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: GetItem succeeded: getNotifications()");
        }
        callback(err,data.Items);
    });
}

notification.prototype.getLatestNotifications = function(callback) {
    
    var self = this;

    logger.info('Model: executing getLatestNotifications() ');

    var params = {
        TableName: table,
        IndexName: "TimeIndex",
        KeyConditionExpression: "#live = :live and #start_time >= :start_time",
        ExpressionAttributeNames:{
            "#live": "live",
            "#start_time": "start_time"
        },
        ExpressionAttributeValues: {
            ":live":"T",
            ":start_time": dateHelper.today(new Date())
            // ":start_time": "2017-10-31"
        },
        ScanIndexForward: false
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: getLatestNotifications():", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: GetItem succeeded: getLatestNotifications()");
        }
        callback(err,data.Items);
    });
}

notification.prototype.getCameraNotifications = function(callback) {
    
    var self = this;

    logger.info('Model: executing getCameraNotifications() ');
    
    var params = {
        TableName: table,
        FilterExpression: "#user_id = :user_id and #camera_id = :camera_id",
        ExpressionAttributeNames:{
            "#user_id": "user_id",
            "#camera_id": "camera_id"
    
        },
        ExpressionAttributeValues: {
            ":user_id": self.user_id,
            ":camera_id": self.camera_id
        }
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: getCameraNotifications()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: GetCamNotification succeeded: getCameraNotifications()");
        }
        callback(err,data.Items);
    });
}

notification.prototype.getNotificationCount = function(callback) {
    
    var self = this;

    logger.info('Model: executing getNotificationCount() ');

    var params = {
        TableName: table,
        FilterExpression: "#start_time > :start_time and #type = :type",
        ExpressionAttributeNames:{
            "#type": "type",
            "#start_time": "start_time"
        },
        ExpressionAttributeValues: {
            ":type": self.type,
            ":start_time": dateHelper.today(new Date())
            // ":start_time": "2017-10-31"
        },
        Select:'COUNT'
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: getNotificationCount()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: GetCount succeeded: getNotificationCount():", JSON.stringify(data,null,2));
        }
        callback(err,data.Count);
    });
}

notification.prototype.getActionNotificationCount = function(callback) {
    
    var self = this;

    logger.info('Model: executing getActionNotificationCount() ', self);

    var params = {
        TableName: table,
        FilterExpression: "#type = :type and #status = :status and #start_time > :start_time or #start_time = :start_time",
        ExpressionAttributeNames:{
            "#start_time": "start_time",
            "#status":"status",
            "#type": "type"
        },
        ExpressionAttributeValues: {
            // ":start_time": "2017-10-31" ,
            ":start_time": dateHelper.today(new Date()) ,
            ":status":"complete",
            ":type": self.type,
        },
        Select:'COUNT'
    };
    
    docClient.scan(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: getActionNotificationCount()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: GetCount succeeded: getActionNotificationCount():", JSON.stringify(data,null,2));
        }
        callback(err,data.Count);
    });
}

notification.prototype.removeCamNotifications = function(callback) {
    
    var self = this;

    logger.info('Model: executing removeCamNotifications() ');

    var params = {
        TableName: table,
        Key:{
            "_id": self._id
        }
    };
    
    docClient.delete(params, function(err, data) {
        if (err) {
            logger.error("Model: Unable to read item. Error JSON: removeCamNotifications()", JSON.stringify(err, null, 2));
        } else {
            logger.info("Model: DeleteItem succeeded:");
        }
        callback(err,data);
    });
}

exports.notification = notification;