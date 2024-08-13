const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    chapters: { type: String, default: '0' }, // Đảm bảo là chuỗi nếu cần
    author: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' }, // Không cần lưu dưới dạng Buffer và contentType nếu chỉ lưu đường dẫn
    views: { type: Number, default: 0 },
    status: { type: String, default: 'Đang cập nhật' },
    rating: { type: Number, default: 5 },
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;
