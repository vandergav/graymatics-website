// this.host = "localhost";
this.host = "192.168.1.185";
// this.host = "34.203.198.167"
// this.host = "34.192.81.45"
// this.host = "192.168.128.112"
this.port = 4488
this.url = "http://" + this.host + ":" + this.port

 //Database config - server
 this.database = {
    host: "localhost",
    databaseName: "gm_surveillance_db", // database name
    port: 27017 // database name
}
//  this.database = {
//     host: "192.168.128.116",
//     databaseName: "gm_surveillance_db", // database name
//     port: 27017 // database name
// }

 // Database config
// development
// this.mysql = {
//     host: "192.168.128.115",
//     user: "graymatics", // your username
//     password: "graymatics", // your password
//     databaseName: "surveillance_api" // database name
// }

this.mysql = {
    host: "localhost",
    user: "root", // your username
    password: "gray@123", // your password
    databaseName: "surveillance_api" // database name
}

// Memcache config
this.memcache = {
    host: "localhost",
    port: "11211"
}

//SMTP config
this.smtp = {
    service: "sendgrid",
    user: "graymatics",
    password: "Gray@123"
}

//AMQP config
this.amqp = {
    host: "192.168.1.20",
    user: "test",
    password : "test",
    port: 5672
}

//Redis config
this.redis = {
    host: "192.168.1.20",
    port: 6379,
    user: "redis",
    password: "redis"
}

this.platform = {
    api : "http://192.168.1.240:8000/camera/"
    // api : "http://192.168.128.114:8000/camera/"
}
// minio details
// this.s3 = {
//     bucket : "smart-surveillance",
//     baseUrl: "http://192.168.128.117:9000/",
//     accessKeyId: "23PLYMYCBY0IVMBP658H",
//     secretAccessKey:"d85UuE/9R7WOlgV9pbp7OtU2knIOYRURB/aN96Uj",
//     region:"us-east-1"
// }
this.s3 = {
    bucket : "smart-surveillance",
    baseUrl: "http://127.0.0.1:9000/",
    accessKeyId: "YWNQ30LK94O9RSJKHEOP",
    secretAccessKey:"ApFYLiWpf7qoIX47dAGRrN4m6qaFuEJUZc2UgQ1N",
    region:"us-east-1"
}
//Logger configuration
this.filepath = "./var/logs/texting.log"
// this.client = "http://localhost:2017"
this.client = "http://192.168.128.185:2017"
// this.client = "http://54.173.124.33:2017"
//passwor Links
this.supportEmail = "Graymatics Support <info@graymatics.com>"
this.passwordResetLink = this.client + "/reset"