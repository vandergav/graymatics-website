var faceRecongitionModel = require("../models/face_recognition.js"),
    logger = require('../utility/logger');


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
            'message' : 'subject created successfully ',
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

module.exports = {
    addSubject      : addSubject,
    updateSubject   : updateSubject,
    getFace         : getFace,
    getFaceList     : getFaceList
};
