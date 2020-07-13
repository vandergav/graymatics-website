var notificationModel = require("../models/basic_notification").basic_notification,
logger = require('../utility/logger');


/**
* Create Notification
*
*/
function createNotification(req, res, next){

    logger.info('Controller: basic_notification executing createNotification() ');

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

    logger.info('Controller: basic_notification executing updateNotification() ');

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
* Get Notification Count
*
*/
function getNotificationCount(req, res, next){

    logger.info('Controller: basic_notification executing getNotificationCount() ');

    var notification = new notificationModel(req.params);

    notification.getNotificationCount(function(error, result){
        if(error){
            logger.error("Error getNotificationCount: ",error);
            next(error);
        }else{
                if(result[0].count != 'undefined'){
                    res.send({
                        'status' : 'success',
                        'count' : result[0].count
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

    var notification = new notificationModel(req.params);

    notification.getActionNotificationCount(function(error, result){
        if(error){
            logger.error("Controller: Error getActionNotificationCount: ",error);
            next(error);
        }else{
            if(result[0].count != 'undefined'){
                res.send({
                    'status' : 'success',
                    'count' : result[0].count
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


module.exports = {
    createNotification: createNotification,
    updateNotification: updateNotification,
    getNotificationCount: getNotificationCount,
    getActionNotificationCount: getActionNotificationCount,
};
