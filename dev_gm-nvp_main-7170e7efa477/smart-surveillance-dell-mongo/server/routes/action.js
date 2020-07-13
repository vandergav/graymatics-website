var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var action = require("../controllers/action");
var validateHelper = require("../utility/ValidateHelper");

/* Add share list */
router.post('/action/share_list', function(req, res, next) {

	logger.info("Route: /action/share_list/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	//req.check("notification_color", "Please input notification color").notEmpty();
	//req.check("camera_id", "Please input camera_id").notEmpty();
	req.check("notification", "Please input notification").notEmpty();
	req.check("action_type", "Please input action_type").notEmpty();
	req.check("assignee", "Please input assignee").notEmpty();
	req.check("assigner", "Please input assigner").notEmpty();

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

}, action.addShareEvent);

/* get share list */
router.get('/action/share_list/:in', function(req, res, next) {

	logger.info("Route: /action/share_list/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, action.getShareEvent);

/* Add assign list */
router.post('/action/assign_list', function(req, res, next) {

	logger.info("Route: /action/assign_list/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("notification", "Please input notification").notEmpty();
	req.check("action_type", "Please input action_type").notEmpty();
	req.check("assignee", "Please input assignee").notEmpty();
	req.check("assigner", "Please input assigner").notEmpty();

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

}, action.addAssignEvent);

/* get share list */
router.get('/action/assign_list/:in', function(req, res, next) {

	logger.info("Route: /action/assign_list/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, action.getAssignEvent);


/* Add escalate list */
router.post('/action/escalation_list', function(req, res, next) {

	logger.info("Route: /action/escalate_list/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("notification", "Please input notification").notEmpty();
	req.check("action_type", "Please input action_type").notEmpty();
	req.check("assignee", "Please input assignee").notEmpty();
	req.check("assigner", "Please input assigner").notEmpty();


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

}, action.addEscalateEvent);

/* get escalate list */
router.get('/action/escalation_list/:in', function(req, res, next) {

	logger.info("Route: /action/escalation_list/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, action.getEscalateEvent);

module.exports = router;
