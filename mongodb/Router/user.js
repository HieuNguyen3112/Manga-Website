const userController = require("../controllers/userController");

const router = require("express").Router();

//get all users
router.get("/", userController.getAllUser);

//delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;