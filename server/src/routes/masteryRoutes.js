const express = require("express");
const { updateCardMastery } = require("../controllers/masteryController");

const router = express.Router();

router.patch("/:deckId/cards/:cardId", updateCardMastery);

module.exports = router;
