const Comic = require('../models/comics_model');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dwfmpiozq",  // Thay thế bằng cloud name từ Cloudinary dashboard
  api_key: 698787751885177,  // Thay thế bằng API key từ Cloudinary dashboard
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"  // Thay thế bằng API secret từ Cloudinary dashboard
});

// Tạo mới một comic
exports.createComic = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Không có tệp nào được tải lên' });
    }

    // Tải ảnh lên Cloudinary và nhận đường dẫn của ảnh
    const result = await cloudinary.uploader.upload(file.path);

    // Tạo truyện mới với URL ảnh từ Cloudinary
    const newComic = new Comic({
      title,
      category,
      author,
      description,
      imageUrl: result.secure_url, // Sử dụng URL từ Cloudinary
      publicId: result.public_id,  // Lưu lại public_id của ảnh để có thể xóa sau này
      chapters: 0,
      views: 0,
      status: 'Đang cập nhật',
      rating: 5,
      creationDate: new Date(),
      updateDate: new Date(),
    });

    const savedComic = await newComic.save();
    res.status(201).json(savedComic);
  } catch (err) {
    console.error('Lỗi thêm mới truyện:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật comic
exports.updateComic = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;
    const file = req.file;

    const comic = await Comic.findById(req.params.id);

    if (!comic) {
      return res.status(404).json({ message: 'Truyện không tồn tại' });
    }

    // Cập nhật thông tin truyện
    comic.title = title;
    comic.category = category;
    comic.author = author;
    comic.description = description;
    comic.updateDate = new Date();

    // Nếu có tệp mới, cập nhật hình ảnh
    if (file) {
      // Xóa hình ảnh cũ trên Cloudinary trước khi cập nhật
      if (comic.publicId) {
        await cloudinary.uploader.destroy(comic.publicId);
      }

      // Tải ảnh mới lên Cloudinary
      const result = await cloudinary.uploader.upload(file.path);

      // Cập nhật URL và public_id của ảnh mới
      comic.imageUrl = result.secure_url;
      comic.publicId = result.public_id;
    }

    const updatedComic = await comic.save();
    res.status(200).json(updatedComic);
  } catch (err) {
    console.error('Lỗi cập nhật truyện:', err);
    res.status(500).json({ error: err.message });
  }
};

// Xóa comic
// Xóa comic
exports.deleteComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Truyện không tồn tại' });
    }

    console.log("Đang xóa ảnh trên Cloudinary:", comic.publicId);

    // Xóa hình ảnh trên Cloudinary
    if (comic.publicId) {
      await cloudinary.uploader.destroy(comic.publicId);
      console.log("Xóa ảnh thành công:", comic.publicId);
    }

    res.status(200).json({ message: 'Truyện đã được xóa và hình ảnh trên Cloudinary cũng đã được xóa' });
  } catch (err) {
    console.error('Lỗi xóa truyện:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả comics
exports.getComics = async (req, res) => {
  try {
    const comics = await Comic.find();
    res.status(200).json(comics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};