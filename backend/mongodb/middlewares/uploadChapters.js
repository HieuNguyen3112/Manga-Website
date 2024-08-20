const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dwfmpiozq",
  api_key: 698787751885177,
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comic_chapters',
    allowed_formats: ['pdf', 'txt', 'cbz'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

module.exports = upload;
