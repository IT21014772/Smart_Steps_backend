const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/updateProfile", authMiddleware, updateUserProfile);
router.get("/users", getAllUsers);

module.exports = router;
