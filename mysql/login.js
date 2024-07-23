const mysql = require('mysql');
const express = require('express');

const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'minhhieu31122004',
    database: 'comic_db'
});

connection.connect(function(error){
    if (error) console.log(error);
    else console.log("Kết nối đến cơ sở dữ liệu thành công");
})

app.get("/",function(req, res){
    res.sendFile(__dirname + "/login.html")
})

app.post("/", encoder, function(req,res){
    var email = req.body.email;
    var pass = req.body.password;

    connection.query("select * from users where email = ? and password = ?", [email, pass] , function(error, results, fields){
        if (results.length > 0) {
            res.redirect("/welcome");
        }
        else {
            res.redirect("/");
        }
        res.end();
    });
})

//login success
app.get("/welcome", function(req, res){
    res.sendFile(__dirname + "/welcome.html")
});

//set app port
app.listen(5500); 
