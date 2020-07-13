/**
 * Model : User List
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var alertUserSchema = new Schema({
    name : String,
    email : String,
    mobile_number : String,
    sms_alert : Boolean,
    email_alert : Boolean,
    created_dtime : { type: Date, default: Date.now },
    modified_dtime : { type: Date, default: Date.now }
});
 

var alertUserModel = mongoose.model('alert_user', alertUserSchema);

module.exports = alertUserModel;
