var notificationModel = require("../models/notification.js"),
    logger = require('../utility/logger'),
    config = require('../config'),
    keywords_list = require('../utility/keywords.json');


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
        logger.error("Error : ",err);
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
        logger.error("Error : ",err);
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

    notificationModel.find({
        scene_id: req.params.scene_id,
        media_type  : req.params.media_type
    },function(error, notification) {
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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({
        // start_time  : {$gte: today}, 
        user_id     : req.params.user_id,
        media_type  : req.params.media_type
    },
    function(error, notification) {
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

    logger.info('Controller: executing getCameraNotifications() ');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({
        // start_time  : {$gte: today}, 
        user_id     : req.params.user_id,
        camera_id   : req.params.camera_id,
        media_type  : req.params.media_type
    },
    function(error, notifications) {
        if(error){
        logger.error("Error : ",error);
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

    logger.info('Controller: executing getNotificationCount() ');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({
        // start_time  : {$gte: today},
        type        : req.params.type,
        media_type  : req.params.media_type
    }).count(function(error, count){
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

    logger.info('Controller: executing getActionNotificationCount() ');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    notificationModel.find({
        // start_time  : {$gte: today},
        status      : "complete",
        type        : req.params.type,
        media_type  : req.params.media_type
    }).count(function(error, count){
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
 * get search results
 *
 */
function getSearchResults(req, res, next) {

    logger.info('Controller: executing getSearchResults() ');
    /**
     * pagination for the search results
     */
    var search_keyword;
    if(typeof keywords_list.keywords[req.params.keyword] != 'undefined') search_keyword = keywords_list.keywords[req.params.keyword];
    else search_keyword = req.params.keyword;
    // pageno 1 normal query
    notificationModel.find({ '$and':[{'$or':[
                {'camera_name'  :   {'$regex':search_keyword, '$options': 'i'}}, 
                {'type'         :   {'$regex':search_keyword, '$options': 'i'}}, 
                {'status'       :   {'$regex':search_keyword, '$options': 'i'}}, 
                {'message'      :   {'$regex':search_keyword, '$options': 'i'}}, 
                {'result'       :   {'$regex':search_keyword, '$options': 'i'}}]}, 
                {'user_id'      :   req.params.user_id },
                {'media_type'   :   req.params.media_type }]
                },
        function (err, result) {  
            if (err){
                logger.error("Error : ",err);
                next(err);
            }else{
                res.send({
                    'status'    : 'success',
                    'message'   : 'search resulst fetched successfully ',
                    'result'    :  result
                });
            }
    }).sort({_id:-1}).skip(config.pagesize*(req.params.pageno -1)).limit(config.pagesize);
}

/**
 * get search results
 *
 */
function getSearchCountResult(req, res, next) {
  
      logger.info('Controller: executing getSearchCountResult() ');
      /**
       * pagination for the search results
       */
      logger.info(keywords_list.keywords[req.params.keyword]);
      var search_keyword;
      if(typeof keywords_list.keywords[req.params.keyword] != 'undefined') 
        search_keyword = keywords_list.keywords[req.params.keyword];
      else search_keyword = req.params.keyword;
      // pageno 1 normal query
      //if(req.params.pageno == 1) {
      notificationModel.find({ '$and':[{'$or':[
                      {'camera_name'  :   {'$regex':search_keyword, '$options': 'i'}}, 
                      {'type'         :   {'$regex':search_keyword, '$options': 'i'}}, 
                      {'status'       :   {'$regex':search_keyword, '$options': 'i'}}, 
                      {'message'      :   {'$regex':search_keyword, '$options': 'i'}}, 
                      {'result'       :   {'$regex':search_keyword, '$options': 'i'}}]}, 
                      {'user_id'      :   req.params.user_id },
                      {'media_type'   :   req.params.media_type }]
                }).count(function(error, count){
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
                            'message' : 'No notification search count found',
                            'data' : []
                        });
                    }
                  }
      });
}
/**
 * get search filter
 *
 */
function getSearchFilterResults(req, res, next) {
  
      logger.info('Controller: executing getSearchFilterResults() ');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // switch case for time
      var time;
      switch(req.params.time) {
        case 'ANY TIME':
          time = 'ANY TIME';
          break;
        case 'PAST HOUR':
          time = new Date(today.getTime() - (1000*60*60));
          break;
        case 'PAST 24 HOUR':
          time = new Date(today.getTime() - (1000*60*60*24));
          break;
        case 'PAST WEEK':
          time = new Date(today.getTime() - (1000*60*60*24*7));
          break;
        case 'PAST MONTH':
          time = new Date(today.getTime() - (1000*60*60*24*7*4));
          break;
        case 'PAST YEAR':
          time = new Date(today.getTime() - (1000*60*60*24*7*4*12));
          break;
      }
      if( time != "ANY TIME" && 
          req.params.camera_name != "NO CAMERA" ) {

        logger.info('Controller: camera name & time');

        notificationModel.find({ 
                    camera_name : req.params.camera_name,
                    start_time  : {$gte: time},
                    user_id     : req.params.user_id,
                    media_type  : req.params.media_type
                  },
            function (err, result) {
                if (err){
                    logger.error("Error : ",err);
                    next(err);
                }else{
                    res.send({
                        'status'    : 'success',
                        'message'   : 'search filter resulst fetched successfully ',
                        'result'    :  result
                    });
                }
        }).sort({_id:-1}).skip(config.pagesize*(req.params.pageno -1)).limit(config.pagesize);
      } else if ( req.params.camera_name != 'NO CAMERA' &&
                  time == 'ANY TIME' ) {

        logger.info('Controller: camera name');

        notificationModel.find({ 
                  camera_name   : req.params.camera_name,
                  user_id       : req.params.user_id,
                  media_type    : req.params.media_type
                },
          function (err, result) {
              if (err){
                  logger.error("Error : ",err);
                  next(err);
              }else{
                  res.send({
                      'status'    : 'success',
                      'message'   : 'search filter resulst fetched successfully ',
                      'result'    :  result
                  });
              }
        }).sort({_id:-1}).skip(config.pagesize*(req.params.pageno -1)).limit(config.pagesize);  
      } else if ( time != 'ANY TIME' ) {

        logger.info('Controller: camera time');

        notificationModel.find({ 
                  start_time    : {$gte: time},
                  user_id       : req.params.user_id,
                  media_type    : req.params.media_type
                },
          function (err, result) {
              if (err){
                  logger.error("Error : ",err);
                  next(err);
              }else{
                  res.send({
                      'status'    : 'success',
                      'message'   : 'search filter resulst fetched successfully ',
                      'result'    :  result
                  });
              }
        }).sort({_id:-1}).skip(config.pagesize*(req.params.pageno -1)).limit(config.pagesize);  
      } 
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getSearchFilterCountResults(req, res, next) {
    
    logger.info('Controller: executing getSearchFilterResults() ');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // switch case for time
    var time;
    switch(req.params.time) {
        case 'ANY TIME':
        time = 'ANY TIME';
        break;
        case 'PAST HOUR':
        time = new Date(today.getTime() - (1000*60*60));
        break;
        case 'PAST 24 HOUR':
        time = new Date(today.getTime() - (1000*60*60*24));
        break;
        case 'PAST WEEK':
        time = new Date(today.getTime() - (1000*60*60*24*7));
        break;
        case 'PAST MONTH':
        time = new Date(today.getTime() - (1000*60*60*24*7*4));
        break;
        case 'PAST YEAR':
        time = new Date(today.getTime() - (1000*60*60*24*7*4*12));
        break;
    }
    if( time != "ANY TIME" && 
        req.params.camera_name != "NO CAMERA" ) {

        logger.info('Controller: camera name & time');

        notificationModel.find({ 
                    camera_name : req.params.camera_name,
                    start_time  : {$gte: time},
                    user_id     : req.params.user_id,
                    media_type  : req.params.media_type
                }).count(function(error, count){
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
                              'message' : 'No notification search count found',
                              'data' : []
                          });
                      }
                    }
        })
    } else if ( req.params.camera_name != 'NO CAMERA' &&
                time == 'ANY TIME' ) {

        logger.info('Controller: camera name');

        notificationModel.find({ 
                camera_name: req.params.camera_name,
                user_id: req.params.user_id
                }).count(function(error, count){
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
                              'message' : 'No notification search count found',
                              'data' : []
                          });
                      }
                    }
        })
    } else if ( time != 'ANY TIME' ) {

        logger.info('Controller: camera time');

        notificationModel.find({ 
                    start_time  : {$gte: time},
                    user_id     : req.params.user_id,
                    media_type  : req.params.media_type
                }).count(function(error, count){
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
                              'message' : 'No notification search count found',
                              'data' : []
                          });
                      }
                    }
        })
    } 
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
        logger.error("Error : ",error);
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
    createNotification          : createNotification,
    updateNotification          : updateNotification,
    getNotifications            : getNotifications,
    getCameraNotifications      : getCameraNotifications,
    getSearchResults            : getSearchResults,
    getSearchCountResult        : getSearchCountResult,
    getSearchFilterResults      : getSearchFilterResults,
    getSearchFilterCountResults : getSearchFilterCountResults,
    getNotificationCount        : getNotificationCount,
    getActionNotificationCount  : getActionNotificationCount,
    getLatestNotifications      : getLatestNotifications,
    removeCamNotifications      : removeCamNotifications
};
