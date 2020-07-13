module.exports = function(app) {

	//contact routes
	//var contact = require('./contact');
	//app.post('/contact', contact);
	//app.get('/contact', contact);
	//app.put('/contact', contact);
	//app.delete('/contact/:contact_id', contact);

	//user routes
	var user = require('./user');
	//app.post('/client/login', user);
	app.get('/user/list/:parent', user);
	app.get('/user/:user_type', user);
	app.post('/user/login', user);
	app.post('/user', user);
	app.post('/user/forgot', user);
	app.post('/user/add_user', user);
	app.post('/user/reset', user);
	app.put('/user', user);
	app.delete('/user/:user_id', user);
		
	//camera routes
	var camera = require('./camera');
	app.post('/camera', camera);
	app.get('/camera', camera);
	app.get('/camera/get/:camera_id', camera);
	app.get('/camera/frame_extract', camera);
	app.get('/camera/start', camera);
	app.get('/camera/stop', camera);
	app.put('/camera', camera);
	app.delete('/camera/:camera_id', camera);

	//video routes
	var video = require('./video');
	app.post('/video', video);
	app.get('/video', video);
	app.get('/video/get/:video_id', video);
	app.get('/video/frame_extract', video);
	app.get('/video/start', video);
	app.get('/video/stop', video);
	app.put('/video', video);
	app.delete('/video/:video_id', video);

	//notification routes
	var notification = require('./notification');
	app.post('/notification', notification);
	app.put('/notification', notification);
	app.get('/notification/latest/:user_id/:media_type', notification);
	app.get('/notification/count/:type', notification);
	app.get('/notification/action/count/:type', notification);
	app.get('/camera/notifications/:user_id/:camera_id/:media_type', notification);
	app.get('/notification/:scene_id/:media_type', notification);
	app.get('/search/:user_id/:pageno/:keyword/:media_type', notification);
	app.get('/search_total_count/:user_id/:pageno/:keyword/:media_type', notification);
	app.get('/search_filter/:user_id/:camera_name/:time/:pageno/:media_type', notification);
	app.get('/search_filter_total_count/:user_id/:camera_name/:time/:media_type', notification);
	app.delete('/camera/notifications/:camera_id', notification);

	// var file_uploader = require('./file_uploader');
	// app.post('/upload', file_uploader);

	// basic notification routes
	var basic_notification = require('./basic_notification');
	app.post('/basic_notification', basic_notification);
	app.put('/basic_notification', basic_notification);
	app.get('/basic_notification/count/:user_id/:type/:media_type', basic_notification);
	app.get('/basic_notification/action/count/:user_id/:type/:media_type', basic_notification);
	

	// action routes
	var action = require('./action');
	app.post('/action/share_list', action);
	app.get('/action/share_list/:in', action);

	app.post('/action/assign_list', action);
	app.get('/action/assign_list/:in', action);

	app.post('/action/escalation_list', action);
	app.get('/action/escalation_list/:in', action);

	//event routes
	var event = require('./event');
	app.post('/event', event);
	app.get('/event', event);

	//feedback api
	var feedback = require('./feedback');
	app.post('/feedback', feedback);
	app.get('/feedback', feedback);

	//face_recognition api
	var face_recognition = require('./face_recognition');
	app.get('/face_recognition/:user_id/:_id', face_recognition);
	app.get('/face_list/:user_id', face_recognition);
	app.post('/face_recognition', face_recognition);
	app.put('/face_recognition', face_recognition);

	//user_list routes
	var user_list = require('./user_list');
	app.post('/user_list', user_list);
	app.put('/user_list', user_list);
	app.get('/user_list', user_list);
	app.delete('/user_list/:_id', user_list);

	//user_list routes
	var alert_user = require('./alert_user');
	app.post('/alert_user', alert_user);
	app.put('/alert_user', alert_user);
	app.get('/alert_user', alert_user);
	app.delete('/alert_user/:_id', alert_user);

	//configuration notification
	var configuration = require('./configuration');
	app.post('/configuration/notification', configuration);
	app.put('/configuration/notification', configuration);
	app.get('/configuration/notification/:user_id', configuration);

	// reports 
	var reports = require('./reports');
	app.get('/reports/summary/:user_id', reports);
	app.get('/reports/vehicle/:user_id', reports);
	app.get('/reports/notifications/:user_id', reports);
	app.get('/reports/face/:user_id', reports);
};
