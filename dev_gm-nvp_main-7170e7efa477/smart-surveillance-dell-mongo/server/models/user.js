/**
 * Model : Configuration Notification
 */

var mongoose = require('mongoose');
var config = require('../config');

var media_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.media_db);


var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id                         : String,
    company_name                    : String,
    parent                          : String,
    status                          : String,
    username                        : String,
    user_type                       : String,
    mobile_number                   : String,
    user_email                      : String,
    user_password                   : String,
    user_email_confirmation_code    : String,
    user_email_confirmed            : String,
    user_registration_complete      : String,
    last_login                      : { type: Date, default: Date.now },
    created_dtime                   : { type: Date, default: Date.now },
    updated_dtime                   : { type: Date, default: Date.now }
});

var userModel = media_db_conn.model('user', userSchema); 

module.exports = userModel;
