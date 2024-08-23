const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

// Get the current user's information
router.get('/me', middlewareController.verifyToken, userController.getCurrentUser);

// Get all users (Admin only)
router.get('/', middlewareController.verifyTokenAndAdminAuth, userController.getAllUsers);

//delete user
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

// Thêm truyện vào danh sách yêu thích
router.post("/favorites/add", middlewareController.verifyToken, userController.addToFavorites);

// Xóa truyện khỏi danh sách yêu thích
router.post("/favorites/remove", middlewareController.verifyToken, userController.removeFromFavorites);

// Lấy danh sách truyện yêu thích của người dùng
router.get("/favorites", middlewareController.verifyToken, userController.getFavorites);

module.exports = router;