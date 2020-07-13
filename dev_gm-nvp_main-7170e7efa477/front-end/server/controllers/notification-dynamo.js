var notificationModel = require("../models/notification").notification,
    logger = require('../utility/logger');


/**
 * Create Notification
 *
 */
function createNotification(req, res, next){

  logger.info('Controller: executing createNotification() ');

  var notification = new notificationModel(req.body);

  notification.save(function (err, result) {
    if (err){
      logger.error("Error createNotification: ",err);
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

  var notification = new notificationModel(req.body);

  notification.findByIdAndUpdate(function (err, result) {
    if (err){
      logger.error("Error findByIdAndUpdate: ",err);
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

  logger.info('Controller: executing getNotifications() ');

  var notification = new notificationModel(req.params);
  
  notification.getNotifications(function(error, notification) {
    if(error){
      logger.error("Error getNotifications : ",error);
      next(error);
    }else{
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

  logger.info('Controller: executing getLatestNotifications() ');

  var notification = new notificationModel(req.body);

  notification.getLatestNotifications(function(error, notification) {
    if(error){
      logger.error("Error getLatestNotifications: ",error);
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
  });
}

/**
 * Get Camera Notification
 *
 */
function getCameraNotifications(req, res, next){
  
  logger.info('Controller: executing getCameraNotifications() ');
  
  var notification = new notificationModel(req.params);
  
  notification.getCameraNotifications(
    function(error, notifications) {
      if(error){
        console.log("Error getCameraNotifications: ",error);
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
  });
}

/**
 * Get Notification Count
 *
 */
function getNotificationCount(req, res, next){
  
  logger.info('Controller: executing getNotificationCount() ');
  
  var notification = new notificationModel(req.params);
  
  notification.getNotificationCount(function(error, count){
    if(error){
      logger.error("Error getNotificationCount: ",error);
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

  logger.info('Controller: executing getActionNotificationCount() ');
  
  var notification = new notificationModel(req.params);

  notification.getActionNotificationCount(function(error, count){
      if(error){
        logger.error("Controller: Error getActionNotificationCount: ",error);
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

  logger.info('Controller: executing getActionNotificationCount() ');
  
  var notification = new notificationModel(req.params);

  notification.remove(function(error, notifications) {
      if(error){
        console.log("Error removeCamNotifications: ",error);
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
