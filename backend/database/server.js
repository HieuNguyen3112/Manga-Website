const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Đường dẫn tới các router và model
const authRoute = require('../mongodb/Router/auth');
const userRoute = require('../mongodb/Router/user');
const comicRoute = require('../mongodb/Router/comics');
const chapterRoute = require('../mongodb/Router/chapters');
const categoryRoute = require('../mongodb/Router/categorys');
const statsRoute = require('../mongodb/Router/stats');
const Comic = require('../mongodb/models/comics_model');
const Category = require('../mongodb/models/categorys');

dotenv.config();
const app = express();
const port = 3000; // Cổng chạy server

// Kết nối MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || process.env.MONGOB_SERVER, {
            dbName: 'comic_db'
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};
connectToMongo();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dwfmpiozq',
    api_key: 698787751885177,
    api_secret: 'WbcBy270Rx36KWI3q7jeOXCh4vI'
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

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);
app.use('/api/comics', comicRoute);
app.use('/api/chapters', chapterRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/stats', statsRoute);

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
