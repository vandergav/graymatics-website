var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var user_list = require("../controllers/user_list");
var validateHelper = require("../utility/ValidateHelper");

/* Create Contact */
router.post('/user_list', function(req, res, next) {

	logger.info("Route: /user_list/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("name", "Please input Name").notEmpty();
	req.check("email", "Please input Email").notEmpty();
	req.check("mobile_number", "Please input Mobile Number").notEmpty();

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

}, user_list.createUser);

/* Update Contact */
router.put('/user_list', function(req, res, next) {

	logger.info("Route: /contact/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("name", "Please input Name").notEmpty();
	req.check("email", "Please input Email").notEmpty();
	req.check("mobile_number", "Please input Mobile Number").notEmpty();
	//req.check("assign_list", "Please input Assign List").notEmpty();
	//req.check("share_list", "Please input Share List").notEmpty();
	//req.check("escalation_list", "Please input Escalation List").notEmpty();

	//req.check("email", 'Email is not correct.').isEmail();

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

}, user_list.updateUser);

router.get('/user_list', function(req, res, next) {

	logger.info("Route: /user_list/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, user_list.listUsers);

router.delete('/user_list/:_id', function(req, res, next) {

	logger.info("Route: Delete User");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, user_list.deleteUser);

module.exports = router;
