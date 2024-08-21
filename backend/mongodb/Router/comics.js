const express = require('express');
const router = express.Router();
const comicsController = require('../controllers/comicsController');
const upload = require('../middlewares/uploadComics'); // Đảm bảo đúng đường dẫn

// Tạo truyện mới
router.post('/', upload.single('image'), (req, res) => {
    console.log('Tệp đã được tải lên:', req.file); // Kiểm tra tệp đã được tải lên
    comicsController.createComic(req, res);
  });
  
// Lấy tất cả truyện
router.get('/', comicsController.getComics);

// Lấy hình ảnh của truyện theo ID
//router.get('/:id/image', comicsController.getComicImage); // Đảm bảo rằng `comicsController.getComicImage` là một hàm

// Cập nhật truyện
router.put('/:id', upload.single('image'), comicsController.updateComic);

// Xóa truyện
router.delete('/:id', comicsController.deleteComic);

//tìm kiếm truyện
router.get('/search', comicsController.searchComics);

module.exports = router;
