/**
 * S3 upload utility.
 * base64 image 
*/

var AWS = require('aws-sdk');
var config = require('../config');
var logger = require('./logger');

var s3 = new AWS.S3({
	accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    region: config.s3.region,
    endpoint: config.s3.baseUrl ,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
});

var s3Bucket = new AWS.S3( { params: {Bucket: config.s3.bucket} } );

exports.base64S3Upload = function(base64,path,callback){
    logger.info("path:::"+path);
    var buf = new Buffer(base64.replace("data:image/jpg;base64,", ""),'base64');
    var params = {
        Bucket: config.s3.bucket,
        ACL: 'public-read',
        Key: path, 
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    s3.putObject(params, function(err, data){
        if (err) { 
            logger.error(err);
            logger.error('Error uploading data: ', data); 
            callback(err);
        } 
        else {
            logger.info('succesfully uploaded the frame');
            callback(config.s3.baseUrl+config.s3.bucket+'/'+path);
        }
    });
}
