const express = require('express');
const router = express.Router();
const Comic = require('../models/comics_model'); // Adjust the path to your model
const User = require('../models/User'); // Adjust the path to your model

router.get('/', async (req, res) => {
    try {
        const totalComics = await Comic.countDocuments(); // Đếm số lượng truyện
        const totalLikes = await Comic.aggregate([{ $group: { _id: null, totalLikes: { $sum: "$likes" } } }]);
        const totalViews = await Comic.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]);
        const totalMembers = await User.countDocuments(); // Đếm số lượng thành viên

        res.json({
            totalComics,
            totalLikes: totalLikes[0]?.totalLikes || 0,
            totalViews: totalViews[0]?.totalViews || 0,
            totalMembers
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu thống kê' });
    }
});

module.exports = router;
