var feedbackModel = require("../models/feedback.js"),
    logger = require('../utility/logger');


/**
 * Create Event
 *
 */
function storeFeedback(req, res, next){

    logger.info('Controller: executing storeFeedback() ');

    var feedback = new feedbackModel(req.body);

    feedback.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'feedback stored successfully ',
            'feedback' : result
        });
      }
    });
}

module.exports = {
    storeFeedback: storeFeedback
};
