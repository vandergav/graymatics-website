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
            'face_recognition' : result
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
              'data' : subject
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No subject Found',
                'data' : []
            });
        }
      }
    });
}

module.exports = {
    addSubject: addSubject,
    updateSubject: updateSubject
};
