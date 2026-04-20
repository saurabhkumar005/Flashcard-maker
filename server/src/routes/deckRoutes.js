const express = require("express");
const upload = require("../middleware/upload");
const { createDeckFromPdf, getDecks, getDeckById } = require("../controllers/deckController");

const router = express.Router();

router.get("/", getDecks);
router.post("/upload", upload.single("pdf"), createDeckFromPdf);
router.get("/:deckId", getDeckById);

module.exports = router;
