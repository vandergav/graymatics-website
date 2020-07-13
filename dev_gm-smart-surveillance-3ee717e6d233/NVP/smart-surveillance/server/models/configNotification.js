/**
 * Model : Configuration Notification
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var configNotificationSchema = new Schema({
    _id             : String,
    user_id         : String,
    camera_id       : String,
    feature         : String,
    dot             : String,
    rule            : String,
    color           : String,
    created_at      : { type: Date, default: Date.now },
    updated_at      : { type: Date, default: Date.now }
});

var configNotificationModel = text_db_conn.model('config_notification', configNotificationSchema); 

module.exports = configNotificationModel;
