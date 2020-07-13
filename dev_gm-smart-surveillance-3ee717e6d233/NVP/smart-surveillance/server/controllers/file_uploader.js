var notificationModel = require("../models/notification.js"),
logger = require('../utility/logger'),
config = require('../config'),
multer = require('multer'),
s3 = require("../utility/S3Upload");

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        logger.info("storage destination::");
        var keyPath = 'live-api/face/22/video.webm';
        cb(null, s3.videoS3Upload(file,keyPath, function(frame_url){
                logger.info("s3 frame url:"+frame_url); 
            })
        );
        
        // cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
		logger.info("storage filename::");
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single("file");


/**
 * Create Notification
 *
 */
function push(req, res, next){
    
    logger.info('Controller: executing push() ');
    upload(req,res,function(err) {
        if(err) {
            logger.error("Error in file upload : ",error);
            next(error);
        }
        
        res.send({
                    status:  "ok",
                    message: "File is uploaded.",
                    rec: res.file
        })
    });
}

module.exports = {
    push: push,
    upload: upload,
    storage: storage
};