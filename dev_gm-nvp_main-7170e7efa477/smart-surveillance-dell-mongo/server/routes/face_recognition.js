var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var face_recognition = require("../controllers/face_recognition");
var validateHelper = require("../utility/ValidateHelper");

/* Create face_recognition */
router.post('/face_recognition', function(req, res, next) {

	logger.info("Route: /face_recognition/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("subject_type", "Please input Subject Type").notEmpty();
	// req.check("name", "Please input Name").notEmpty();
	// req.check("age", "Please input Age").notEmpty();
	// req.check("gender", "Please input Gender").notEmpty();
	// req.check("ethinicity", "Please input Ethinicity").notEmpty();
	req.check("source", "Please input source").notEmpty();


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

}, face_recognition.addSubject);

/* update face_recognition */
router.put('/face_recognition', function(req, res, next) {

	logger.info("Route: /camera/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("_id", "Please input camera_id").notEmpty();

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

}, face_recognition.updateSubject);

/* Get Latest Notification */
router.get('/face_recognition/:user_id/:_id', function(req, res, next) {
	logger.info("Route: /face_recognition");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, face_recognition.getFace);

/* Get Face List */
router.get('/face_recognition_list/:user_id', function(req, res, next) {
	logger.info("Route: /face_recognition/list");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, face_recognition.getFaceList);

/* Get face balcklist/whitelist using minio url */
router.get('/face_recognition_details/:user_id/:source', function(req, res, next) {
	logger.info("Route: /face_recognition/:user_id/:source");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, face_recognition.getFaceDetails);



module.exports = router;
