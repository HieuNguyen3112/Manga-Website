const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    comicTitle: {
        type: String,
        required: true,
    },
    comicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
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
        required: true,  // URL of the uploaded file
    },
    contentType: {
        type: String,
        enum: ['PDF', 'TXT', 'CBZ'],  // Adjust enum to expected types
        required: true,
    },
    chapterId: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chapter', ChapterSchema);
