var videoModel = require("../models/video").video,
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
function createVideo(req, res, next){

    logger.info('Controller: executing createVideo() ');

    var video = new videoModel(req.body);

    video.save(function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'video added successfully ',
            'video' : result
        });
      }
    });
}

/**
 * Update Camera
 *
 */
function updateVideo(req, res, next){

    logger.info('Controller: executing updateVideo() ');

    var video = new videoModel(req.body);

    video.update(function(err, results) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'video updated successfully ',
            'data' : results
        });
      }
    });
}

/**
 * Get Camera
 *
 */
function getVideoDetails(req, res, next){

    logger.info('Controller: executing getVideo() ');

    var video = new videoModel(req.body);

    video.getVideoDetails(req.params.video_id,function(error, videos) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{

      logger.info("Controller: video list response :: " + videos);

      if(videos){
        res.send({
            'status' : 'success',
            'data' : videos
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No video List Found',
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
function listVideos(req, res, next){

    logger.info('Controller: executing listVideos() ');

    var video = new videoModel(req.body);

    video.getUserVideos(req.query.user_id,function(error, videos) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{
      if(videos){
        res.send({
            'status' : 'success',
            'data' : videos
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No video List Found',
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
function startVideo(req, res, next){

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
    platform.start_video(config.platform.api,function(result) {
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
function stopVideo(req, res, next){

    logger.info('Controller: executing stopCamera() ');
    
    platform.stop_video(config.platform.api,function(result) {
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
function deleteVideo(req, res, next){

    logger.info('Controller: executing deleteCamera() ');
    
    var video = new videoModel(req.body);

    video.remove(req.params.video_id, function(error, result){
      if(error){
        res.send({
            'status' : 'error',
            'message' : 'FAILED TO REMOVE video'
        });
      }else{
        res.send({
            'status' : 'success',
            'message' : 'video REMOVED SUCCESSFULLY'
        });
      }
    });
}

module.exports = {
    createVideo: createVideo,
    updateVideo: updateVideo,
    listVideos: listVideos,
    getFrame: getFrame,
    getVideoDetails: getVideoDetails,
    startVideo: startVideo,
    stopVideo: stopVideo,
    deleteVideo: deleteVideo
};
