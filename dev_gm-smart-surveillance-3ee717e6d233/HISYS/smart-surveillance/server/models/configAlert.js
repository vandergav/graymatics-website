/**
 * Model : Configuration Alert
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
 

var configAlertModel = mongoose.model('config_alert', configAlertSchema);

module.exports = configAlertModel;
