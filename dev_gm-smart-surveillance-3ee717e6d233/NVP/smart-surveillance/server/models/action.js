/**
 * Model : Action
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var actionSchema = new Schema({
    camera_id: Number,
    notification: String,
    action_type: String,
    assignee: String,
    assigner: String,
    start_time : { type: Date, default: Date.now },
    end_time : { type: Date, default: Date.now }
});
 

var actionModel = text_db_conn.model('action', actionSchema);

module.exports = actionModel;

