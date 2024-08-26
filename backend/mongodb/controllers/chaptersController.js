const Comic = require('../models/comics_model');
const Chapter = require('../models/chapters_model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dwfmpiozq",  // Thay thế bằng cloud name từ Cloudinary dashboard
    api_key: 698787751885177,  // Thay thế bằng API key từ Cloudinary dashboard
    api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"  // Thay thế bằng API secret từ Cloudinary dashboard
});
// Tạo mới một chapter
// Đảm bảo rằng comicId được nhận đúng
exports.createChapter = async (req, res) => {
    try {
      const { comicId, chapterNumber, chapterTitle } = req.body;
  
      if (!comicId || !chapterNumber || !chapterTitle) {
        return res.status(400).json({ message: 'Comic ID, chapter number, and chapter title are required.' });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No content file uploaded.' });
      }
  
      const comic = await Comic.findById(comicId);
      if (!comic) {
        return res.status(404).json({ message: 'Comic not found' });
      }
  
      // Ensure that the chapters field is an array
      if (!Array.isArray(comic.chapters)) {
        comic.chapters = []; // Initialize it as an empty array if it's undefined
      }
  
      const chapterId = `${comicId}-${chapterNumber}`;
  
      let contentType;
      switch (req.file.mimetype) {
        case 'application/pdf':
          contentType = 'PDF';
          break;
        case 'text/plain':
          contentType = 'TXT';
          break;
        default:
          return res.status(400).json({ message: 'Invalid content file type.' });
      }
  
      const newChapter = new Chapter({
        comicTitle: comic.title,
        comicId: comic._id,
        chapterNumber,
        chapterTitle,
        content: req.file.path,
        contentType,
        chapterId,
      });
  
      const savedChapter = await newChapter.save();
  
      // Update comic with the new chapter
      comic.chapters.push(savedChapter._id);
      comic.chaptersCount += 1;
      comic.updatedDate = new Date();
      await comic.save();
  
      res.status(201).json(savedChapter);
    } catch (err) {
      console.error('Error creating chapter:', err);
      res.status(500).json({
        message: 'Server error occurred. Please try again later.',
        error: err.message,
      });
    }
  };
  
  

// Hàm tải file lên Cloudinary
const uploadFileToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
      folder: 'comic_chapters',
      resource_type: 'auto',
  });
  return result.secure_url;  // Trả về URL của file trên Cloudinary
};

// Cập nhật chapter theo ID
exports.updateChapter = async (req, res) => {
  try {
      const { chapterTitle } = req.body;
      const updateFields = {};

      // Kiểm tra và cập nhật tên chương nếu có thay đổi
      if (chapterTitle) {
          updateFields.chapterTitle = chapterTitle;
      }

      // Kiểm tra và cập nhật nội dung chương nếu có thay đổi (tức là nếu có file mới được tải lên)
      if (req.file) {
          let contentType;
          switch (req.file.mimetype) {
              case 'application/pdf':
                  contentType = 'PDF';
                  break;
              case 'text/plain':
                  contentType = 'TXT';
                  break;
              default:
                  return res.status(400).json({ message: 'Invalid content file type.' });
          }

          // Tải file lên Cloudinary và lấy URL
          const fileUrl = await uploadFileToCloudinary(req.file);
          updateFields.content = fileUrl; // Lưu URL của file trên Cloudinary vào CSDL
          updateFields.contentType = contentType;
      }

      // Tìm và cập nhật chương với các trường đã thay đổi
      const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, updateFields, { new: true });
      if (updatedChapter) {
          res.status(200).json(updatedChapter);
      } else {
          res.status(404).json({ message: 'Chapter not found' });
      }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Tạo mới một chapter

// Lấy tất cả các chương hoặc chương theo comicId
exports.getChapters = async (req, res) => {
  try {
      const { comicId } = req.query;

      const filter = comicId ? { comicId } : {};
      const chapters = await Chapter.find(filter);

      res.status(200).json(chapters);
  } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ message: 'Error fetching chapters' });
  }
};

// Lấy chapter theo ID
exports.getChapterById = async (req, res) => {
  try {
      const chapter = await Chapter.findById(req.params.id).populate('comicId');
      if (chapter) {
          res.status(200).json(chapter);
      } else {
          res.status(404).json({ message: 'Chapter not found' });
      }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Xóa chapter theo ID và cập nhật lại comic
exports.deleteChapter = async (req, res) => {
  try {
      const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
      if (deletedChapter) {
          const comic = await Comic.findById(deletedChapter.comicId);
          if (comic) {
              comic.chaptersCount -= 1;
              comic.chapters.pull(deletedChapter._id);
              await comic.save();
          }
          res.status(200).json({ message: 'Chapter deleted' });
      } else {
          res.status(404).json({ message: 'Chapter not found' });
      }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.getFirstChapter = async (req, res) => {
  try {
      const { comicId } = req.params;

      if (!comicId) {
          return res.status(400).json({ message: 'Comic ID is required.' });
      }

      const firstChapter = await Chapter.findOne({ comicId }).sort({ chapterNumber: 1 });

      if (!firstChapter) {
          return res.status(404).json({ message: 'No chapters found for this comic.' });
      }

      res.status(200).json(firstChapter);
  } catch (err) {
      console.error('Error fetching first chapter:', err);
      res.status(500).json({ message: 'Error fetching first chapter', error: err.message });
  }
};
