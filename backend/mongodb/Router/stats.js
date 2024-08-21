const express = require('express');
const router = express.Router();
const Comic = require('../models/comics_model'); // Adjust the path to your model
const User = require('../models/User'); // Adjust the path to your model
const Category = require('../models/categorys'); // Adjust the path to your model

router.get('/', async (req, res) => {
    try {
        const totalComics = await Comic.countDocuments(); // Đếm số lượng truyện

        // Tính tổng số lượt thích
        const totalLikes = await Comic.aggregate([
            { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
        ]);

        // Tính tổng số lượt xem
        const totalViews = await Comic.aggregate([
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);

        // Tính số lượng thành viên
        const totalMembers = await User.countDocuments(); // Đếm số lượng thành viên

        // Đếm số lượng thể loại
        const totalCategories = await Category.countDocuments(); // Đếm số lượng thể loại

        // Tính trung bình đánh giá (rating)
        const averageRating = await Comic.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);

        res.json({
            totalComics,
            totalLikes: totalLikes[0]?.totalLikes || 0,
            totalViews: totalViews[0]?.totalViews || 0,
            totalMembers,
            totalCategories, // Tổng số thể loại
            averageRating: averageRating[0]?.avgRating || 0 // Trung bình đánh giá
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu thống kê' });
    }
});

module.exports = router;
