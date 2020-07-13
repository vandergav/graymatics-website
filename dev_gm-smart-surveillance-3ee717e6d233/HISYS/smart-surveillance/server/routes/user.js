var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var user = require("../controllers/user");
var validateHelper = require("../utility/ValidateHelper");


/**
 * Add user
 *
 */
router.post('/user', function(req, res, next) {

	logger.info("Route: /user/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("username", "Please input username").notEmpty();
	req.check("user_email", "Please input email").notEmpty();
	req.check("company_name", "Please input company name").notEmpty();
	req.check("user_password", "Please input password").notEmpty();
	//req.check("confirm_password", "Please input confirm password").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.signUp);

/**
 * Cehck login
 *
 */
router.post('/user/login', function(req, res, next) {

	logger.info("Route: /user/login:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("username", "Please input username").notEmpty();
	req.check("user_password", "Please input password").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.signIn);


/**
 * Forgot password
 *
 */
router.post('/user/forgot', function(req, res, next) {

	logger.info("Route: /user/forgot:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("user_email", "Please input username").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.forgotPassword);

/**
 * Forgot password
 *
 */
router.post('/user/reset', function(req, res, next) {

	logger.info("Route: /user/reset:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	//req.check("user_email", "Please input username").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.resetPassword);


/**
 * Check Account
 *
 */

/*router.post('/account', function(req, res, next) {

	logger.info("Route: /user/account:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("api_key", "Please input API Key").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.account);*/

/**
 * Add user
 *
 */
router.post('/user/add_user', function(req, res, next) {

	logger.info("Route: /user/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("username", "Please input username").notEmpty();
	req.check("user_email", "Please input email").notEmpty();
	req.check("mobile_number", "Please input mobile number").notEmpty();
	req.check("user_type", "Please input password").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.addUser);

/**
 * Update user
 *
 */
router.put('/user', function(req, res, next) {

	logger.info("Route: /user/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	//req.check("name", "Please input name").notEmpty();
	//req.check("email", "Please input email").notEmpty();
	//req.check("mobile_number", "Please input mobile number").notEmpty();
	//req.check("user_type", "Please input user type").notEmpty();

	var errors = validateHelper.makeErrors(req.validationErrors());

	if(Object.keys(errors).length > 0 ){
		var response = {};
		response.status = "error";
		response.message = "Please input "+Object.keys(errors).join(", ");
		response.errors = errors;
		next(response);
		return;
	}

	next();

}, user.updateUser);

/**
 * Get User
 *
 */
router.get('/user/list/:parent', function(req, res, next) {

	logger.info("Route: /user/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, user.listUsers);


/**
 * Get User
 *
 */
router.get('/user/:user_type', function(req, res, next) {

	logger.info("Route: /user/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, user.getUserType);

/**
 * Delete User
 *
 */
router.delete('/user/:user_id', function(req, res, next) {

	logger.info("Route: /user/delete:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, user.deleteUser);

module.exports = router;
