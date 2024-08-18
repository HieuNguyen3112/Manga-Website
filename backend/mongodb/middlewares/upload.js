const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dwfmpiozq",  // Thay thế bằng cloud name từ Cloudinary dashboard
  api_key: 698787751885177,  // Thay thế bằng API key từ Cloudinary dashboard
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"  // Thay thế bằng API secret từ Cloudinary dashboard
});
// Cấu hình CloudinaryStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comics', // Thư mục trên Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Các định dạng ảnh cho phép
  },
});

// Tạo middleware cho Multer
const upload = multer({ storage });

module.exports = upload;
