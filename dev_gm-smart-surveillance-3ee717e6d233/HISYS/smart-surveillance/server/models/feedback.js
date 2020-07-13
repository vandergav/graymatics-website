/**
 * Model : Contact
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var feedbackSchema = new Schema({
    notification_id: String,
    user_input: String,
    info: String,
    created_at : { type: Date, default: Date.now },
});
 

var feedbackModel = mongoose.model('feedback', feedbackSchema);

module.exports = feedbackModel;

