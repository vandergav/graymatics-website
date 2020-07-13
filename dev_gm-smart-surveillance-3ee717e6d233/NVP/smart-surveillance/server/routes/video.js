var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var video = require("../controllers/video");
var validateHelper = require("../utility/ValidateHelper");

/* Create video */
router.post('/video', function(req, res, next) {

	logger.info("Route: /video/create:");
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

}, video.createVideo);

/* update video */
router.put('/video', function(req, res, next) {

	logger.info("Route: /video/update:");
	logger.info("Parameters : req.body: " , req.body);

	// any validations we can add here.
	req.check("_id", "Please input video_id").notEmpty();

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

}, video.updateVideo);

/* update video */
router.get('/video/get/:video_id', function(req, res, next) {

	logger.info("Route: /user/get video:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, video.getVideoDetails);

/* list video */
router.get('/video', function(req, res, next) {

	logger.info("Route: /user/select:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, video.listVideos);

/* get video frame */
router.get('/video/frame_extract', function(req, res, next) {

	logger.info("Route: /video/frame_extract:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, video.getFrame);

/* start video  */
router.get('/video/start', function(req, res, next) {

	logger.info("Route: /video/start:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, video.startVideo);

/* stop video  */
router.get('/video/stop', function(req, res, next) {

	logger.info("Route: /video/stop:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));

	next();

}, video.stopVideo);


/* delete video */
router.delete('/video/:video_id', function(req, res, next) {

	logger.info("Route: Delete Contact");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, video.deleteVideo);

module.exports = router;
