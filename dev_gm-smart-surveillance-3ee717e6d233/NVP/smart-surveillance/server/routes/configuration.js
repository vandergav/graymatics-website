var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var configuration = require("../controllers/configuration");
var validateHelper = require("../utility/ValidateHelper");

/* Get Configuration of Notification */
router.post('/configuration/notification', function(req, res, next) {
	logger.info("Route: /configuration/notification/create:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, configuration.createConfigNotification);

/* Get Configuration of Notification */
router.get('/configuration/notification/:user_id', function(req, res, next) {
	logger.info("Route: /configuration/notification/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, configuration.getConfigNotification);

/* Update Contact */
router.put('/configuration/notification', function(req, res, next) {

	logger.info("Route: /configuration/notification/update:");
	logger.info("Parameters : req.body: " , req.body);

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

}, configuration.updateConfigNotification);

/* Remove Configuration of Notification */
router.delete('/configuration/notification/:_id', function(req, res, next) {
	logger.info("Route: /configuration/notification/delete:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, configuration.removeConfigNotification);

module.exports = router;
