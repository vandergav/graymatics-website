var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var file_uploader = require("../controllers/file_uploader");
var validateHelper = require("../utility/ValidateHelper");
var config = require('../config');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

var s3 = new AWS.S3({
	accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    region: config.s3.region,
    endpoint: config.s3.baseUrl ,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3.bucket,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, "test/"+file.originalname+"_"+Date.now().toString()+".mp4");
        }
    })
})

/* Get todays notification count */
router.post('/upload', upload.array('video', 12), function(req, res, next) {
    
    logger.info("Route: /file/upload:");
	
    res.send({
        status:  "ok",
        message: "File is uploaded."
    })
});

module.exports = router;