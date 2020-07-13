/**
 * Model : User List
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var alertUserSchema = new Schema({
    name : String,
    email : String,
    mobile_number : String,
    sms_alert : Boolean,
    email_alert : Boolean,
    created_dtime : { type: Date, default: Date.now },
    modified_dtime : { type: Date, default: Date.now }
});
 

var alertUserModel = text_db_conn.model('alert_user', alertUserSchema);

module.exports = alertUserModel;
