require('dotenv').config(); 

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
const mongoUri = process.env.MONGOB_SERVER; 

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Kết nối MongoDB thành công');
    })
    .catch(err => {
        console.error('Lỗi kết nối', err);
    });

// Thiết lập các route
app.use('/api/comics', require('../mongodb/Router/comics'));
app.use('/api/chapters', require('../mongodb/Router/chapters'));

app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});
