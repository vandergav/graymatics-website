var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var event = require("../controllers/event");
var validateHelper = require("../utility/ValidateHelper");

/* Create Contact */
router.post('/event', function(req, res, next) {

	logger.info("Route: /event/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("algo", "Please input algo").notEmpty();
	req.check("type", "Please input type").notEmpty();
	req.check("info", "Please input info").notEmpty();

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

}, event.createEvent);


router.get('/event', function(req, res, next) {

	logger.info("Route: /event/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, event.getEvent);

module.exports = router;
