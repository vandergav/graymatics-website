/**
 * Model : Notification
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    _id: String,
    scene_id: String,
	camera_id: String,
    user_id: String,
    camera_name: String,
    message: String,
    type: String,
    frame_id: String,
    frame: String,
    result: Object,
    status: String,
    media_type: String,
    timestamp:String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var notificationModel = text_db_conn.model('notification', notificationSchema);

module.exports = notificationModel;
