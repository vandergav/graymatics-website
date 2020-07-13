var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var feedback = require("../controllers/feedback");
var validateHelper = require("../utility/ValidateHelper");

/* Create Contact */
router.post('/feedback', function(req, res, next) {

	logger.info("Route: /feedback/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("notification_id", "Please input notification_id").notEmpty();
	req.check("user_input", "Please provide user input").notEmpty();

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

}, feedback.storeFeedback);


module.exports = router;
