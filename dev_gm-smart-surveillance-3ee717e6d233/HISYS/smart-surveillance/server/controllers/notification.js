var notificationModel = require("../models/notification.js"),
    logger = require('../utility/logger');


/**
 * Create Notification
 *
 */
function createNotification(req, res, next){

    logger.info('Controller: executing createNotification() ', req.body.result);

    var notification = new notificationModel(req.body);
    // req.body.result = JSON.parse(req.body.result);
    notification.save(req.body, function (err, result) {
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
    });
}

/**
 * Update Notification
 *
 */
function updateNotification(req, res, next){

    logger.info('Controller: executing updateNotification() ');

    //var notification = new notificationModel(req.body);

    notificationModel.findByIdAndUpdate(req.body._id, req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'notification update successfully ',
            'notification' : result
        });
      }
    });
}


/**
 * Get Notification
 *
 */
function getNotifications(req, res, next){
    notificationModel.find({scene_id: req.params.scene_id},function(error, notification) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{

      //logger.info("notification get :: ",notification);

      if(notification){
        res.send({
            'status' : 'success',
            'data' : notification
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No notification Found',
              'data' : []
          });
      }
    }
  });
}

/**
 * Get Latest Notification
 *
 */
function getLatestNotifications(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({start_time: {$gte: today}},function(error, notification) {
    if(error){
      logger.error("Error : ",error);
      next(error);
    }else{
      //logger.info("notification list :: ",notification);
      if(notification){
        res.send({
            'status' : 'success',
            'data' : notification
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No notification List Found',
              'data' : []
          });
      }
    }
  }).sort({start_time:-1});
}

/**
 * Get Camera Notification
 *
 */
function getCameraNotifications(req, res, next){
  notificationModel.find({
    user_id:req.params.user_id,
    camera_id: req.params.camera_id},
    function(error, notifications) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(notifications){
          res.send({
              'status' : 'success',
              'data' : notifications
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No notification List Found',
                'data' : []
            });
        }
      }
  }).sort({start_time:-1});
}

/**
 * Get Notification Count
 *
 */
function getNotificationCount(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({start_time: {$gte: today},type:req.params.type}).count(function(error, count){
      if(error){
        logger.error("Error : ",error);
        next(error);
      }else{
        if(count){
          res.send({
              'status' : 'success',
              'count' : count
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No notification List Found',
                'data' : []
            });
        }
      }
    });
}

function getActionNotificationCount(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({start_time: {$gte: today},status:"complete",type:req.params.type}).count(function(error, count){
      if(error){
        logger.error("Error : ",error);
        next(error);
      }else{
        if(typeof count != 'undefined'){
          res.send({
              'status' : 'success',
              'count' : count
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No action notification count',
                'data' : []
            });
        }
      }
    });
}

/**
 * Remove Camera Notification
 *
 */
function removeCamNotifications(req, res, next){

  logger.info("Model: /camera/notification/remove:");
  logger.info("Camera Id"+req.params.camera_id);
  
  notificationModel.remove({camera_id: req.params.camera_id},
    function(error, notifications) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(notifications){
          res.send({
              'status' : 'success',
              'data' : "notifications removed successfully"
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No notification List Found',
                'data' : []
            });
        }
      }
  });
}

module.exports = {
    createNotification: createNotification,
    updateNotification: updateNotification,
    getNotifications: getNotifications,
    getCameraNotifications: getCameraNotifications,
    getNotificationCount: getNotificationCount,
    getActionNotificationCount: getActionNotificationCount,
    getLatestNotifications: getLatestNotifications,
    removeCamNotifications: removeCamNotifications
};
