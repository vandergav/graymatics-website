/**
 * Model : Configuration Notification
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Color = new Schema({
    green: Boolean,
    yellow: Boolean,
    red: Boolean,
});

var Tab = new Schema({
    tab: String,
    color: [Color],
    child: Color
});

var Configuration = new Schema({
    feature: String,
    display_on_tab: [Tab],
    child : Tab
});

var configNotificationSchema = new Schema({
    user_id: Number,
    configuration: [Configuration],
    child: Configuration,
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
});

var configNotificationModel = mongoose.model('config_notification', configNotificationSchema); 

module.exports = configNotificationModel;
