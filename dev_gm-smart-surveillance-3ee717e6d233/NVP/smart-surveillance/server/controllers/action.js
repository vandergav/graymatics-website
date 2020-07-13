var actionModel = require("../models/action.js"),
    userListModel = require("../models/user_list.js"),
    notificationModel = require("../models/notification.js"),
    logger = require('../utility/logger');


/**
 * Create Event
 *
 */
function addShareEvent(req, res, next) {

    logger.info('Controller: executing addShareEvent() ');

    var action = new actionModel(req.body);

    action.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        var data = {
          "type" : "Medium",
          "frame" : "http://picle/frame/ofjodfji.png",
          "result" : "reponse",
          "status" : "done",
        };
        // Update notification status based on color
        notificationModel.findByIdAndUpdate({_id:"5909b3f675344d339a1903c1"}, data , function(err, result) {
          if (err) {
            console.log("Error : ",err);
            next(err);
          } else {
            logger.info("notification updated successfully");
          }
        });
        res.send({
            'status' : 'success',
            'message' : 'Share event created successfully ',
            'data' : result
        });
      }
    });
}


/**
 * Get Event
 *
 */
function getShareEvent(req, res, next){

    logger.info('Controller: executing getShareEvent() ');
  
    logger.info(JSON.parse(req.params.in));
    var val = (req.params.in === "true");

    userListModel.find({share_list:val},function(error, event) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("event get :: ",event);

        if(event){
          res.send({
              'status' : 'success',
              'data' : event
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No event Found',
                'data' : []
            });
        }
      }
  });
}

/**
 * Create Event
 *
 */
function addAssignEvent(req, res, next){

    logger.info('Controller: executing addAssignEvent() ');

    var action = new actionModel(req.body);

    action.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        var data = {
          "type" : "Medium",
          "frame" : "http://picle/frame/ofjodfji.png",
          "result" : "reponse",
          "status" : "done",
        };
        // Update notification status based on color
        notificationModel.findByIdAndUpdate({_id:"5909b3f675344d339a1903c1"}, data , function(err, result) {
          if (err) {
            console.log("Error : ",err);
            next(err);
          } else {
            logger.info("notification updated successfully");
          }
        });
        res.send({
            'status' : 'success',
            'message' : 'Assign event created successfully ',
            'event' : result
        });
      }
    });
}


/**
 * Get Event
 *
 */
function getAssignEvent(req, res, next){

    logger.info('Controller: executing getAssignEvent() ');
  
    var val = (req.params.in === "true");

    userListModel.find({assign_list:val},function(error, event) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("event get :: ",event);

        if(event){
          res.send({
              'status' : 'success',
              'data' : event
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No event Found',
                'data' : []
            });
        }
      }
  });
}

/**
 * Create Event
 *
 */
function addEscalateEvent(req, res, next){

    logger.info('Controller: executing addEscalateEvent() ');

    var action = new actionModel(req.body);

    action.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        var data = {
          "type" : "Medium",
          "frame" : "http://picle/frame/ofjodfji.png",
          "result" : "reponse",
          "status" : "done",
        };
        // Update notification status based on color
        notificationModel.findByIdAndUpdate({_id:"5909b3f675344d339a1903c1"}, data , function(err, result) {
          if (err) {
            console.log("Error : ",err);
            next(err);
          } else {
            logger.info("notification updated successfully");
          }
        });
        res.send({
            'status' : 'success',
            'message' : 'Escalation event created successfully ',
            'event' : result
        });
      }
    });
}


/**
 * Get Event
 *
 */
function getEscalateEvent(req, res, next){

    logger.info('Controller: executing getEscalateEvent() ');
  
    var val = (req.params.in === "true");     

    userListModel.find({escalation_list:val},function(error, event) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("event get :: ",event);

        if(event){
          res.send({
              'status' : 'success',
              'data' : event
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No event Found',
                'data' : []
            });
        }
      }
  });
}

module.exports = {
    addShareEvent: addShareEvent,
    getShareEvent: getShareEvent,
    addAssignEvent: addAssignEvent,
    getAssignEvent: getAssignEvent,
    addEscalateEvent: addEscalateEvent,
    getEscalateEvent: getEscalateEvent
};
