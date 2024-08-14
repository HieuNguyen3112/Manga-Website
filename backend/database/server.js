const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware để phân tích (parse) JSON
app.use(express.json());
app.use(cors());
app.use('/backend/database/uploads', express.static(path.join(__dirname, 'uploads')));
// Kết nối MongoDB
mongoose.connect('mongodb+srv://vinh:0798595814@cluster0.q9lnnq3.mongodb.net/comic_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Kết nối MongoDB thành công');
}).catch(err => {
    console.error('Lỗi kết nối', err);
});

// Thiết lập các route
app.use('/api/comics', require('../mongodb/Router/comics'));
app.use('/api/chapters', require('../mongodb/Router/chapters'));

app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});
