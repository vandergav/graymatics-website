/**
 * Table `user`
 * @param {Integer} user_id
 * @param {String} username
 * @param {String} user_password
 * @param {String} user_email_confirmed
 * @param {String} user_email_confirmation_code
 * @param {String} user_first_name
 * @param {String} user_last_name
 * @param {String} user_create_dtime
 * @param {String} user_update_dtime
 */

var crypto = require('crypto'),
	db = require("../lib/Database_Singletone"),
	memcache = require("../lib/Memcache").mcClient,
	dateHelper = require("../helpers/DateHelper"),
	validateHelper = require("../helpers/ValidateHelper"),
	mainHelper = require("../helpers/MainHelper"),
	logger = require('../utility/logger');


/**
 * Constructor
 * @param {Object} params
 */
var user = function(params) {
	if (typeof params === "undefined") {
		params = {}
	}
	this.loginUnf = false
	this.dontCheck = {}
	this.user_id = null
	
	if (typeof params.user_id !== 'undefined') {
		this.user_id = params.user_id
	}

	if (typeof params.company_name !== 'undefined') {
		this.company_name = params.company_name
	}

	if (typeof params.username !== 'undefined') {
		this.username = params.username
	}

	if (typeof params.user_type !== 'undefined') {
		this.user_type = params.user_type
	}

	if (typeof params.mobile_number !== 'undefined') {
		this.mobile_number = params.mobile_number
	}

	if (typeof params.confirm_password !== 'undefined') {
		this.confirm_password = params.confirm_password
	}

	if (typeof params.user_password !== 'undefined') {
		this.user_password = params.user_password
	}

	if (typeof params.user_old_password !== 'undefined') {
		this.user_old_password = params.user_old_password
	}


	if (typeof params.user_email !== 'undefined') {
		this.user_email = params.user_email
	}

	if (typeof params.user_email_confirmation_code !== 'undefined') {
		this.user_email_confirmation_code = params.user_email_confirmation_code
	}

	this.user_registration_complete = 'Y'
	if (typeof params.user_registration_complete !== 'undefined') {
		this.user_registration_complete = params.user_registration_complete
	}
	
	if (typeof params.parent !== 'undefined') {
		this.parent = params.parent
	}

	if (typeof params.status !== 'undefined') {
		this.status = params.status
	}

}

/**
 * Method for insert new user.
 * @param {Function} callback callback function with result
 */
user.prototype.insert = function(callback) {

	logger.info("Model: /user/insert:");
	
	var self = this
	this.insertValidate(callback, function() {
		if (typeof self.user_password !== 'undefined') {
			self.user_password = mainHelper.stringCrypt(self.user_password)
		}
		var user_email_confirmation_code = mainHelper.randomToken();
		var SQLQUERY  = db.mysql.query("INSERT INTO `users` SET ?",
							{
								username: self.username, 
								user_email: self.user_email,
								parent:self.parent, 
								user_password: self.user_password,
								company_name: self.company_name,
								user_type: self.user_type,
								user_email_confirmation_code: user_email_confirmation_code,
								create_dtime: dateHelper.toMySQL(new Date()),
								user_email_confirmed: 'Y',
								user_registration_complete: self.user_registration_complete
							},
							function(err, result, fields) {
							    if (!err) {
							    	self.user_id = result.insertId
							    	self.user_email_confirmation_code = user_email_confirmation_code
							    	logger.info("Your account has been created.")
							    }else if(err){
							    	logger.error(SQLQUERY.sql+":"+err.message)
							    }
							    callback(err, result)
							}
						)
	})
	
}

/**
 * Method for insert new user.
 * @param {Function} callback callback function with result
 */
user.prototype.addUser = function(callback) {

	logger.info("Model: /user/addUser:");
	
	var self = this

	self.userValidate(callback, function() {
		var user_email_confirmation_code = mainHelper.randomToken();
		var randomToken = mainHelper.randomToken();
		var password = mainHelper.stringCrypt(randomToken);
		var SQLQUERY  = db.mysql.query("INSERT INTO `users` SET ?",
							{
								parent: self.parent,
								username: self.username, 
								mobile_number: self.mobile_number,
								user_email: self.user_email, 
								user_password: password,
								user_type: self.user_type,
								user_email_confirmation_code: user_email_confirmation_code,
								create_dtime: dateHelper.toMySQL(new Date()),
								user_email_confirmed: 'Y',
								user_registration_complete: self.user_registration_complete
							},
							function(err, result, fields) {
							    if (!err) {
							    	self.user_id = result.insertId
							    	self.user_email_confirmation_code = user_email_confirmation_code
							    	logger.info("Your account has been created.")
							    }else if(err){
							    	logger.error(SQLQUERY.sql+":"+err.message)
							    }
							    result.username = self.username;
							    result.user_password = randomToken;
							    callback(err, result)
							}
						)
	})
	
}

/**
 * Validate fields
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
user.prototype.insertValidate = function(callbackError, callbackOK) {
	var self = this
	var index = 0
	var callbacks = [];
	var errors = {};

	// Check username
	callbacks.push(function() {
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `username` = ?",
						[self.username],
						function(err, result, fields) {
							if (err) {
								callbackError(err)
							}
							if (typeof result[0] !== "undefined") {
								errors.username = "Username '"+self.username+"' is used."
								logger.error(SQLQUERY.sql+":"+errors.username)
							}
						    callbacks[++index]()
						}
					)
	})

	// Check user_email
	callbacks.push(function() {
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email` = ?",
						[self.user_email],
						function(err, result, fields) {
							if (err) {
								callbackError(err)
							}
							if (typeof result[0] !== "undefined") {
								errors.user_email = "Email '"+self.user_email+"' is used."
								logger.error(SQLQUERY.sql+":"+errors.user_email)
							}
						 	callbacks[++index]()
						}
					)
	})

	// Check if have errors
	callbacks.push(function() {
		if (Object.keys(errors).length == 0) {
			callbackOK();
		} else {
			callbackError(errors)
		} 
	})

	callbacks[index]()
}

/**
 * Validate fields
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
user.prototype.userValidate = function(callbackError, callbackOK) {
	var self = this
	var index = 0
	var callbacks = [];
	var errors = {};

	// Check username
	callbacks.push(function() {
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `username` = ?",
						[self.username],
						function(err, result, fields) {
							if (err) {
								callbackError(err)
							}
							if (typeof result[0] !== "undefined") {
								errors.username = "Username '"+self.username+"' is used."
								logger.error(SQLQUERY.sql+":"+errors.name)
							}
						    callbacks[++index]()
						}
					)
	})

	// Check user_email
	callbacks.push(function() {
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email` = ?",
						[self.user_email],
						function(err, result, fields) {
							if (err) {
								callbackError(err)
							}
							if (typeof result[0] !== "undefined") {
								errors.user_email = "Email '"+self.user_email+"' is used."
								logger.error(SQLQUERY.sql+":"+errors.user_email)
							}
						 	callbacks[++index]()
						}
					)
	})

	// Check if have errors
	callbacks.push(function() {
		if (Object.keys(errors).length == 0) {
			callbackOK();
		} else {
			callbackError(errors)
		} 
	})

	callbacks[index]()
}

user.prototype.update = function(callback) {
	var self = this;
	var response = {},
		errors = {};
	this.updateValidate(callback,function(){
		
		self.findByUserid(function(error, result) {
			if (error) {
				callback(error);
			}
			if (!mainHelper.stringCryptTest(self.user_old_password, result.user_password)) {
				response.status = "error";
				response.message = "Password is not correct";
				errors.user_old_password = "Please input correct password";
				response.errors = errors;
				logger.error(response.message);
				callback(response);
			}
			self.updateData(callback);
		});
	});
}

user.prototype.compliteRegister = function(callback) {
	var obj = {user_registration_complete: "Y"}
	var self = this
	if (typeof this.user_password !== "undefined") {
		obj.user_password = mainHelper.stringCrypt(this.user_password)
	}

	if (this.username != "") {
		obj.username = this.username
	}


	var	SQLQUERY =	db.mysql.query("UPDATE `users` SET ? WHERE `user_email` = '" + this.user_email + "' AND `user_email_confirmation_code` = '"+ this.user_email_confirmation_code +"'",
						obj,
						function(err, result, fields) {
							self.user_id = 1
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}else{
								logger.info("Registration completed successfully.");
							}
							callback(err, result)
						}
					)
}

/**
 * Validate fields before update
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
user.prototype.completeInvitationSignUp = function(callback){
	var self = this;
	this.updateValidate(callback,function(){
		self.updateData(callback);
	});
}

/**
 * Validate fields before update
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
user.prototype.updateData = function(callback) {
	var self = this;
	
	var obj = {};

	if (typeof this.user_email !== "undefined") {
		obj.user_email = this.user_email;
	}
	
	if (typeof this.username !== "undefined") {
		obj.username = this.username;
	}

	if (typeof this.mobile_number !== "undefined") {
		obj.mobile_number = this.mobile_number;
	}

	if (typeof this.status !== "undefined") {
		obj.status = this.status;
	}

	if (typeof this.user_email !== "undefined") {
		obj.user_email = this.user_email;
	}

	if (typeof this.user_type !== "undefined") {
		obj.user_type = this.user_type;
	}
	
	if (typeof this.user_password !== 'undefined') {
		obj.user_password = mainHelper.stringCrypt(this.user_password);
	}
	
	if (typeof this.user_email_confirmation_code !== "undefined") {
		obj.user_email_confirmation_code = this.user_email_confirmation_code;
	}

	if (typeof this.user_email_confirmed !== "undefined") {
		obj.user_email_confirmed = this.user_email_confirmed;
	}
	
	if (typeof this.registration_complete !== "undefined") {
		obj.user_registration_complete = this.registration_complete;
	}

	obj.update_dtime = dateHelper.toMySQL(new Date());
	
	var	SQLQUERY =	db.mysql.query("UPDATE `users` SET ? WHERE `user_id` = " + this.user_id,
						obj,
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)	
							}else{
								logger.info("Your information has been updated.")
							}
						    callback(err, result);
						}
					);
}

/**
 * Validate fields before update
 * @param  {Function} callbackError call when have errors
 * @param  {Function} callbackOK    call when pass validate
 */
user.prototype.updateValidate = function(callbackError, callbackOk) {
	
	var self = this;
	var index = 0;
	var callbacks = [];
	var errors = {};
	var response = {};
	var message = [];

	// Check username
	callbacks.push(function() {
 		var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `username` = ? AND `user_id` != ?",
							[ self.username, self.user_id ], 
							function(err, result, fields) {
								if (err) {
									callbackError(err);
								}
			 					if (typeof result[0] !== "undefined") {
									errors.username = "Username '" + self.username+ "' is used.";
									message.push("Username already in use.");
									logger.error(SQLQUERY.sql+":"+errors.username);	
								}
								callbacks[++index]();
							}
						);
	});
	
	// Check user_email
	callbacks.push(function() {
 		var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email` = ? AND `user_id` != ?",
							[ self.user_email, self.user_id ], 
							function(err, result, fields) {
								if (err) {
									callbackError(err);
								}
								
								if (typeof result[0] !== "undefined") {
									errors.user_email = "Email '" + self.user_email + "' is used.";
									message.push("Email already in use.");
									logger.error(SQLQUERY.sql+":"+errors.user_email);	
								}
								callbacks[++index]();
							}
						);
	});
	
	// Check if have errors
	callbacks.push(function() {
 		if (Object.keys(errors).length === 0) {
			callbackOk();
		} else {
			message = message.join(" and ") ;
			response.status = "error";
			response.message = message;
			response.errors = errors;
			logger.error(errors.message);
			callbackError(response);
		}
	});

	callbacks[index]();
};

/**
 * Save user in database
	@param {Function} callback function, that will call
*/
user.prototype.save = function(callback) {

	logger.info("Model: /user/save:");
	
	if (this.user_id == null) {
		if (this.user_email_confirmation_code == null) {
			this.insert(callback)
		} else {
			this.compliteRegister(callback)
		}
	} else {
		this.update(callback)
	}
}
/**
 *  loginWithEmail in database
	@param {Function} callback function, that will call
*/
user.prototype.loginWithEmail = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email` = ? AND `user_email_confirmation_code` = ?",
					[this.user_email, this.user_email_confirmation_code],
					function(err, result, fields) {
						if (typeof result[0] === "undefined") {
							err = new Error("Invalid user_email or code. Please try again.")
							logger.error(SQLQUERY.sql+":"+err.message)
						} else {
							result[0] = showUserResult(result[0])
							result[0].stoken = mainHelper.randomToken()
							memcache.set(result[0].stoken, JSON.stringify({user_id: result[0].user_id}))
						}
						callback(err, result[0])
					}
	)
}
/**
 * update last login
 * @param  {Function} callback
 */
user.prototype.updateLastLogin = function(callback) {
	var self = this;
	
	var obj = {};

	obj.last_login = dateHelper.toMySQL(new Date());
	
	var	SQLQUERY =	db.mysql.query("UPDATE `users` SET ? WHERE `user_id` = " + this.user_id,
						obj,
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)	
							}else{
								logger.info("Your lost login has been updated.")
							}
						    callback(err, result);
						}
					);
}
/**
 *  login in database
	@param {Function} callback function, that will call
*/
user.prototype.login = function(callback) {

	logger.info("Model: /user/login:");

	var self = this

	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `username` = ?",
						[self.username],
						function(err, result, fields) {
							if (typeof result[0] === "undefined" || !mainHelper.stringCryptTest(self.user_password, result[0].user_password)) {
								err = new Error("Invalid username or password. Please try again.")
								logger.error(SQLQUERY.sql+":"+err.message)
							} else {
								result[0] = showUserResult(result[0])
								result[0].stoken = mainHelper.randomToken()
								memcache.set(result[0].stoken, JSON.stringify({user_id: result[0].user_id}))
								//update lost login
								self.user_id = result[0].user_id;
								self.updateLastLogin(function(err,result){
									logger.info("User logged in successfully")
								});
							}
							callback(err, result[0])
						}
					)
}

/**
 * Get user information
 * @param {Function} callback callback function with result
 */
user.prototype.getInfo = function(callback) {
	var self = this;
	var where = [];
	var obj = [];
	if (typeof self.user_email !== "undefined") {
		where.push("`user_email` = ?");
		obj.push(self.user_email);
	}
	
	if (typeof self.username !== "undefined") {
		where.push("`username` = ?");
		obj.push(self.username);
	}
	
	where = " WHERE " + where.join(" AND ");
	
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` "+where,
						obj, 
						function(err, result, fields) {
				 			if (typeof result[0] !== "undefined") {
								result[0] = showUserResult(result[0]);
								callback(err, result[0]);
							} else if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
								callback(err, result);
							}
						}
					);
}

/**
 *  getUsers in database
	@param {Function} callback function, that will call
*/
user.prototype.getUsers = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `parent` = ?",
					[this.parent],
					function(err, result, fields) {
						if (typeof result === "undefined") {
							err = new Error("No users found.")
							logger.error(SQLQUERY.sql+":"+err.message)
						} else {
							logger.error("Users has been fetched")
						}
						callback(err, result)
					}
	)
}

/**
 *  getUserType in database
	@param {Function} callback function, that will call
*/
user.prototype.getUserType = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_type` = ?",
					[self.user_type],
					function(err, result, fields) {
						if (typeof result === "undefined") {
							err = new Error("No users found.")
							logger.error(SQLQUERY.sql+":"+err.message)
						} else {
							logger.error("Users Types has been fetched")
						}
						callback(err, result)
					}
	)
}

/**
 * Find by email
 * @param  {Function} callback [description]
 */
user.prototype.findByEmail = function(callback) {
	var self = this
	logger.info("Model: /user/forgot/findByEmail:"+self.user_email);
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email` = ?",
						[self.user_email],
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}
							callback(err, result[0])
						}
					)
}

/**
 * Find by username
 * @param  {Function} callback [description]
 */
user.prototype.findByUsername = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `username` = ?",
						[self.username],
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}
							callback(err, result[0])
						}
					)	
}

/**
 * Find by user_id
 * @param  {Function} callback [description]
 */
user.prototype.findByUserid = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_id` = ?",
						[self.user_id],
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}
							callback(err, result[0])
						}
					)	
}

/**
 * Find by email confirmation
 * @param  {Function} callback
 */
user.prototype.findByConfirmationCode = function(callback) {
	var self = this
	logger.info("Model: /reset/code check:", self.user_email_confirmation_code);
	var	SQLQUERY =	db.mysql.query("SELECT * FROM `users` WHERE `user_email_confirmation_code` = ?",
						[self.user_email_confirmation_code],
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}
							logger.info(result);
						  	callback(err, result[0])
						}
					)		
}

/**
 * Delete user_id
 * @param  {Function} callback [description]
 */
user.prototype.deleteUser = function(callback) {
	var self = this
	var	SQLQUERY =	db.mysql.query("DELETE FROM `users` WHERE `user_id` = ?",
						[self.user_id],
						function(err, result, fields) {
							if(err){
								logger.error(SQLQUERY.sql+":"+err.message)
							}
							callback(err, result[0])
						}
					)	
}
/**
 * Delete fields
 * @param  {Object} result User info
 * @return {Object}
 */
function showUserResult(result) {
	delete result.user_password
	delete result.user_email_confirmed
	delete result.user_email_confirmation_code
	delete result.user_create_dtime
	delete result.user_update_dtime
	return result
}


exports.user = user