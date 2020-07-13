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
var vehicle_white_list = ['KA19EQ1316','KA02TC6861','KA03DA9008','KA04AB1234','KA01BC4567',];
var vehicle_black_list = ['KA02BD8005','KA04ZF0007',];
// defatult scene valeus
var thersh_hold_status_p = false;
var thersh_hold_status_v = false;
var plate_flag = true;
var intrusion_counter = 40;
var camera_list = {};
var app = express();
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var memcache = require("./lib/Memcache").mcClient;

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

app.post("/start/camera", function(req,res){
	
	logger.info("Route: /start/camera:",req.body);
	// logger.info("Parameters : req.params: " + JSON.stringify(req.params));
	// Connect camera post call -- to know camera is on or not
	rest.post(config.platform.api, {
	data: { 
			"cam_id"		: req.body.camera_id,
			"name" 			: req.body.name,
			"user_id"		: req.body.user_id,
			"src"			: req.body.source,
			"port" 			: 80,
			"protocol" 		: req.body.protocol,
			"interface"		: req.body.interface,
			"algos" 		: req.body.algos,
			"media_type"	: req.body.media_type,
			"callback_url" 	: config.url+"/callback"
		},
	}).on('complete', function(response) {
		if(isJSON(response)) {
			response = JSON.parse(response);
			logger.info("camera start status::"+response.status);
			if (response.status) {
				// check if the camera is started
				if(!camera_list[req.body.camera_id]){
					// create camera instance if it's not started
					var cam = new lookup.table.camera(req.body.camera_id);
					camera_list[cam.camera_id] = cam;
				}else {
					logger.info("********************Camera instances created***********************");
				}
				// send default frame to the client
				socket.emit("msg", { msg: response });
				// start camera if the connection is successful -- put method
				rest.put(config.platform.api, {
				data: { 
						"cam_id"		: req.body.camera_id,
						"roi"			: req.body.roi,
						"user_id"		: req.body.user_id,
						"callback_url" 	: config.url+"/callback"
					},
				}).on('complete', function(response) {
					if(isJSON(response)) {
						response = JSON.parse(response);
						if (response.status) {
							res.send({
								'status' : 'success',
								'message' : 'camera started successfully '
							});	
						}else {
							res.send({
								'status' : 'error',
								'message' : 'platform-camera api server error'
							});	
						}
					}else {
						res.send({
							'status' : 'error',
							'message' : 'platform-camera api server error'
						});	
					}
				});
			} else {
				res.send({
					'status' : 'error',
					'message' : 'platform-camera api server error'
				});	
			}
		}else {
			res.send({
				'status' : 'error',
				'message' : 'platform-camera api server error'
			});	
		}
	});
});
/**
 * Start frame to get the latest frame
 */
app.post("/start/frame", function(req,res){
	
	logger.info("Route: /start/frame:",req.body);
	/**
	 * Start camera api
	 */
	logger.info("algos",req.body.algo);
	rest.post(config.platform.api, {
	data: { "cam_id": req.body.camera_id,
			"name" : req.body.name,
			"user_id":req.body.user_id,
			"src":req.body.source,
			"port" : 80,
			"protocol" : req.body.protocol,
			"interface": req.body.interface,
			"media_type": req.body.media_type,
			"algos" : JSON.stringify(req.body.algo),
			"callback_url" : config.url+"/callback"
		},
	}).on('complete', function(response) {
		if(isJSON(response)) {
			response = JSON.parse(response);
			logger.info("camera start status::"+response.status);
			if (response.status) { 
				logger.info(response.status);
				// update frame in the camera table
				var keyPath = 'live-api/'+req.body.user_id+'/'+req.body.camera_id+'/frame/'+req.body.camera_id+'.jpg';
				s3.base64S3Upload(response.frame_src,keyPath, function(frame_url){
					logger.info("camera first frame url:"+frame_url);
					// store generated notifcation into mongodb 
					var putData =  { 
						"camera_id"	: req.body.camera_id,
						"frame" 	: frame_url,
					}
					// update first frame in camera/video table
					if ( req.body.media_type == 'camera' ) {
						rest.putJson(config.url+'/camera', putData ).on('complete', function(response) {
							logger.info("camera first frame updated succesfully.");
							res.send({
								'status' 	: 'success',
								'message' 	: 'camera first frame updated succesfully.',
								'frame'		: frame_url
							});	
						});
					} else if( req.body.media_type == 'video') {
						rest.putJson(config.url+'/video', putData ).on('complete', function(response) {
							logger.info("video first frame updated succesfully.");
							res.send({
								'status' 	: 'success',
								'message' 	: 'video first frame updated succesfully.',
								'frame'		: frame_url
							});	
						});
					}
					
				});
			} else {
				res.send({
					'status' : 'error',
					'message' : 'platform-camera api server error'
				});	
			}
		}else {
			res.send({
				'status' : 'error',
				'message' : 'platform-camera api server error'
			});	
		}
	});
});

/**
 * Start camera put for updating the ROI
 */
app.put("/start/camera", function(req,res){
	
	logger.info("Route:put /start/camera:", req.body);
	/**
	 * Update ROI in camera table
	 */
	var jsonData =  { 
		"cam_id": req.body.camera_id,
		"name" : req.body.name,
		"user_id":req.body.user_id,
		"src":req.body.source,
		// "port" : 80,
		// "protocol" : req.body.protocol,
		// "interface": req.body.interface,
		// "algos" : req.body.algos,
		"roi"	: req.body.roi 	
		// "callback_url" : config.url+"/callback"
	}
	rest.patchJson(config.platform.api, jsonData).on('complete', function(response) {
			response = JSON.parse(response);
			if(response.status == true) {
				logger.info(response.status);
				res.send({
					'status' 	: 'success',
					'message' 	: 'camera roi updated successfully.',
				})
			}
		});
});
// create a queue object for frame 
var q = async.queue(function(task, callback) {
	if(typeof task.response != 'undefined'){
		logger.info("frame queue status::"+task.response.status);
		task.response.notification_type = "";	
		task.response.notification_text = "";
		/**
		 * when video processing is done
		 */
		if(task.response.status == 'completed') {
			logger.info("when video processing done");
			// update the camera status
			var jsonData =  { 
				"camera_id": task.response.cam_id,
				"status" : "processed"
			}
			rest.putJson(config.url+'/video', jsonData ).on('complete', function(response) {
				logger.info("notification created succesfully.");
			});
		} 
		// send push notifications to the client
		socket.emit("msg", { msg: task.response });
		logger.info("== Create: Creating a queue object for frame")
	}
	// callback after competing the task
	callback();
});

// create queue object for notification
var q1 = async.queue(function(task, callback) {
	var res = JSON.parse(task.response.result);
	// logger.info("== Camera lookup table values: ", JSON.stringify(camera_list));
	// var test_result_json = task.response.result.replace(/\\/g, "");
	logger.info("task response media_type::",task.response.cam_id);
	logger.info("res::"+JSON.stringify(res));
	if( typeof task.response != 'undefined' &&
		typeof res != 'undefined' &&
		typeof res.PEOPLE_TRACKING != 'undefined'){
			var total = res.PEOPLE_TRACKING.total;
			var people_count = res.PEOPLE_TRACKING.count;
			logger.info("== Creating: a queue object for notification(PC)")
			logger.info("== people_counter::====="+ people_count);
			logger.info("== total::====="+ total);
			// notification generation 
			// Rules for person algo
			if(	typeof camera_list != 'undefined' &&  
				typeof camera_list[task.response.cam_id] != 'undefined' &&  
				camera_list[task.response.cam_id].total < total){
				// to validate for the same frame results
				camera_list[task.response.cam_id].total = total;
				thersh_hold_status_p = true;
				// thresh hold verification
				if(total >= camera_list[task.response.cam_id].counter*camera_list[task.response.cam_id].thresh_hold) {
					thersh_hold_status_p = false;
					camera_list[task.response.cam_id].counter++;
					/**
					 * Create notifications
					 */
					var notification_id = mainHelper.randomToken();
					task.response.notification_type = "People_Count";
					task.response.notification_text = total+" number of persons have been detected since "+dateHelper.timestamp_to_date_time(task.response.time_stamp);
					task.response.notification_id = notification_id;
					task.response.scene_id = camera_list[task.response.cam_id].scene_id;
					// var result_json = JSON.parse(task.response.result);
					// var result_json = task.response.result.replace(/\\/g, "");
					// send push notifications to the client
					socket.emit("msg", { msg: task.response });
					logger.info("== Create: Creating a queue object for notification(People Count)")
					
					// store notifcation in basic notification table
					rest.post(config.url+'/basic_notification', {
						data: { 
								"_id"		: notification_id,
								"user_id"	: task.response.user_id,
								"type" 		: task.response.notification_type,
								"media_type": task.response.media_type,
								"status" 	: "pending"
						},
					}).on('complete', function(response) {
						logger.info("basic notification created succesfully.");
					});

					//logger.info(JSON.stringify(result_json));
					/**
					 * Create notification with minio uploaded frame
					 */
					var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
					s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
						logger.info("s3 frame url:"+frame_url);
						// store generated notifcation into mongodb 
						var jsonData =  { 
							"_id"			: notification_id,
							"scene_id"		: task.response.scene_id,
							"user_id"		: task.response.user_id,
							"camera_id"		: task.response.cam_id,
							"camera_name"	: task.response.cam_name,
							"type" 			: task.response.notification_type,
							"media_type" 	: task.response.media_type,
							"timestamp"		: task.response.time_stamp,
							"message"		: task.response.notification_text,
							"frame_id" 		: task.response.frame_id,
							"frame" 		: frame_url,
							"result" 		: JSON.parse(task.response.result),
							"status" 		: "pending"
						}
						rest.postJson(config.url+'/notification', jsonData ).on('complete', function(response) {
							logger.info("notification created succesfully.");
							camera_list[task.response.cam_id].scene_id = mainHelper.randomToken();
						});
					});
				} 
				if(thersh_hold_status_p == true) {
					// Create notification 
					var notification_id = mainHelper.randomToken();
					task.response.notification_type = "Default";
					task.response.notification_text = total+" number of persons have been detected since "+dateHelper.timestamp_to_date_time(task.response.time_stamp);
					task.response.scene_id = camera_list[task.response.cam_id].scene_id;
					task.response.notification_id = notification_id;
					// var result_json = JSON.parse(task.response.result);
					// var result_json = task.response.result.replace(/\\/g, "");
					// logger.info(JSON.stringify(result_json));
					var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
					s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
						// store generated notifcation into mongodb 
						var jsonData =  { 
							"_id"			: notification_id,
							"scene_id"		: task.response.scene_id,
							"user_id"		: task.response.user_id,
							"camera_id"		: task.response.cam_id,
							"camera_name"	: task.response.cam_name,
							"type" 			: task.response.notification_type,
							"media_type" 	: task.response.media_type,
							"timestamp"		: task.response.time_stamp,
							"message"		: task.response.notification_text,
							"frame_id" 		: task.response.frame_id,
							"frame" 		: frame_url,
							"result" 		: JSON.parse(task.response.result),
							"status" 		: "pending"
						};
						rest.postJson(config.url+'/notification', jsonData).on('complete', function(response) {
							logger.info("notification created succesfully.");
						});
					});
				}
			}
	} 
	if( typeof task.response != 'undefined' &&
				typeof res != 'undefined' &&
				typeof res.VEHICLE_TRACKING != 'undefined'){
		var total = res.VEHICLE_TRACKING.total;
		var vehicle_counter = res.VEHICLE_TRACKING.count;
		var plate_number = res.VEHICLE_TRACKING.plate;
		logger.info("== Creating: a queue object for notification(VC)")
		logger.info("== vehicle_counter::====="+ vehicle_counter);
		logger.info("== plate_number::====="+ plate_number);
		logger.info("== total::====="+ total);
		// notification generation 
		// Rules for vehicle algo
		if(	typeof camera_list != 'undefined' &&  
			typeof camera_list[task.response.cam_id] != 'undefined' &&  
			camera_list[task.response.cam_id].total < total) {
			// to validate for the same frame results
			camera_list[task.response.cam_id].total = total;
			thersh_hold_status_v = true;
			// thresh hold verification
			if(total >= camera_list[task.response.cam_id].counter*camera_list[task.response.cam_id].thresh_hold){
				thersh_hold_status_v = false;
				//counter increment for threshold
				camera_list[task.response.cam_id].counter++;
				var notification_id = mainHelper.randomToken();
				task.response.notification_type = "Vehicle_Count";
				// set plate flag
				/*
				if(plate_number != " ") {
					plate_flag=true;
					task.response.notification_text = "Whitelist violation detected :"+plate_number+ "\n   "+total + " number of vehicles have been detected since " +dateHelper.timestamp_to_date_time(task.response.time_stamp);
				} else {
					task.response.notification_text = total + " number of vehicles have been detected since "+dateHelper.timestamp_to_date_time(task.response.time_stamp);
				}*/
				task.response.notification_text = total + " number of vehicles have been detected since "+dateHelper.timestamp_to_date_time(task.response.time_stamp);	
				task.response.scene_id = camera_list[task.response.cam_id].scene_id;
				task.response.notification_id = notification_id;
				// send push notifications to the client
				socket.emit("msg", { msg: task.response });
				logger.info("== Create: Creating a queue object for notification(Vehicle Count)")
				// store notifcation in basic notification table
				rest.post(config.url+'/basic_notification', {
					data: { 
						"_id"		: notification_id,
						"user_id"	: task.response.user_id,
						"type" 		: task.response.notification_type,
						"media_type": task.response.media_type,
						"status" 	: "pending"
					},
				}).on('complete', function(response) {
					logger.info("basic notification created succesfully.");
				});
				
				var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
				s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
					// store generated notifcation into mongodb 
					var jsonData = { 
						"_id"			: notification_id,
						"scene_id"		: task.response.scene_id,
						"user_id"		: task.response.user_id,
						"camera_id"		: task.response.cam_id,
						"camera_name"	: task.response.cam_name,
						"type" 			: task.response.notification_type,
						"media_type" 	: task.response.media_type,
						"timestamp"		: task.response.time_stamp,
						"message"		: task.response.notification_text,
						"frame_id" 		: task.response.frame_id,
						"frame" 		: frame_url,
						"result" 		: JSON.parse(task.response.result),
						"status" 		: "pending"
					};
					rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
						camera_list[task.response.cam_id].scene_id = mainHelper.randomToken();
						logger.info("notification created succesfully.");
					});
				});
			}
			if(thersh_hold_status_v == true) {
				var notification_id = mainHelper.randomToken();
				task.response.notification_type = "Default";
				task.response.notification_text = total + " number of vehicles have been detected since "+dateHelper.timestamp_to_date_time(task.response.time_stamp);
				task.response.scene_id = camera_list[task.response.cam_id].scene_id;
				task.response.notification_id = notification_id;
				// var result_json = JSON.parse(task.response.result);
				// var result_json = task.response.result.replace(/\\/g, "");
				// logger.info(JSON.stringify(result_json));
				var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
				s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
					// store generated notifcation into mongodb 
					var jsonData = { 
						"_id"			: notification_id,
						"scene_id"		: task.response.scene_id,
						"user_id"		: task.response.user_id,
						"camera_id"		: task.response.cam_id,
						"camera_name"	: task.response.cam_name,
						"type" 			: task.response.notification_type,
						"media_type" 	: task.response.media_type,
						"timestamp"		: task.response.time_stamp,
						"message"		: task.response.notification_text,
						"frame_id" 		: task.response.frame_id,
						"frame" 		: frame_url,
						"result" 		: JSON.parse(task.response.result),
						"status" 		: "pending"
					};
					rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
						logger.info("notification created succesfully.");
					});	
				});
			}
			// ANPR notification generation 
			if( plate_flag==true && 
				plate_number != "" &&
				vehicle_white_list.indexOf(plate_number) < -1 ){
				//update the plate flag
				plate_flag = true;	
				// new notifcation id
				var notification_id = mainHelper.randomToken();
				task.response.notification_type = "Vehicle_Count";
				task.response.notification_id = notification_id;
				task.response.notification_text = "Whitelist violation detected :"+plate_number;
				// send push notifications to the client
				socket.emit("msg", { msg: task.response });
				logger.info("== Create: Creating a queue object for notification(Vehicle Plate)");

				// store notifcation in basic notification table
				rest.post(config.url+'/basic_notification', {
					data: { 
						"_id"		: notification_id,
						"user_id"	: task.response.user_id,
						"type" 		: task.response.notification_type,
						"media_type": task.response.media_type,
						"status" 	: "pending"
					},
				}).on('complete', function(response) {
					logger.info("basic notification created succesfully.");
				});
				
				var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
				s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
					// store generated notifcation into mongodb 
					var jsonData = { 
						"_id"			: notification_id,
						"scene_id"		: task.response.scene_id,
						"user_id"		: task.response.user_id,
						"camera_id"		: task.response.cam_id,
						"camera_name"	: task.response.cam_name,
						"type" 			: task.response.notification_type,
						"media_type" 	: task.response.media_type,
						"timestamp"		: task.response.time_stamp,
						"message"		: task.response.notification_text,
						"frame_id" 		: task.response.frame_id,
						"frame" 		: frame_url,
						"result" 		: JSON.parse(task.response.result),
						"status" 		: "pending"
					};
					rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
						logger.info("notification created succesfully.");
					});
				});
			}// End if of ANPR
		}
	}
	// INTRUSION notification generation
	if( typeof task.response != 'undefined' &&
		typeof res != 'undefined' &&
		typeof res.Intrusion_Detector != 'undefined' &&
		res.Intrusion_Detector.intrusion == 'true' ){
		intrusion_counter++;
		// temperary counter
		if(intrusion_counter%40 == 0) {
			// new notifcation id
			var notification_id = mainHelper.randomToken();
			task.response.notification_type = "INTRUSION";
			task.response.notification_id = notification_id;
			task.response.notification_text = "Intrusion detected :"+res.Intrusion_Detector.object;
			// send push notifications to the client
			socket.emit("msg", { msg: task.response });
			logger.info("== Create: Creating a queue object for notification(Intrusion)");
			logger.info("== INTRSION Object::", res.Intrusion_Detector.object);
			// store notifcation in basic notification table
			rest.post(config.url+'/basic_notification', {
				data: { 
					"_id"		: notification_id,
					"user_id"	: task.response.user_id,
					"type" 		: task.response.notification_type,
					"media_type": task.response.media_type,
					"status" 	: "pending"
				},
			}).on('complete', function(response) {
				logger.info("basic notification created succesfully.");
			});
			
			var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
			s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
				// store generated notifcation into mongodb 
				var jsonData = { 
					"_id"			: notification_id,
					"scene_id"		: task.response.scene_id,
					"user_id"		: task.response.user_id,
					"camera_id"		: task.response.cam_id,
					"camera_name"	: task.response.cam_name,
					"type" 			: task.response.notification_type,
					"media_type" 	: task.response.media_type,
					"timestamp"		: task.response.time_stamp,
					"message"		: task.response.notification_text,
					"frame_id" 		: task.response.frame_id,
					"frame" 		: frame_url,
					"result" 		: JSON.parse(task.response.result),
					"status" 		: "pending"
				};
				rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
					logger.info("notification created succesfully.");
				});
			});
		}
	}// End if INTRUSION
	// INTRUSION notification generation
	if( typeof task.response != 'undefined' &&
		typeof res != 'undefined' &&
		typeof res.Intrusion_Detector != 'undefined' &&
		res.Intrusion_Detector.intrusion == 'true' ){
		intrusion_counter++;
		// temperary counter
		if(intrusion_counter%40 == 0) {
			// new notifcation id
			var notification_id = mainHelper.randomToken();
			task.response.notification_type = "INTRUSION";
			task.response.notification_id = notification_id;
			task.response.notification_text = "Intrusion detected :"+res.Intrusion_Detector.object;
			// send push notifications to the client
			socket.emit("msg", { msg: task.response });
			logger.info("== Create: Creating a queue object for notification(Intrusion)");
			logger.info("== INTRSION Object::", res.Intrusion_Detector.object);
			// store notifcation in basic notification table
			rest.post(config.url+'/basic_notification', {
				data: { 
					"_id"		: notification_id,
					"user_id"	: task.response.user_id,
					"type" 		: task.response.notification_type,
					"media_type": task.response.media_type,
					"status" 	: "pending"
				},
			}).on('complete', function(response) {
				logger.info("basic notification created succesfully.");
			});
			
			var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
			s3.base64S3Upload(task.response.frame_src,keyPath, function(frame_url){
				// store generated notifcation into mongodb 
				var jsonData = { 
					"_id"			: notification_id,
					"scene_id"		: task.response.scene_id,
					"user_id"		: task.response.user_id,
					"camera_id"		: task.response.cam_id,
					"camera_name"	: task.response.cam_name,
					"type" 			: task.response.notification_type,
					"media_type" 	: task.response.media_type,
					"timestamp"		: task.response.time_stamp,
					"message"		: task.response.notification_text,
					"frame_id" 		: task.response.frame_id,
					"frame" 		: frame_url,
					"result" 		: JSON.parse(task.response.result),
					"status" 		: "pending"
				};
				rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
					logger.info("notification created succesfully.");
				});
			});
		}
	}// End if INTRUSION

	// FACE notification generation
	if( typeof task.response != 'undefined' &&
		typeof res != 'undefined' &&
		typeof res.FACE_RECOGNTION != 'undefined'){
			var person_objects = "";
			// new notifcation id
			var notification_id = mainHelper.randomToken();
			task.response.notification_type = "Vehicle_Count";
			task.response.notification_id = notification_id;
			// if no object is identified return
			if(res.FACE_RECOGNTION.length > 0) {
				for(var f in res.FACE_RECOGNTION){
					person_objects += person_objects + "\n Peson detected." + res.FACE_RECOGNTION[f].gender + ", " + res.FACE_RECOGNTION[f].facegroup + ", " + res.FACE_RECOGNTION[f].emotion;
				}
			}else {
				return;
			}
			task.response.notification_text = person_objects;
			// send push notifications to the client
			socket.emit("msg", { msg: task.response });
			logger.info("== Create: Creating a queue object for notification(FACE)");
			logger.info("== FACE Object::", res.FACE_RECOGNTION);
			// store notifcation in basic notification table
			rest.post(config.url+'/basic_notification', {
				data: { 
					"_id"		: notification_id,
					"user_id"	: task.response.user_id,
					"type" 		: task.response.notification_type,
					"media_type": task.response.media_type,
					"status" 	: "pending"
				},
			}).on('complete', function(response) {
				logger.info("basic notification created succesfully.");
			});
			
			var keyPath = 'live-api/'+task.response.user_id+'/'+task.response.cam_id+'/'+notification_id+'.jpg';
			s3.base64S3Upload(task.response.frame_src,keyPath,function(frame_url){
				// store generated notifcation into mongodb 
				var jsonData = { 
					"_id"			: notification_id,
					"scene_id"		: task.response.scene_id,
					"user_id"		: task.response.user_id,
					"camera_id"		: task.response.cam_id,
					"camera_name"	: task.response.cam_name,
					"type" 			: task.response.notification_type,
					"media_type" 	: task.response.media_type,
					"timestamp"		: task.response.time_stamp,
					"message"		: task.response.notification_text,
					"frame_id" 		: task.response.frame_id,
					"frame" 		: frame_url,
					"result" 		: JSON.parse(task.response.result),
					"status" 		: "pending"
				};
				rest.postJson(config.url+'/notification',jsonData).on('complete', function(response) {
					logger.info("notification created succesfully.");
				});
			});
	}// End if FACE
	/**
	 * Face training status
	 */
	if( typeof task.response != 'undefined' &&
		typeof res != 'undefined' &&
		typeof res.FACE_TRAINING != 'undefined' ){
		// update face_subject status 
		var putData = { 
			"_id"		: res.FACE_TRAINING.face_id,
			"status" 	: "processed"
		};
		rest.putJson(config.url+'/face_recognition',putData).on('complete', function(response) {
			logger.info("training status updated succesfully.");
		});
	}

	// callback after competing the task
	callback();
});

// assign a callback
q.drain = function() {
	logger.info('== Sending frame: Have been processed to display');
	logger.info("== End Frame Emit: Frame results sent to client");
	logger.info("------------------------------------------------------------");
};

// assign a callback
q1.drain = function() {
	logger.info('== Sending notification: Have been processed to display');
	logger.info("== End Notification Emit: Notification created and sent to client");
	logger.info("============================================================");
};

app.post("/callback", function(req,res){
	logger.info("============================================================");
	// logger.info("== Start: Frame results from platofm camera api | Camera name:", req.body.cam_name +':'+ req.body.cam_id);
	logger.info("== Start: Frame results from platofm camera api | Camera name:");
	// queue task assigner
	// add item to the queue 
	q.push({response: req.body}, function(err) {
		logger.info('== Queue Push Frames: push camera frames has been done');
	});

	q1.push({response: req.body}, function(err) {
		logger.info('== Queue Push Notification: push notification has been done');
	});
	res.send("done");

});
/**
 * Face training api
 */
app.post("/face_training", function(req,res){
	
	logger.info("Route: /face_training:", req.body);
	// logger.info("Parameters : req.params: " + JSON.stringify(req.params));
	// Connect camera post call -- to know camera is on or not
	// store generated notifcation into mongodb 
	var jsonData = { 
				"face_id"		: req.body.face_id,
				"subject_type" 	: req.body.subject_type,
				"name" 			: req.body.name,
				"age" 			: req.body.age,
				"gender" 		: req.body.gender,
				"ethnicity" 	: req.body.ethnicity,
				"source"		: req.body.source,
				"status"		: "pending",
				"interface"		: "training",
				"user_id"		: req.body.user_id,
				"callback_url" 	: config.url+"/callback"
			}
	rest.postJson(config.platform.face_api, jsonData)
	.on('complete', function(response) {
		if( response ) {
			response = JSON.parse(response);
			logger.info("face api status::"+response.status);
			if ( response.status == 'success' ) {
				// call put api to submit for the training
				rest.putJson( config.platform.face_api, jsonData ).on('complete', function(response) {
					logger.info("face training api sumitted succesfully.");
				});
				// uploda the first frame to s3 and update frame in db
				var keyPath = 'live-api/face/'+req.body.user_id+'/thumbnails/'+req.body.face_id+'.jpg';
				s3.base64S3Upload(response.frame,keyPath, function(frame_url){
					var putData = { 
						"_id": req.body.face_id,
						"frame" : frame_url
					};
					rest.putJson(config.url+'/face_recognition',putData).on('complete', function(response) {
						logger.info("face frame updated succesfully.");
						res.send({
							'status' : 'success',
							'message' : 'face frame updated succesfully.'
						});	
					});
				});
			} else {
				res.send({
					'status' : 'error',
					'message' : 'platform-face api server error'
				});	
			}
		}else {
			res.send({
				'status' : 'error',
				'message' : 'platform-face api server error'
			});	
		}
	});
});

/**
 * File upload
 */
var s3_upload = new AWS.S3({
	accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    region: config.s3.region,
    endpoint: config.s3.baseUrl ,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
});

var upload = multer({
    storage: multerS3({
        s3: s3_upload,
        bucket: config.s3.bucket,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, "live-api/face/22/webcam-videos/"+file.originalname+"_"+Date.now().toString()+".webm");
        }
    })
})

 /* Get todays notification count */

app.post('/upload', upload.array('file', 1), function(req, res, next) {
	logger.info("Route: /file/upload:");
	res.send({
        status:  "ok",
		message: "File is uploaded.",
		source: req.files[0].location
    })
});

//Invalid request URI or Invalid Method
app.get('/*', function(req, res, next) {
	res.json([ {
		status : "error",
		message : 'Invalid API request!'
	} ]);
});


module.exports = app;
