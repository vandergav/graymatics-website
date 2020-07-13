/**
 * Main helper
 */

var config = require("../config"),
	bcrypt = require("bcryptjs"),
	crypto = require("crypto")

/**
 * String crypt
 * @param {String} string
 * @return {String} hash
 */
exports.stringCrypt = function(string) {	
	return bcrypt.hashSync(string, 10)
}

/**
 * Crypt test
 * @param {String} string
 * @param {String} hash
 * @return {Boolean}
 */
exports.stringCryptTest = function(string, hash) {	
	if (typeof string === "undefined") {
		return false
	}
	return bcrypt.compareSync(string, hash)
}

/**
 * Get random string for tokens
 * @return {String} Token
 */
exports.randomToken = function() {
	var buf = crypto.randomBytes(16)
	return buf.toString('hex')
}

/**
 * Get random Number
 * @return {Number} 
 */
exports.randomNumber = function(){
	var buf = crypto.randomBytes(5);
	return buf.toString('hex');
};
