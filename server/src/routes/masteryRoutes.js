const express = require("express");
const { updateCardMastery, getDailyGoalStats } = require("../controllers/masteryController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.patch("/:deckId/cards/:cardId", protect, updateCardMastery);
router.get("/daily-goal", protect, getDailyGoalStats);

module.exports = router;
