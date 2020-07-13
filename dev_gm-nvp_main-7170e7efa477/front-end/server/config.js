//this.host = "192.168.1.20";
this.host = "127.0.0.1";
this.port = 9999
this.url = "http://" + this.host + ":" + this.port

 //Database config - server
this.database = {
    host: "localhost",
    databaseName: "surveillance_api", // database name
    port: 27017 // database name
}

this.mysql = {
    host: "localhost",
    user: "root", // your username
    password: "root", // your password
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

this.platform = {
    api : "http://192.168.1.20:8000/camera/",
    face_api : "http://localhost:8000/training/"
}


this.s3 = {
    bucket : "smart-surveillance",
    baseUrl: "http://127.0.0.1:9000/",
    accessKeyId: "6QOEN8Q2GZVRU9NHXOGE ",
    secretAccessKey:"FO2SSJQbholKt7dKYpnyoPGabwbJk5pNONH1M32J",
    region:"us-east-1"
}
//Logger configuration
this.filepath = "./var/logs/texting.log"
this.client = "http://localhost:2017"
// this.client = "http://192.168.1.185:2017"
// this.client = "http://54.173.124.33:2017"
//passwor Links
this.supportEmail = "Graymatics Support <info@graymatics.com>"
this.passwordResetLink = this.client + "/reset"
this.pagesize = 10
