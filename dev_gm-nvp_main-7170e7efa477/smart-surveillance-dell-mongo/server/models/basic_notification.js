/**
 * Model : Configuration Notification
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var basicNotificationSchema = new Schema({
    _id             : String,
    user_id         : String,
    type            : String,
    status          : String,
    media_type      : String,
    start_time      : { type: Date, default: Date.now }
});

var basicNotificationModel = text_db_conn.model('basic_notification', basicNotificationSchema); 

module.exports = basicNotificationModel;
