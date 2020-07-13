var notificationModel = require("../models/basic_notification"),
logger = require('../utility/logger');


/**
* Create Notification
*
*/
function createNotification(req, res, next){

    logger.info('Controller: basic_notification executing createNotification() ');

    var notification = new notificationModel(req.body);

    notification.save(req.body,function (err, result) {
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

    logger.info('Controller: basic_notification executing updateNotification() ');

    notificationModel.findByIdAndUpdate(req.body._id, req.body, function (err, result) {
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
* Get Notification Count
*
*/
function getNotificationCount(req, res, next){

    logger.info('Controller: basic_notification executing getNotificationCount() ');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    notificationModel.find({
            user_id     : req.params.user_id,
            type        : req.params.type,
            media_type  : req.params.media_type, 
            start_time  : {$gte: today},
        }).count(function(error, count){
            if(error){
              logger.error("Error : ",error);
              next(error);
            }else{
              if(count){
                res.send({
                    'status'    : 'success',
                    'count'     : count
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

    logger.info('Controller: basic_notification executing getActionNotificationCount() ');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    notificationModel.find({
            user_id     : req.params.user_id,
            type        : req.params.type,
            media_type  : req.params.media_type, 
            status      : 'complete',
            start_time  : {$gte: today},
        }).count(function(error, count){
            if(error){
              logger.error("Error : ",error);
              next(error);
            }else{
              if(count){
                res.send({
                    'status'    : 'success',
                    'count'     : count
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
    getNotificationCount: getNotificationCount,
    getActionNotificationCount: getActionNotificationCount,
};
