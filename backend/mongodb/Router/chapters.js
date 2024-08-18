const express = require('express');
const router = express.Router();
const chaptersController = require('../controllers/chaptersController');

// Định nghĩa route cho chapters
router.post('/', chaptersController.createChapter);
router.get('/', chaptersController.getChapters);
router.get('/:id', chaptersController.getChapterById);
router.put('/:id', chaptersController.updateChapter);
router.delete('/:id', chaptersController.deleteChapter);

module.exports = router;
