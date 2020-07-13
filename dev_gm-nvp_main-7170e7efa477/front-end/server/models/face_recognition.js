/**
 * Model : Subject
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var subjectSchema = new Schema({
    face_id         : String,
    user_id         : String,
    subject_type    : String,
    name            : String,
    age             : String,
    gender          : String,
    status          : String,
    frame           : String,
    ethnicity       : String,
    source          : String,
    created_dtime   : { type: Date, default: Date.now },
    modified_dtime  : { type: Date, default: Date.now }
});
 

var subjectModel = mongoose.model('face_subject', subjectSchema);

module.exports = subjectModel;
