/**
 * Model : User List
 */

var mongoose = require('mongoose');
var config = require('../config');

var text_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.text_db);


var Schema = mongoose.Schema;

var userListSchema = new Schema({
    name : String,
    email : String,
    mobile_number : String,
    assign_list : Boolean,
    share_list : Boolean,
    escalation_list : Boolean,
    created_dtime : { type: Date, default: Date.now },
    modified_dtime : { type: Date, default: Date.now }
});
 

var userListModel = text_db_conn.model('config_user_list', userListSchema);

module.exports = userListModel;
