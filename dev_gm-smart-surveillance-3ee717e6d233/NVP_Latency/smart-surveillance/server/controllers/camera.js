var cameraModel = require("../models/camera").camera,
    notificationModel = require("../models/notification.js"),
    logger = require('../utility/logger'),
    listen = require('../server.js'),
    socketio = require('socket.io'),
    config = require('../config.js'),
    nfn = require('../utility/notificationPoll'),
    platform = require("../utility/platform.js");

/**
 * Create Camera
 *
 */
function createCamera(req, res, next){

    logger.info('Controller: executing createCamera() ');

    var camera = new cameraModel(req.body);

    camera.save(function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'camera added successfully ',
            'camera' : result
        });
      }
    });
}

/**
 * Update Camera
 *
 */
function updateCamera(req, res, next){

    logger.info('Controller: executing updateCamera() ');

    var camera = new cameraModel(req.body);

    camera.update(function(err, results) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'camera updated successfully ',
            'data' : results
        });
      }
    });
}

/**
 * Get Camera
 *
 */
function getCameraDetails(req, res, next){

    logger.info('Controller: executing getCamera() ');

    var camera = new cameraModel(req.body);

    camera.getCameraDetails(req.params.camera_id,function(error, cameras) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{

      logger.info("Controller: camera list response :: " );

      if(cameras){
        res.send({
            'status' : 'success',
            'data' : cameras
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No camera List Found',
              'data' : []
          });
      }
    }
  });
}

/**
 * List Camera
 *
 */
function listCameras(req, res, next){

    logger.info('Controller: executing listCameras() ');

    var camera = new cameraModel(req.body);

    camera.getUserCameras(req.query.user_id,function(error, cameras) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{

      if(cameras){
        res.send({
            'status' : 'success',
            'data' : cameras
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No camera List Found',
              'data' : []
          });
      }
    }
  });
}

/**
 * List Camera
 *
 */
function getFrame(req, res, next){

    logger.info('Controller: executing getFrame() ');

    platform.frame_selector(config.platform.api,function(result) {
      res.send({
        status: "ok",
        message: "Results processed from graymatics api.",
        rec: result
      });
    })
}

/**
 * Start Camera
 *
 */
function startCamera(req, res, next){

    logger.info('Controller: executing startCamera() ');
    //var socket = io.listen(listen);
    var msgArr = ['Meeting Room','Entrance','4th Floor','2nd Gate','Rest Room','up stairs'];
    setInterval(function(){
        //sending notification to the client
        var rand = msgArr[Math.floor(Math.random() * msgArr.length)];
        console.log("Message sending is::"+rand);
        socketio.listen(listen).on('connection', function (socket) {
        socket.on('msg', function (msg) {
                console.log('Message Received: ', msg);
                socket.broadcast.emit('message', msg);
        });
        socket.emit('msg', { msg: rand });
        });
        
    }, 10000);
    // nfn.poll(function(result){
    //   //sending notification to the client
    //   io.on('connection', function(socket){
    //     console.log("Client Connected");
    //     socket.emit('msg', { msg: 'Hello Client' });
    //       socket.on('msg', function(msg){
    //         console.log(msg);
    //       });
    //   });

    //   var notification = new notificationModel(result);
    //   notification.save(result, function (err, result) {
    //     if (err){
    //       logger.log("Error : ",err);
    //       next(err);
    //     }else{
    //       logger.info("notification created.");
    //     }
    //   })
    // });
    res.send({
        'status' : 'success',
        'message' : 'Camera stated'
    });
    /*
    platform.start_camera(config.platform.api,function(result) {
      var notification = new notificationModel(result);
      notification.save(result, function (err, result) {
        if (err){
          console.log("Error : ",err);
          next(err);
        }else{
          res.send({
              'status' : 'success',
              'message' : 'notification created successfully ',
              'notification' : result
          });
        }
      })
    })*/
}

/**
 * Stop Camera
 *
 */
function stopCamera(req, res, next){

    logger.info('Controller: executing stopCamera() ');
    
    platform.stop_camera(config.platform.api,function(result) {
      res.send({
        status: "ok",
        message: "Results processed from graymatics api.",
        rec: result
      });
    })
}
/**
 * Delete Camera
 *
 */
function deleteCamera(req, res, next){

    logger.info('Controller: executing deleteCamera() ');
    
    var camera = new cameraModel(req.body);

    camera.remove(req.params.camera_id, function(error, result){
      if(error){
        res.send({
            'status' : 'error',
            'message' : 'FAILED TO REMOVE camera'
        });
      }else{
        res.send({
            'status' : 'success',
            'message' : 'camera REMOVED SUCCESSFULLY'
        });
      }
    });
}

module.exports = {
    createCamera: createCamera,
    updateCamera: updateCamera,
    listCameras: listCameras,
    getFrame: getFrame,
    getCameraDetails: getCameraDetails,
    startCamera: startCamera,
    stopCamera: stopCamera,
    deleteCamera: deleteCamera
};
