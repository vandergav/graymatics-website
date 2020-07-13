/**
 * Model : Subject
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

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
 

var subjectModel = text_db_conn.model('face_subject', subjectSchema);

module.exports = subjectModel;
