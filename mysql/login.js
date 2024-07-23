const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded({extended: true});

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "minhhieu31122004",
    database: "comic_db"
});

connection.connect(function(error){
    if (error) console.log(error);
    else console.log("Kết nối đến cơ sở dữ liệu thành công");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/login.html");
});

app.post("/", encoder, function(req, res){
    var email = req.body.email;
    var pass = req.body.password;

    connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, pass], function(error, results, fields){
        if (error) {
            console.log(error);
            res.send('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            return;
        }
        if (results.length > 0) {
            res.send('Đăng nhập thành công. Chào mừng bạn!');
        } else {
            res.send("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        }
        res.end();
    });
});

app.listen(5500, function() {
    console.log("Server is running on port 5500");
});
