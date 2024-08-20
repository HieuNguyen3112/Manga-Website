const mongoose = require('mongoose');

const ComicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    }], // Make sure this is an array of ObjectId references
    chaptersCount: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'Đang cập nhật',
    },
    rating: {
        type: Number,
        default: 5,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comic', ComicSchema);
