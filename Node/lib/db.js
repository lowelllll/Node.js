var mysql = require('mysql');
var db = mysql.createConnection({ // db connect
    host:'localhost',
    user:'root',
    password:'',
    database:'opentutorials'
});

db.connect(); // db 접속

module.exports = db;

