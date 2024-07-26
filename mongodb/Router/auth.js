const authController = require("../controllers/authController");

const router = require("express").Router();

//register
router.post("/register", authController.registerUser);

//login
router.post("/login", authController.registerUser);

module.exports = router;