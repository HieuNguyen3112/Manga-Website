const mongoose = require('mongoose');
const Comic = require('../models/comics_model');

const ChapterSchema = new mongoose.Schema({
    comicTitle: {
        type: String,
        required: true,
    },
    comicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',  // Tham chiếu đến model Comic bằng _id
        required: true,
    },
    chapterNumber: {
        type: Number,
        required: true,
    },
    chapterTitle: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    chapterId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
