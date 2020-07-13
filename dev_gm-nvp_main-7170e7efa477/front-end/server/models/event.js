/**
 * Model : Contact
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var eventSchema = new Schema({
    algo: String,
    type: String,
    info: String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var eventModel = mongoose.model('event', eventSchema);

module.exports = eventModel;

