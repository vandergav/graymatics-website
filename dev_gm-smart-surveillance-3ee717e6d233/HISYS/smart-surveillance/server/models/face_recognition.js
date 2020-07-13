/**
 * Model : Subject
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var subjectSchema = new Schema({
    subject_type: String,
    name: String,
    age: String,
    gender: String,
    email: String,
    ethinicity: String,
    source: String,
    created_dtime : { type: Date, default: Date.now },
    modified_dtime : { type: Date, default: Date.now }
});
 

var subjectModel = mongoose.model('subject', subjectSchema);

module.exports = subjectModel;
