document.getElementById("showpassword").addEventListener("change", function() {
    const password = document.getElementById("password");
    const repassword = document.getElementById("repassword");
    if (this.checked) {
        password.type = "text";
        repassword.type = "text";
    } else {
        password.type = "password";
        repassword.type = "password";
    }
});
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'minhhieu31122004',
    database: 'comic_db'
});

connection.connect(function(error) {
    if (error) console.log(error);
    else console.log("Kết nối đến cơ sở dữ liệu thành công");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});

app.post("/register", function(req, res) {
    const name = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const repassword = req.body.repassword;

    // Kiểm tra các trường dữ liệu
    if (!name || !email || !password || !repassword) {
        res.send('Tất cả các trường là bắt buộc');
        return;
    }

    if (password !== repassword) {
        res.send('Mật khẩu không khớp');
        return;
    }

    // Chèn người dùng mới vào cơ sở dữ liệu
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    connection.query(query, [name, email, password], function(error, results, fields) {
        if (error) {
            console.log(`Lỗi khi chèn người dùng mới: ${error}`);
            res.send('Đã xảy ra lỗi khi đăng ký');
            return;
        }
        res.send('Đăng ký thành công. Bạn có thể <a href="/login">đăng nhập</a> ngay bây giờ.');
    });
});

app.listen(5505, function() {
    console.log("Server is running on port 5505");
});

