/**
 * Model : Action
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var actionSchema = new Schema({
    camera_id: Number,
    notification: String,
    action_type: String,
    assignee: String,
    assigner: String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var actionModel = mongoose.model('action', actionSchema);

module.exports = actionModel;

