/**
 * Model : Configuration Notification
 */

var mongoose = require('mongoose');
var config = require('../config');

var media_db_conn = mongoose.createConnection('mongodb://localhost/'+config.database.media_db);

var Schema = mongoose.Schema;

var cameraSchema = new Schema({
    user_id             : String,
    name                : String,
    source              : String,
    protocol            : String,
    interface           : String,
    channel             : String,
    fps                 : String,
    algo                : Array,
    roi                 : Array,
    parameters          : String,
    addi_info           : String,
    type                : String,
    status              : String,
    agent               : String,
    frame               : String,
    gps                 : String,
    people_whitelist    : String,
    people_blacklist    : String,
    vehicle_whitelist   : String,
    vehicle_blacklist   : String,
    created_dtime       : { type: Date, default: Date.now },
    modified_dtime      : { type: Date, default: Date.now }
});

var cameraModel = media_db_conn.model('camera', cameraSchema); 

module.exports = cameraModel;
