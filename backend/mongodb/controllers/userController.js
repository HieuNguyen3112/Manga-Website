const User = require("../models/User");

const userController = {
    //get all user
    getAllUser: async (req, res) => {
        try {
            if (req.user.admin) {
                // Nếu là admin, lấy toàn bộ danh sách người dùng
                const users = await User.find({}, 'username');
                res.status(200).json(users);
            } else {
                // Nếu không phải admin, chỉ trả về thông tin của chính họ
                const user = await User.findById(req.user.id, 'username email');
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json("User not found");
                }
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //delete user
    deleteUser: async(req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;
