const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicsController');

router.post('/', comicController.createComic);
router.get('/', comicController.getComics);
router.get('/:id', comicController.getComicById);
router.put('/:id', comicController.updateComic);
router.delete('/:id', comicController.deleteComic);
router.get('/search', comicController.searchComics);
module.exports = router;
