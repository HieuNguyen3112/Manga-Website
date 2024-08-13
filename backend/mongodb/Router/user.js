const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

// Get the current user's information
router.get('/me', middlewareController.verifyToken, userController.getCurrentUser);

// Get all users (Admin only)
router.get('/', middlewareController.verifyTokenAndAdminAuth, userController.getAllUsers);

//delete user
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;