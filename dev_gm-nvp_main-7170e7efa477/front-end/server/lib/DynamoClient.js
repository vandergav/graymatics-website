var AWS = require("aws-sdk");
var config = require("../config.js");

AWS.config.update({
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    region: config.s3.region
});

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;