/**
 * Model : Notification
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var notificationSchema = new Schema({
    _id: String,
    scene_id: String,
	camera_id: Number,
    user_id: Number,
    camera_name: String,
    message: String,
    type: String,
    frame: String,
    result: Object,
    status: String,
    timestamp:String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel;
