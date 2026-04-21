const express = require("express");
const { signUp, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;
