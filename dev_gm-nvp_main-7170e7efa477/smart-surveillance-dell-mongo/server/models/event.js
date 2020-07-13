/**
 * Model : Contact
 */

var mongoose = require('mongoose');
var config = require('../config');

var media_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var eventSchema = new Schema({
    algo: String,
    type: String,
    info: String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var eventModel = mongoose.model('event', eventSchema);

module.exports = eventModel;

