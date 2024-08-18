const Comic = require('../models/comics_model');
const Chapter = require('../models/chapters_model');

// Tạo mới một chapter
// Đảm bảo rằng comicId được nhận đúng
exports.createChapter = async (req, res) => {
    console.log('Received comicId:', req.body.comicId);  // Kiểm tra comicId từ yêu cầu

    const { comicId, chapterNumber, chapterTitle, content } = req.body;
    try {
        const comic = await Comic.findById(comicId);
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        const newChapter = new Chapter({
            comicTitle: comic.title,
            comicId: comic._id,
            chapterNumber,
            chapterTitle,
            content,
            chapterId: `${comic._id}-${chapterNumber}`
        });
        
        const savedChapter = await newChapter.save();

        // Cập nhật số lượng chương và ngày cập nhật cho comic
        comic.chaptersCount += 1;
        comic.updatedDate = new Date();
        comic.chapters.push(savedChapter._id);
        await comic.save();

        res.status(201).json(savedChapter);
    } catch (error) {
        console.error('Error in createChapter:', error);  // Kiểm tra lỗi nếu có
        res.status(400).json({ message: error.message });
    }
};


// Lấy tất cả chapters
exports.getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find().populate('comicId');
        res.status(200).json(chapters);
    } catch (error) {
        res.status(400).json({ message: error.message });
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

// Cập nhật chapter theo ID
exports.updateChapter = async (req, res) => {
    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedChapter) {
            res.status(200).json(updatedChapter);
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
            // Cập nhật lại thông tin của comic sau khi xóa chương
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
