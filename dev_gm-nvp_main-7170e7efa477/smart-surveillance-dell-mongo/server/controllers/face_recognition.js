var faceRecongitionModel = require("../models/face_recognition.js"),
    logger = require('../utility/logger'),
    config = require('../config');


/**
 * Create Notification
 *
 */
function addSubject(req, res, next){

    logger.info('Controller: executing addSubject() ');

    var face_recognition = new faceRecongitionModel(req.body);

    face_recognition.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message': 'subject created successfully ',
            'result' : result
        });
      }
    });
}

/**
 * Get Notification
 *
 */
function updateSubject(req, res, next){

    logger.info('Controller: executing updateSubject() ');

    faceRecongitionModel.findByIdAndUpdate(req.body._id, req.body,function(error, subject) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("subject update :: ",subject);

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
function getFace(req, res, next){

    logger.info('Controller: executing getFace() ');

    faceRecongitionModel.find({
        user_id :  req.params.user_id,
        _id     : req.params._id
    },
    function(error, face_list) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(face_list){
          res.send({
              'status' : 'success',
              'data' : face_list
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No face_list found',
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
function getFaceList(req, res, next){

    logger.info('Controller: executing getFaceList() ');

    faceRecongitionModel.find({
        user_id:req.params.user_id
    },
    function(error, face_list) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{
        if(face_list){
          res.send({
              'status' : 'success',
              'data' : face_list
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No face_list found',
                'data' : []
            });
        }
      }
  }).sort({created_dtime:-1});
}
/**
 * 
 * @param { user_id,source } req 
 * @param { face_details} res 
 * @param { if error } next 
 */
function getFaceDetails(req, res, next){

    logger.info('Controller: executing getFaceDetails() ');
    var face_url = config.s3.baseUrl+config.s3.bucket+'/live-api/face/'+req.params.user_id+'/images/'+req.params.source;
    faceRecongitionModel.find({
        user_id     : req.params.user_id,
        source      : face_url
    },
    function(error, face_details) {
        if(error){
            loggor.error("Error : ",error);
            next(error);
        }else{
        if(face_details) {
            res.send({
                'status'  : 'success',
                'data'    : face_details
            });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No face found',
                'data' : []
            });
        }
        }
    })
}

module.exports = {
    addSubject      : addSubject,
    updateSubject   : updateSubject,
    getFace         : getFace,
    getFaceList     : getFaceList,
    getFaceDetails  : getFaceDetails
};
