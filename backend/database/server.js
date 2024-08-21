require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cors = require('cors');
const Comic = require('../mongodb/models/comics_model')
const Category = require('../mongodb/models/categorys');
const app = express();
app.use(cors());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dwfmpiozq", 
  api_key: 698787751885177, 
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI" 
});

// Storage for Comic Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comics', 
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

// Middleware for uploading comic images
const uploadImage = multer({ storage: imageStorage });

// Storage for Chapter Files
const chapterStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'comic_chapters',
    allowed_formats: ['pdf', 'txt'],
    resource_type: 'auto',
  },
});

// Middleware for uploading chapter files
const uploadChapter = multer({ storage: chapterStorage });

// MongoDB Connection
const mongoUri = process.env.MONGOB_SERVER;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to upload comic images
app.post('/api/comics/uploadImage', uploadImage.single('image'), async (req, res) => {
  console.log('Received request to upload a new comic image');

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    res.json({ url: req.file.path, id: req.file.filename });
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ message: 'Error uploading to Cloudinary' });
  }
});

// Route to upload chapter files
app.post('/api/chapters/uploadFile', uploadChapter.single('contentFile'), async (req, res) => {
  console.log('Received request to upload a new chapter file');

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    res.json({ url: req.file.path, id: req.file.filename });
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ message: 'Error uploading to Cloudinary' });
  }
});

// Define other routes
app.use('/api/comics', require('../mongodb/Router/comics'));
app.use('/api/chapters', require('../mongodb/Router/chapters'));
app.use('/api/categories', require('../mongodb/Router/categorys')); // Sử dụng đường dẫn chính xác
app.use('/api/stats', require('../mongodb/Router/stats' ));
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
