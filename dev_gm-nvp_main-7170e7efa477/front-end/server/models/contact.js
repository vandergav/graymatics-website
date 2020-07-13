/**
 * Model : Contact
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js');

var contactSchema = new Schema({
    first_name: String,
    last_name: String,
    home_phone: String,
    land_phone: String,
    email: String,
    address: String,
    created_dtime : { type: Date, default: Date.now },
    modified_dtime : { type: Date, default: Date.now }
});
 

var contactModel = mongoose.model('contact', contactSchema);

module.exports = contactModel;
