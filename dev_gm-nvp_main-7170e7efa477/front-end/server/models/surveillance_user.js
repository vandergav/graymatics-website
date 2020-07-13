/**
 * Model : Action
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config.js'),
	autoIncrement = require('mongoose-auto-increment');

	autoIncrement.initialize(mongoose);

var userSchema = new Schema({
    user_id: { type: Number, default: 0 },
    name: String,
    email: String,
    mobile_number: String,
    status: { type: String, default: null },
    user_type: String,
    created_at : Date, 
    last_login : { type: Date, default: Date.now }
});
 

userSchema.plugin(autoIncrement.plugin, { model: 'user', field: 'user_id' });

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;

