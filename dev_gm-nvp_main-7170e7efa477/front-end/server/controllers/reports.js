var notificationModel = require("../models/notification.js"),
logger = require('../utility/logger');


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
function getSummary(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // notificationModel.find({user_id:req.params.user_id,start_time: {$gte:today},type : {$ne : "Default"}},function(error, notification) {
        notificationModel.find({user_id:req.params.user_id,type : {$ne : "Default"}},function(error, notification) {
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
function getFace(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // notificationModel.find({user_id:req.params.user_id,start_time: {$gte:today},type:"Vehicle_Count","result.Face_Worker":{$ne:""}},function(error, notification) {
        notificationModel.find({user_id:req.params.user_id,type:"Vehicle_Count","result.Face_Worker":{$ne:""}},function(error, notification) {
        if(error){
            logger.error("Error : ",error);
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
function getNotifications(req, res, next){
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// notificationModel.find({user_id:req.params.user_id,start_time: {$gte: today},type:req.params.type}).count(function(error, count){
    notificationModel.find({user_id:req.params.user_id,type:req.params.type}).count(function(error, count){
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

function getVehicle(req, res, next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // notificationModel.find({user_id:req.params.user_id,start_time: {$gte:today},type:"Vehicle_Count","result.VEHICLE_TRACKING.plate":{$ne:""}},function(error, notification) {
        notificationModel.find({user_id:req.params.user_id,type:"Vehicle_Count","result.VEHICLE_TRACKING.plate":{$ne:""}},function(error, notification) {
        if(error){
            logger.error("Error : ",error);
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
                    'message' : 'No notification List Found',
                    'data' : []
                });
            }
        }
    }).sort({start_time:-1});
}

module.exports = {
    getSummary: getSummary,
    getVehicle: getVehicle,
    getNotifications: getNotifications,
    getFace: getFace
};
