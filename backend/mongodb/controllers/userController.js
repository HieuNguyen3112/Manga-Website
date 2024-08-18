const User = require("../models/User");

const userController = {
    // Get the current logged-in user's information
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id, 'username email admin createdAt updatedAt');
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json("User not found");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get all users (admin access only)
    getAllUsers: async (req, res) => {
        try {
            if (req.user.admin) {
                const users = await User.find({}, 'username email admin createdAt updatedAt');
                res.status(200).json(users);
            } else {
                res.status(403).json("You do not have permission to access this resource.");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;
