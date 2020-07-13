var cameraModel = require("../models/camera"),
    notificationModel = require("../models/notification.js"),
    logger = require('../utility/logger'),
    listen = require('../server.js'),
    socketio = require('socket.io'),
    config = require('../config.js'),
    platform = require("../utility/platform.js"),
    mainHelper = require("../helpers/MainHelper");

/**
 * Create Camera
 *
 */
function createCamera(req, res, next){

    logger.info('Controller: executing createCamera() ');

    req.body.interface = 'onvif';
    req.body.protocol = 'RTSP';

    var camera = new cameraModel(req.body);

    camera.save(req.body,function (err, result) {
      if (err){
        logger.error("Error : ",err);
        next(err);
      }else{
        res.send({
            'status'  : 'success',
            'message' : 'camera added successfully ',
            'camera'  : result
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
    
    logger.info("Before update::",req.body);
    req.body = showCameraResult(req.body)
    logger.info("After update::",req.body);
    cameraModel.findByIdAndUpdate(req.body._id, req.body,
      function(err, results) {
        if (err){
          logger.error("Error : ",err);
          next(err);
        }else{
          res.send({
              'status'  : 'success',
              'message' : 'camera updated successfully ',
              'data'    : results
          });
        }
      }
    );
}

/**
 * Get Camera
 *
 */
function getCameraDetails(req, res, next){

    logger.info('Controller: executing getCamera() ');

    cameraModel.find(
      { _id : req.params.camera_id },
      function(error, cameras) {
        if(error){
          logger.error("Error : ",error);
          next(error);
        }else{
          logger.info("Controller: camera list response :: ");

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
      }
    );
}

/**
 * List Camera
 *
 */
function listCameras(req, res, next){

    logger.info('Controller: executing listCameras() ');

    cameraModel.find(
      { user_id  : req.params.user_id },
      function(error, cameras) {
        if(error){
          logger.error("Error : ",error);
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
      }
    );
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
        socketio.listen(listen).on('connection', function (socket) {
        socket.on('msg', function (msg) {
                logger.info('Message Received: ', msg);
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

    cameraModel.remove(
      { _id : req.params.camera_id }, 
      function(error, result){
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
      }
    );
}

/**
 * Delete fields
 * @param  {Object} result Camera info
 * @return {Object}
 */
function showCameraResult(result) {

  //result.algo.length > 0 ? result.aglo : delete result.algo
  typeof result.roi != 'undefined' && result.roi.length > 0 ? result.roi : delete result.roi
  delete result.interface
  delete result.protocol
  delete result.algo
  result.type == '' ? delete result.type : result.type
  result.fps == '' ? delete result.fps : result.fps
  result.status == '' ? delete result.status : result.status
  result.people_whitelist == '' ? delete result.people_whitelist : result.people_whitelist
  result.people_blacklist == '' ? delete result.people_blacklist : result.people_blacklist
  result.vehicle_whitelist == '' ? delete result.vehicle_whitelist : result.vehicle_whitelist
  result.vehicle_blacklist == '' ? delete result.vehicle_blacklist : result.vehicle_blacklist
  result.frame == '' ? delete result.status : result.frame
  result.source == '' ? delete result.source : result.source
  result.name == '' ? delete result.name : result.name
  result.user_id == '' ? delete result.user_id : result.user_id

  return result
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
