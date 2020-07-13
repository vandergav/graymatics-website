
/**
 * notification utility.
 * 
*/

var async = require("async");
var rest = require('restler');
var logger = require('../utility/logger');
//Delay of 5 seconds
var delay = 5000;

exports.poll = function(callback){
async.forever(
    function(next) {
        // restler 
        rest.get("http://localhost:2020/")
        .on('complete', 
            function(response) {
            if (response instanceof Error) {
                logger.error('Error:', response.message);
                this.retry(5000); // try again after 5 sec 
            } else {
                // Continuously update stream with data
                var body = "";
                //Repeat after the delay
                setTimeout(function() {
                    next();
                }, delay)
                callback(response);
                //logger.info(response);
                // response.on("data", function(chunk) {
                //     body += chunk;
                // });

                // response.on("end", function() {

                //     //Store data in database
                //     logger.info(body);

                //     //Repeat after the delay
                //     setTimeout(function() {
                //         next();
                //     }, delay)
                // });
                //callback(response);
            }
        });
  
    },
    function(err) {
        console.error(err);
    }
)
};