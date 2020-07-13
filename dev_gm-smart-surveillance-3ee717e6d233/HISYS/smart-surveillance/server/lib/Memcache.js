
var util = require("util"),
	memcache = require('memcache'),
	config = require('../config.js'),
	logger = require('../utility/logger');


/**
 * Memcache singletone class
 */
var Memcache = function Memcache() {
	// defining a var instead of this (works for variable & function) will create a private definition
	this.mcClient = new memcache.Client()
	this.mcClient.port = config.memcache.port
	this.mcClient.host = config.memcache.host
	
	this.mcClient.connect(function(err) {              			 	
        if(err) {                                    	 	
        	console.log('ERRO WHEN CONNECTING TO MEMCACHE:', err);	
        	logger.error(err.message);
        }else {											  		
            console.log("MEMCACHE CONNECT SUCCESSFUL.");	
            logger.info("MEMCACHE CONNECT SUCCESSFUL.");
        }                                                 
	});
	
	this.mcClient.on('error', function(err) {
        if(err) { 	
        	console.log("MEMCACHE CONNECTION ERROR: " + err); 
        	logger.error(err.message);
        } 
    });
	
	this.mcClient.on('close', function(err) {
        if(err) { 	
        	console.log("MEMCACHE CONNECTION CLOSED."); 
        	logger.error(err.message);
        } 
    });
   
	if (Memcache.caller != Memcache.getInstance) {
		throw new Error("This object cannot be instanciated")
	}
}

Memcache.instance = null;

/**
 * Memcache getInstance definition
 * @return {Memcache} class
 */

Memcache.getInstance = function(){

		if(this.instance === null){
			this.instance = new Memcache()
		}
		return this.instance
}

module.exports = Memcache.getInstance()