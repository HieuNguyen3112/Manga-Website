const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    chapters: { type: Number, default: 0 },
    author: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true }, // Lưu URL hình ảnh từ Cloudinary
    views: { type: Number, default: 0 },
    status: { type: String, default: 'Đang cập nhật' },
    rating: { type: Number, default: 5 },
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
  });
  
  const Comic = mongoose.model('Comic', comicSchema);
  

module.exports = Comic;
