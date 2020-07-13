var eventModel = require("../models/event.js"),
    logger = require('../utility/logger');


/**
 * Create Event
 *
 */
function createEvent(req, res, next){

    logger.info('Controller: executing createEvent() ');

    var event = new eventModel(req.body);

    event.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'Event created successfully ',
            'event' : result
        });
      }
    });
}


/**
 * Get Event
 *
 */
function getEvent(req, res, next){

    logger.info('Controller: executing createEvent() ');
  
    var id = "590439a065cf03649d70491f";     

    eventModel.findOne({_id: id},function(error, event) {
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

/*function listNotifications(req, res, next){
    notificationModel.find(function(error, notification) {
    if(error){
      console.log("Error : ",error);
      next(error);
    }else{

      logger.info("notification list :: ",notification);

      if((notification != null) && (notification.length > 0)){
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
}*/

module.exports = {
    createEvent: createEvent,
    getEvent: getEvent
};
