const express = require("express");
const upload = require("../middleware/upload");
const { createDeckFromPdf, getDecks, getDeckById } = require("../controllers/deckController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getDecks);
router.post("/upload", protect, upload.single("pdf"), createDeckFromPdf);
router.get("/:deckId", protect, getDeckById);

module.exports = router;
