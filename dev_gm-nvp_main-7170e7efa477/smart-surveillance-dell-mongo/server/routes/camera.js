var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var camera = require("../controllers/camera");
var validateHelper = require("../utility/ValidateHelper");

/* Create camera */
router.post('/camera', function(req, res, next) {

	logger.info("Route: /camera/create:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("user_id", "Please input User Id").notEmpty();
	req.check("name", "Please input Name").notEmpty();
	req.check("source", "Please input Source").notEmpty();
	//req.check("protocol", "Please input Protocol").notEmpty();
	//req.check("fps", "Please input FPS").notEmpty();
	//req.check("algo", "Please input Algo").notEmpty();
	//req.check("created_at", "Please input created time").notEmpty();
	//req.check("modified_at", "Please input modified time").notEmpty();
	//req.check("parameters", "Please input Parameters").notEmpty();
	//req.check("addi_info", "Please input Add.into").notEmpty();


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

}, camera.createCamera);

/* update camera */
router.put('/camera', function(req, res, next) {

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

}, camera.updateCamera);

/* get camera */
router.get('/camera/get/:camera_id', function(req, res, next) {

	logger.info("Route: /user/get camera:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, camera.getCameraDetails);

/* list camera */
router.get('/camera/:user_id', function(req, res, next) {

	logger.info("Route: /user/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, camera.listCameras);

/* get camera frame */
router.get('/camera/frame_extract', function(req, res, next) {

	logger.info("Route: /camera/frame_extract:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, camera.getFrame);

/* start camera  */
router.get('/camera/start', function(req, res, next) {

	logger.info("Route: /camera/start:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, camera.startCamera);

/* stop camera  */
router.get('/camera/stop', function(req, res, next) {

	logger.info("Route: /camera/stop:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, camera.stopCamera);


/* delete camera */
router.delete('/camera/:camera_id', function(req, res, next) {

	logger.info("Route: Delete Contact");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, camera.deleteCamera);

module.exports = router;
