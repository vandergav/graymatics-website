var configNotificationModel = require("../models/configNotification.js"),
    logger = require('../utility/logger');

/**
 * Create Contact
 *
 */
function createConfigNotification(req, res, next){

    logger.info('Controller: executing createConfigNotification() ');

   // var user_list = new configNotificationModel(req.body);

    var config_nfn = new configNotificationModel({
        user_id:22,
        configuration: [
            { feature: 'A', display_on_tab : [{tab:'aa',color:[{green:false},{yellow:false},{red:false}]},{tab:'ab',color:[{green:false},{yellow:false},{red:false}]}] }, 
            { feature: 'B', display_on_tab : [{tab:'bb',color:[{green:false},{yellow:false},{red:false}]},{tab:'bc',color:[{green:false},{yellow:false},{red:false}]}] }
        ]
    });
    config_nfn.save(function (err, result) {
        if (err){
            logger.error("Error : ",err);
            next(err);
        }else{
        res.send({
            'status' : 'success',
            'message' : 'Configuration created successfully ',
            'data' : result
        });
        }
    });
}

/**
 * Get Config Notification
 *
 */
function getConfigNotification(req, res, next){
    configNotificationModel.find({user_id: req.params.user_id},function(error, result) {
    if(error){
      logger.error("Error : ",error);
      next(error);
    }else{
      logger.info("config get :: ",result);

      if(result){
        res.send({
            'status' : 'success',
            'data' : result
        });
      }else{
          res.send({
              'status' : 'success',
              'message' : 'No Config Found',
              'data' : []
          });
      }
    }
  });
}

/**
 * Update Config Notification
 *
 */
function updateConfigNotification(req, res, next){

    logger.info('Controller: executing updateConfigNotification() ');

    configNotificationModel.findByIdAndUpdate(
        {_id:"598ac6c94dddcc7891b2a734"}, 
        {
            "$set":{
                "configuration.0.display_on_tab.0.color.0.green" : true
            } 
        },
        function(err, result) {
            if (err){
                logger.error("Error : ",err);
                next(err);
            }else{

                logger.info("config notification update :: ",result);

                res.send({
                    'status' : 'success',
                    'message' : 'Config notification updated successfully ',
                    'data' : result
                });
            }
        }
    );
}


module.exports = {
    createConfigNotification: createConfigNotification,
    getConfigNotification: getConfigNotification,
    updateConfigNotification: updateConfigNotification
};
