const User = require("../models/User");

const userController = {
    // Get the current logged-in user's information
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id, 'username email admin createdAt updatedAt favoriteComics');
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
                const users = await User.find({}, 'username email admin createdAt updatedAt favoriteComics');
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
    },

    // Add a comic to favorites
    addToFavorites: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                const existingFavorite = user.favoriteComics.find(favorite => favorite.comicId.equals(req.body.comicId));
                if (!existingFavorite) {
                    user.favoriteComics.push({ comicId: req.body.comicId });
                    await user.save();
                    res.status(200).json("Added to favorites successfully!");
                } else {
                    res.status(400).json("Comic is already in favorites.");
                }
            } else {
                res.status(404).json("User not found.");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a comic from favorites
    removeFromFavorites: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                user.favoriteComics = user.favoriteComics.filter(favorite => !favorite.comicId.equals(req.body.comicId));
                await user.save();
                res.status(200).json("Removed from favorites successfully!");
            } else {
                res.status(404).json("User not found.");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get user's favorite comics
    getFavorites: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy userId từ middleware xác thực
            const user = await User.findById(userId).populate('favoriteComics');
            if (user) {
                res.status(200).json(user.favoriteComics);
            } else {
                res.status(404).json("User not found.");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;
