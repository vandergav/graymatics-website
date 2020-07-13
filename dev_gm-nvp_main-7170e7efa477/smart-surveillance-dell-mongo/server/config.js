this.host = "localhost";
//this.host = "192.168.1.20";
// this.host = "34.203.198.167"
// this.host = "34.192.81.45"
// this.host = "54.173.124.33"
this.port = 9999
this.url = "http://" + this.host + ":" + this.port

 //Database config - server
this.database = {
    host: "127.0.0.1",
    media_db: "surveillance_media", // database name
    text_db: "surveillance_text",
    port: 27017 // database name
}
//mapr datbase
// this.database = {
//     host: "10.200.100.160",
//     databaseName: "gm_surveillance_db", // database name
//     port: 27017 // database name
// }
 // Database config
// development

this.mysql = {
    host: "localhost",
    user: "root", // your username
    password: "root", // your password
    databaseName: "surveillance_api" // database name
}
// production
// live api
/*
this.mysql = {
    host: "192.168.231.146",
    user: "root", // your username
    password: "graymatics", // your password
    databaseName: "surveillance_api" // database name
}*/
//mapr db
// this.mysql = {
//     host: "10.200.100.160",
//     user: "root", // your username
//     password: "graymatics", // your password
//     databaseName: "surveillance_api" // database name
// }

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

this.platform = {
    api : "http://127.0.0.1:8000/camera/",
    face_api : "http://127.0.0.1:8000/training/"
    // api : "http://192.168.1.206:8000/camera/"
    // live-api ctrl
    // api : "http://34.192.81.45:8000/camera/"
    // Mapr platform ctrl
    // api : "http://192.168.1.205:8000/camera/"
}

// AwS S3 bucket details
// this.s3 = {
//     bucket : "smart-surveillance",
//     baseUrl: "https://s3.amazonaws.com/",
//     accessKeyId: "AKIAIRNNBTLVNSZWEDRQ",
//     secretAccessKey:"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",
//     region:"us-east-1"
// }
// minio details
// this.s3 = {
//     bucket : "smart-surveillance",
//     baseUrl: "http://34.229.74.121:9000/",
//     accessKeyId: "4YSFMIDWMPLIFXYGAJJP",
//     secretAccessKey:"y/54aU4WlUGpoGxfYcmctod6useLej+UrJ1QiVkm",
//     region:"us-east-1"
// }
this.s3 = {
    bucket : "smart-surveillance",
    baseUrl: "http://127.0.0.1:9000/",
    accessKeyId: "6QOEN8Q2GZVRU9NHXOGE",
    secretAccessKey:"FO2SSJQbholKt7dKYpnyoPGabwbJk5pNONH1M32J",
    region:"us-east-1"
}
//Logger configuration
this.filepath = "./var/logs/texting.log"
// this.client = "http://localhost:2017"
this.client = "http://127.0.0.1:2017"
// this.client = "http://54.173.124.33:2017"
//passwor Links
this.supportEmail = "Graymatics Support <info@graymatics.com>"
this.passwordResetLink = this.client + "/reset"
this.pagesize = 10
