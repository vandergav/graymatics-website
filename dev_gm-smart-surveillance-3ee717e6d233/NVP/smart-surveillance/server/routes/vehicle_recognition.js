var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var vehicle_recognition = require("../controllers/vehicle_recognition");
var validateHelper = require("../utility/ValidateHelper");

/* Create vehicle_recognition */
router.post('/vehicle_recognition', function(req, res, next) {

	logger.info("Route: /vehicle_recognition/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("list_type", "Please input Subject Type").notEmpty();
	// req.check("name", "Please input Name").notEmpty();
	// req.check("age", "Please input Age").notEmpty();
	// req.check("gender", "Please input Gender").notEmpty();
	// req.check("ethinicity", "Please input Ethinicity").notEmpty();
	req.check("list_name", "Please input source").notEmpty();


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

}, vehicle_recognition.addList);

/* update vehicle_recognition */
router.put('/vehicle_recognition', function(req, res, next) {

	logger.info("Route: /camera/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("_id", "Please input _id").notEmpty();

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

}, vehicle_recognition.updateList);

/* Get list_name based vehicle_numbers */
router.get('/vehicle_recognition/list_name/:user_id/:list_name', function(req, res, next) {
	logger.info("Route: /vehicle_recognition");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, vehicle_recognition.getListName);

/* Get vehicle List */
router.get('/vehicle_recognition_list/:user_id', function(req, res, next) {
	logger.info("Route: /vehicle_recognition/list");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, vehicle_recognition.getVehicleList);

/* vehicle_recognition delete vehicle_list */
router.delete('/vehicle_recognition/:list_id', function(req, res, next) {
	logger.info("Route: /vehicle_recognition/:list_id");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, vehicle_recognition.removeListName);


module.exports = router;
