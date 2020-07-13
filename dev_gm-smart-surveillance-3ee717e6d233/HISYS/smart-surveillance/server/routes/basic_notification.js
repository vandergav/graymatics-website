var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var notification = require("../controllers/basic_notification");
var validateHelper = require("../utility/ValidateHelper");

/* Update Notification */
router.post('/basic_notification', function(req, res, next) {

	logger.info("Route: /basic_notification/create:");
	logger.info("Parameters : req.body: " , req.body);

    // any validations we can add here.
    req.check("_id", "Please input _id").notEmpty();
    req.check("user_id", "Please input user_id").notEmpty();
	req.check("type", "Please input type").notEmpty();
	req.check("status", "Please input status").notEmpty();

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

}, notification.createNotification);

/* Update Notification */
router.put('/basic_notification', function(req, res, next) {

	logger.info("Route: /basic_notification/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("_id", "Please input camera id").notEmpty();
	req.check("status", "Please input status").notEmpty();

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

}, notification.updateNotification);

/* Get todays notification count */
router.get('/basic_notification/count/:user_id/:type', function(req, res, next) {
	logger.info("Route: /basic_notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getNotificationCount);

/* Get todays notification count */
router.get('/basic_notification/action/count/:user_id/:type', function(req, res, next) {
	logger.info("Route: /basic_notification/action:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getActionNotificationCount);


module.exports = router;
