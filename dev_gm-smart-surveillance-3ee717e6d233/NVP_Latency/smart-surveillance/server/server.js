'user strict';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./utility/logger');
var config = require('./config');
var expressValidator = require('express-validator');
var cors = require('cors');
var mongoose = require('mongoose');
var rest = require('restler');
var io = require('socket.io');
var async = require("async");
var isJSON = require('is-json');
var mainHelper = require("./helpers/MainHelper");
var dateHelper = require("./helpers/DateHelper");
var lookup = require("./utility/LookupTable");
var s3 = require("./utility/S3Upload");
var amqp = require('amqplib/callback_api');
var redis = require('redis');
var redis_client = redis.createClient( config.redis.port, config.redis.host,  {no_ready_check: true});
/**
 * redis connection establishment
 */
redis_client.on('connect', function() {
	logger.info('Connected to Redis');
});

// defatult scene valeus
var camera_list = {};
var app = express();

//mongodb connetion
mongoose.connect('mongodb://'+config.database.host+'/'+config.database.databaseName);

logger.info("App starting.");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(expressValidator);
//app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // automatically supports pre-flighting

// Add routes
require('./routes')(app);

// error handlers
app.disable('x-powered-by');

app.use(function(err, req, res, next) {

			if (err instanceof Error) {
				res.send({
					status : "error",
					message : err.message
				});
			} else {
				res.send({
					status : err.status,
					message : err.message,
					errors : err.errors
				});
			}

});

var listen = app.listen(config.port,function(){
	logger.info("Application is running: " + config.url);
});

app.get("/reset/camera/:camera_id",function(req,res){
	logger.info("Route: /reset/camera:");
	logger.info("Parameters : req.params: " + JSON.stringify(req.query));
	//reset the camera notificaiton details
	camera_list[req.params.camera_id].counter = 0;
	res.send("done");
});
//open a listener for socket.io, so that server will listen for any websocket connections that may occur.
var socket = io.listen(listen);

app.get('/',function(req,res){
	res.sendfile("index.html");
});

app.post("/start/camera", function(req,res){
	
	logger.info("Route: /start/camera:");

	var timeStamp_start = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
	logger.info("========= Start camera api start =====",timeStamp_start);
	// logger.info("Parameters : req.params: " + JSON.stringify(req.params));
	// Connect camera post call -- to know camera is on or not
	rest.post(config.platform.api, {
	data: { "cam_id": mainHelper.randomToken(),
			"name" : "image.jpg",
			"user_id": 10,
			"src":req.body.source,
			"port" : 80,
			"protocol" : "RTSP",
			"interface": "onvif",
			"algos" : '["THEMES"]',
			"callback_url" : config.url+"/callback"
		},
	}).on('complete', function(response) {
		var timeStamp_response = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
		logger.info("========= Start camera api end =====",timeStamp_response);
		res.send({
			'status' : 'success',
			'message' : 'camera started'
		});	
		// if(isJSON(response)) {
		// 	response = JSON.parse(response);
		// 	logger.info("camera start status::"+response.status);
		// 	if (response.status) {
		// 		// check if the camera is started
		// 		if(!camera_list[req.body.camera_id]){
		// 			var timeStamp_response = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
		// 			logger.info("========= Start camera api end =====",timeStamp_response);
		// 			// create camera instance if it's not started
		// 			var cam = new lookup.table.camera(req.body.camera_id);
		// 			camera_list[cam.camera_id] = cam;
		// 		}else {
		// 			logger.info("********************Camera instances created***********************");
		// 		}
		// 	} else {
		// 		res.send({
		// 			'status' : 'error',
		// 			'message' : 'platform-camera api server error'
		// 		});	
		// 	}
		// }else {
		// 	res.send({
		// 		'status' : 'error',
		// 		'message' : 'platform-camera api server error'
		// 	});	
		// }
	});
});

// create a queue object for frame 
var q = async.queue(function(task, callback) {
	if(typeof task.response != 'undefined'){
		var res = JSON.parse(task.response.result);
		logger.info("res::"+JSON.stringify(res));
		
		// If true retun the json file link
		logger.info("complete flag::",task.response.completed);
		if(task.response.completed.toString() == 'True') {
			logger.info("when video processing done");
			var timeStampUI = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
			logger.info("========= Timestamp after display the json to UI =====",timeStampUI);
			socket.emit("msg", { msg: res["THEMES"] });
		} 
		logger.info("== Create: Creating a queue object for frame")
	}
	// callback after competing the task
	callback();
});

// create queue object for notification

// assign a callback
q.drain = function() {
	logger.info('== Sending frame: Have been processed to display');
	logger.info("== End Frame Emit: Frame results sent to client");
	logger.info("------------------------------------------------------------");
};

app.post("/callback", function(req,res){

	logger.info("============================================================");
	logger.info("callback response data::",req.body.result);
	socket.emit("msg", { msg: req.body.result });
	var timeStamp_callback = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
	logger.info("========= timeStamp_callback request =====",timeStamp_callback);
	logger.info("== Start: Frame results from platofm camera api | Camera name:", req.body.cam_name +':'+ req.body.cam_id);
	// queue task assigner
	// add item to the queue 
	// q.push({response: req.body}, function(err) {
	// 	logger.info('== Queue Push Frames: push camera frames has been done');
	// });

	res.send("done");

});

/**
 * amqp lib
 */
app.post("/amqp/send", function(req,res){
	
	logger.info("Route: //amqp/send:");

	var timeStamp_start = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
	logger.info("========= Start camera api start =====",timeStamp_start);
	amqp.connect('amqp://'+config.amqp.user+':'+config.amqp.password+'@'+config.amqp.host+':'+config.amqp.port, function(err, conn) {
		conn.createChannel(function(err, ch) {
			// for ( var rq=0 ; rq < 50 ; rq++ ) {
			var q = 'ondemand_image_url';
			var cam_id = mainHelper.randomToken();
			//var msg = req.body.source;
			var msg = { 
						"cam_id"		: cam_id,
						"name" 			: "",
						"user_id"		: req.body.user_id,
						"src"			: req.body.source,
						"port" 			: 80,
						"protocol" 		: "RTSP",
						"interface"		: "onvif",
						"algos" 		: '["THEMES"]',
						"media_type"	: "camera" 
					};
			
				ch.assertQueue(q, {durable: true});
				// Note: on Node 6 Buffer.from(msg) should be used
				ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
				logger.info(" =========== RMQ Server message sent ========== %s", msg);
			// }
		});
		// setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
});	

/**
 * redis poll for every 60 seconds
 */
const intervalRedisCall = setInterval(() => {
	redis_client.get("b4ff94db6a8b50fsffb748721asdfsdfc41cad2fsdfs", function (err, reply) {
		if (err) throw err;
		var result = JSON.parse(reply);
		var timeStamp_end = process.performance && process.performance.now && process.performance.timing && process.performance.timing.navigationStart ? process.performance.now() + process.performance.timing.navigationStart : Date.now();
		logger.info("========= Fetching result from redis =====",timeStamp_end);
	    logger.info("======= Redis server reponse =========",result['cam_id']);
	});
}, 1000);

//Invalid request URI or Invalid Method
app.get('/*', function(req, res, next) {
	res.json([ {
		status : "error",
		message : 'Invalid API request!'
	} ]);
});


module.exports = app;
