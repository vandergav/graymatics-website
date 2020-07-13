
var nodemailer = require('nodemailer');
var	config = require('../config.js');

// create reusable transporter object using the default SMTP transport
var Smtp = nodemailer.createTransport({
    service: config.smtp.service,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.password
    }
});

module.exports = Smtp