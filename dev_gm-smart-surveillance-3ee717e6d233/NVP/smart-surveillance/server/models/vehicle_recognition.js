/**
 * Model : Subject
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var subjectSchema = new Schema({
    _id             : String,
    list_id         : String,
    user_id         : String,
    list_type       : String,
    list_name       : String,
    vehicle_numbers : Array,
    created_dtime   : { type: Date, default: Date.now },
    modified_dtime  : { type: Date, default: Date.now }
});
 

var subjectModel = mongoose.model('vehicle_recognition', subjectSchema);

module.exports = subjectModel;
