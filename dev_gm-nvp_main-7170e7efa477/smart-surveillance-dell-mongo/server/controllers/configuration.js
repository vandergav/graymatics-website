var configNotificationModel = require("../models/configNotification.js"),
    logger = require('../utility/logger'),
    mainHelper = require("../helpers/MainHelper");

/**
* Create Contact
*
*/
function createConfigNotification(req, res, next){

    logger.info('Controller: executing createConfigNotification() ');

    req.body._id = mainHelper.randomToken();
    var config_nfn = new configNotificationModel(req.body);

    config_nfn.save(function (err, result) {
        if (err){
            logger.error("Error : ",err);
            next(err);
        }else{
            res.send({
                'status'    : 'success',
                'message'   : 'Config_notification created successfully ',
                'data'      : result
            });
        }
    });
}

/**
* Get Config Notification
*
*/
function getConfigNotification(req, res, next){

    logger.info('Controller: executing getConfigNotification() ');

    configNotificationModel.find({user_id: req.params.user_id},function(error, result) {
        if(error){
            logger.error("Error : ",error);
            next(error);
        }else{
            if(result){
                res.send({
                    'status'    : 'success',
                    'data'      : result
                });
            }else{
                res.send({
                    'status'    : 'success',
                    'message'   : 'No Config Found',
                    'data'      : []
                });
            }
        }
    });
}

/**
* Update Config Notification
*
*/
function updateConfigNotification(req, res, next) {

    logger.info('Controller: executing updateConfigNotification() ');

    configNotificationModel.findByIdAndUpdate(
        req.body._id, req.body,
        function(err, result) {
            if (err){
                logger.error("Error : ",err);
                next(err);
            }else{
                // logger.info("config notification updated :: ",result);
                res.send({
                    'status'    : 'success',
                    'message'   : 'Config notification updated successfully ',
                    'data'      : result
                });
            }
        }
    );
}
/**
 * Remove config Notification
 *
 */
function removeConfigNotification(req, res, next){
    
    logger.info("Controller: /configuration/notification/remove:");
    
    configNotificationModel.remove({_id: req.params._id},
        function(error, notifications) {
            if(error){
                logger.error("Error : ",error);
                next(error);
            }else{
                if(notifications){
                    res.send({
                        'status'    : 'success',
                        'data'      : "config notifications removed successfully"
                    });
                }else{
                    res.send({
                        'status'    : 'success',
                        'message'   : 'No notification List Found',
                        'data'      : []
                    });
                }
            }
        }
    );
}

module.exports = {
    createConfigNotification    : createConfigNotification,
    getConfigNotification       : getConfigNotification,
    updateConfigNotification    : updateConfigNotification,
    removeConfigNotification    : removeConfigNotification
};
