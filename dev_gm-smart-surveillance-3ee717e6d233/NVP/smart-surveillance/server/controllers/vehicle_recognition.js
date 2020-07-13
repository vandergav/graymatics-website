var vehicleRecongitionModel = require("../models/vehicle_recognition.js"),
    logger = require('../utility/logger'),
    mainHelper = require("../helpers/MainHelper");


/**
 * Create Notification
 *
 */
function addList(req, res, next){

    logger.info('Controller: executing addList() ');
    req.body._id = mainHelper.randomToken();
    var vehicle_recognition = new vehicleRecongitionModel(req.body);
    // Check list_name has already exists
    vehicleRecongitionModel.find({
        list_name   : req.body.list_name
    }).count(function(error, count){
      if(error){
        logger.error("Error : ",error);
        next(error);
      }else{
        if(count > 0){
            logger.info("count of list_name::",count);
            res.send({
                'status' : 'error',
                'message' : 'List name alreday exists, Please try other'
            });
        }else{
             // Add list_name if not exists
             vehicle_recognition.save(req.body, function (err, result) {
                if (err){
                  console.log("Error : ",err);
                  next(err);
                }else{
                  res.send({
                      'status' : 'success',
                      'message' : 'List created successfully ',
                      'result' : result
                  });
                }
            });
        }
      }
    });
}

/**
 * Get Notification
 *
 */
function updateList(req, res, next){

    logger.info('Controller: executing updateList() ');

    vehicleRecongitionModel.findByIdAndUpdate(req.body._id, req.body,function(error, subject) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("List update :: ",subject);

        if(subject){
          res.send({
              'status' : 'success',
              'result' : subject
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No subject Found',
                'result' : []
            });
        }
      }
    });
}


/**
 * Get Face
 *
 */
function getListName(req, res, next){
    vehicleRecongitionModel.find({
        user_id     : req.params.user_id,
        list_name   : req.params.list_name
    },
    function(error, list_name_vehicle_numbers) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(list_name_vehicle_numbers){
          res.send({
              'status' : 'success',
              'data' : list_name_vehicle_numbers
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No vehicle_list found',
                'data' : []
            });
        }
      }
  }).sort({created_dtime:-1});
}

/**
 * Get Face List
 *
 */
function getVehicleList(req, res, next){
    vehicleRecongitionModel.find({
        user_id:req.params.user_id
    },
    function(error, vehicle_list) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(vehicle_list){
          res.send({
              'status' : 'success',
              'data' : vehicle_list
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No vehicle_list found',
                'data' : []
            });
        }
      }
  }).sort({created_dtime:-1});
}

/**
 * Remove list_name from vehicle recognition
 */
function removeListName(req, res, next) {
    
    logger.info("Model: /vehicle_recognition/remove:");

    vehicleRecongitionModel.remove({_id: req.params.list_id},
        function(error, vehicle) {
            if(error){
                logger.error("Error : ",error);
                next(error);
            }else{
                if(vehicle){
                    res.send({
                        'status'  : 'success',
                        'data'    : 'vehicle list_name removed successfully'
                    });
                }else{
                    res.send({
                        'status'  : 'success',
                        'message' : 'No vehicle List Found',
                        'data' : []
                    });
                }
            }
        }
    );
}

module.exports = {
    addList         : addList,
    updateList      : updateList,
    getListName     : getListName,
    getVehicleList  : getVehicleList,
    removeListName  : removeListName
};
