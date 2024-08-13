const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    comicTitle: { type: String, required: true },
    comicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comic', required: true },
    chapterNumber: { type: Number, required: true },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    chapterTitle: { type: String, required: true },
    chapterId: { type: String, required: true, unique: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Chapter', ChapterSchema);
