var _mysql = require('mysql'), 
	config = require('../config.js');

var mysql ;

module.exports.getConnection = function() {
    // Test connection health before returning it to caller.
    if ((module.exports.mysql) && (module.exports.mysql._socket)
            && (module.exports.mysql._socket.readable)
            && (module.exports.mysql._socket.writable)) {
        return module.exports.mysql;
    }
    console.log(((module.exports.mysql) ?
            "UNHEALTHY SQL CONNECTION; RE" : "") + "CONNECTING TO SQL.");
    // Recreate the connection, since
    // the old one cannot be reused.
    mysql = _mysql.createConnection({
		host : config.mysql.host,
		user : config.mysql.user,
		password : config.mysql.password,
		database : config.mysql.databaseName
	});
    
    mysql.connect(function(err) {              			 	// The server is either down
        if(err) {                                    	 	// or restarting (takes a while sometimes).
          console.log('ERRO WHEN CONNECTING TO DB:', err);	// We introduce a delay before attempting to reconnect,
          setTimeout(module.exports.getConnection, 2000); 	// to avoid a hot loop, and to allow our node script to
        }else {											  	// process asynchronous requests in the meantime.	
            console.log("SQL CONNECT SUCCESSFUL.");		  	// If you're also serving HTTP, display a 503 error.
        }                                                 
    });                                     
    
    mysql.on("close", function (err) {
    	console.log("SQL CONNECTION CLOSED.");
    	module.exports.getConnection();
    });
    
    mysql.on('error', function(err) {
        console.log('DB ERROR', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
        	console.log("SQL CONNECTION ERROR: " + err);// lost due to either server restart, or a 
        	module.exports.getConnection();  			// connection idle timeout (the wait_timeout
        } else {                                      	// server variable configures this)
          throw err;                                  
        }
    });
   
    module.exports.mysql = mysql;
    return module.exports.mysql;
}

// Open a connection automatically at app startup.
module.exports.getConnection();


