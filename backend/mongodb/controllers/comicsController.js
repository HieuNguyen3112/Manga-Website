const Comic = require('../models/comics_model');
const multer = require('multer');
const path = require('path');

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Set the directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set the filename as current timestamp + original extension
    }
});

const upload = multer({ storage: storage });

// Tạo mới một comic
// Hàm để tạo mới một truyện
exports.createComic = [
    upload.single('image'), // Middleware để xử lý upload file
    async (req, res) => {
        try {
            // Lấy số lượng tài liệu hiện có trong collection
            const comicCount = await Comic.countDocuments({});
            const comicId = comicCount + 1; // comicId sẽ là số lượng hiện tại + 1

            const { title, category, author, description, chapters } = req.body;
            const image = req.file ? `/backend/database/uploads/${req.file.filename}` : '';

            // Tạo mới một truyện với comicId được tính toán ở trên
            const newComic = new Comic({
                // comicId: comicId.toString(), // Chuyển số thành chuỗi nếu comicId là chuỗi
                title,
                category,
                author,
                description,
                image,
                chapters: 0,// Đảm bảo chapters là chuỗi nếu schema yêu cầu
                views: 0, // Lượt xem mặc định là 0
                status: 'Đang cập nhật ', // Trạng thái mặc định là "Ongoing"
                rating: 5 // Đánh giá mặc định
            });

            // Lưu truyện mới vào MongoDB
            const savedComic = await newComic.save();

            // Trả về kết quả thành công
            res.status(201).json(savedComic);
        } catch (err) {
            console.error("Error creating comic:", err);
            res.status(500).send(err.message);
        }
    }
];



// Lấy tất cả comics
exports.getComics = async (req, res) => {
    try {
        const comics = await Comic.find().lean().exec();
        res.status(200).json(comics);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy comic theo ID
exports.getComicById = async (req, res) => {
    try {
        const comic = await Comic.findById(req.params.id);
        if (comic) {
            res.status(200).json(comic);
        } else {
            res.status(404).json({ message: 'Comic not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật comic
exports.updateComic = [
    upload.single('image'), // Middleware to handle image upload
    async (req, res) => {
        const { title, category, author, description } = req.body;
        const image = req.file ? `/backend/database/uploads/${req.file.filename}` : undefined;

        const updateData = {
            title,
            category,
            author,
            description,
            ...(image && { image }) // Only update image if a new one was uploaded
        };

        try {
            const updatedComic = await Comic.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (updatedComic) {
                res.status(200).json(updatedComic);
            } else {
                res.status(404).json({ message: 'Comic not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

// Xóa comic theo ID và các chapters liên quan
exports.deleteComic = async (req, res) => {
    try {
        const deletedComic = await Comic.findByIdAndDelete(req.params.id);
        if (deletedComic) {
            res.status(200).json({ message: 'Comic deleted' });
        } else {
            res.status(404).json({ message: 'Comic not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
