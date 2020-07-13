var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var notification = require("../controllers/notification");
var validateHelper = require("../utility/ValidateHelper");

/* Update Notification */
router.post('/notification', function(req, res, next) {

	logger.info("Route: /notification/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("camera_id", "Please input camera id").notEmpty();
	// req.check("camera_name", "Please input camera name").notEmpty();
	// req.check("type", "Please input type").notEmpty();
	// req.check("frame", "Please input frame").notEmpty();
	// req.check("result", "Please input result").notEmpty();
	// req.check("status", "Please input status").notEmpty();
	//req.check("start_time", "Please input start time").notEmpty();
	//req.check("end_time", "Please input end time").notEmpty();


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
router.put('/notification', function(req, res, next) {

	logger.info("Route: /notification/update:");
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


/* Get Latest Notification */
router.get('/notification/latest', function(req, res, next) {
	logger.info("Route: /notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getLatestNotifications);

/* Get todays notification count */
router.get('/notification/count/:type', function(req, res, next) {
	logger.info("Route: /notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getNotificationCount);

/* Get todays notification count */
router.get('/notification/action/count/:type', function(req, res, next) {
	logger.info("Route: /notification/action:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getActionNotificationCount);

/* Get Notification */
router.get('/notification/:scene_id', function(req, res, next) {
	logger.info("Route: /notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getNotifications);

/* Get Camera Notification */
router.get('/camera/notifications/:user_id/:camera_id', function(req, res, next) {
	logger.info("Route: /camera/notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.getCameraNotifications);

/* Get Camera Notification */
router.delete('/camera/notifications/:camera_id', function(req, res, next) {
	logger.info("Route: /camera/notification/remove:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, notification.removeCamNotifications);


module.exports = router;
