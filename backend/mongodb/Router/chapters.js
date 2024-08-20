const express = require('express');
const router = express.Router();
const chaptersController = require('../controllers/chaptersController');
const uploadChapter = require('../middlewares/uploadChapters'); // Middleware xử lý việc tải lên tệp chương

// Định nghĩa các route cho chapters

// Route tạo chương mới, sử dụng middleware để tải lên tệp chương
router.post('/', uploadChapter.single('contentFile'), chaptersController.createChapter);

// Route lấy danh sách các chương, có thể lọc theo comicId nếu có trong query
router.get('/', chaptersController.getChapters);

// Route lấy thông tin chi tiết của một chương theo ID
router.get('/:id', chaptersController.getChapterById);

// Route cập nhật chương, sử dụng middleware để tải lên tệp chương nếu có
router.put('/:id', uploadChapter.single('contentFile'), chaptersController.updateChapter);

// Route xóa chương theo ID
router.delete('/:id', chaptersController.deleteChapter);

module.exports = router;
