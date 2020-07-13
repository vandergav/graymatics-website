var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var reports = require("../controllers/reports");
var validateHelper = require("../utility/ValidateHelper");




/* Get summary report */
router.get('/reports/summary/:user_id', function(req, res, next) {
	logger.info("Route: /reports/summary:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, reports.getSummary);

/* Get vehicle reports */
router.get('/reports/vehicle/:user_id', function(req, res, next) {
	logger.info("Route: /reports/vehicle:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, reports.getVehicle);

/* Get notification reports */
router.get('/reports/notifications/:user_id', function(req, res, next) {
	logger.info("Route: /notification/action:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, reports.getNotifications);

/* Get face reports */
router.get('/reports/face/:user_id', function(req, res, next) {
	logger.info("Route: /reports/face:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.params));

	next();

}, reports.getFace);


module.exports = router;
