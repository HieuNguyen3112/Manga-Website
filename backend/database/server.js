require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cors = require('cors');
const app = express();
app.use(cors());
// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dwfmpiozq",  // Thay thế bằng cloud name từ Cloudinary dashboard
  api_key: 698787751885177,  // Thay thế bằng API key từ Cloudinary dashboard
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"  // Thay thế bằng API secret từ Cloudinary dashboard
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comics', // Thư mục trên Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Định dạng được phép
  },
});

// Tạo middleware cho Multer
const upload = multer({ storage });

// Kết nối MongoDB
mongoose.connect('mongodb+srv://vinh:0798595814@cluster0.q9lnnq3.mongodb.net/comic_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Kết nối MongoDB thành công');
}).catch(err => {
  console.error('Lỗi kết nối MongoDB:', err);
});

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route để tải ảnh lên Cloudinary
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log('Nhận được request thêm mới truyện');
  
  if (!req.file) {
    return res.status(400).json({ message: 'Không có tệp nào được tải lên' });
  }

  try {
    // Trả về URL của hình ảnh đã tải lên Cloudinary
    res.json({ url: req.file.path, id: req.file.filename });
  } catch (err) {
    console.error('Lỗi tải lên Cloudinary:', err);
    res.status(500).json({ message: 'Lỗi tải lên Cloudinary' });
  }
});

// Định nghĩa các route
app.use('/api/comics', require('../mongodb/Router/comics'));

// Khởi chạy server
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
