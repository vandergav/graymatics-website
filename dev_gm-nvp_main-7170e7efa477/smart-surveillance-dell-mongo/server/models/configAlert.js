/**
 * Model : Configuration Alert
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var configAlertSchema = new Schema({
	user_id: Number,
    feature: String,
    rule: String,
    sms_alert: Boolean,
    email_alert: Boolean,
    alert_list: String,
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
});
 

var configAlertModel = text_db_conn.model('config_alert', configAlertSchema);

module.exports = configAlertModel;
