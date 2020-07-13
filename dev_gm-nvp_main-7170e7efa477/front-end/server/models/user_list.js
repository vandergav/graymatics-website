/**
 * Model : User List
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

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
 

var userListModel = mongoose.model('user_list', userListSchema);

module.exports = userListModel;
