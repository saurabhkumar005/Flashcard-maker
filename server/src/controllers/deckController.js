const pdfParse = require("pdf-parse");
const Deck = require("../models/Deck");
const Mastery = require("../models/Mastery");
const { generateFlashcardsFromText } = require("../services/geminiService");
const asyncHandler = require("../middleware/asyncHandler");
const { chunkText, clampText, getMasteryProgress } = require("../utils/studyUtils");

const DEFAULT_USER = "anonymous";

const extractPdfText = async (buffer) => {
  try {
    // pdf-parse v1 exports a function, while v2 exports { PDFParse }.
    if (typeof pdfParse === "function") {
      const parsed = await pdfParse(buffer);
      return parsed.text || "";
    }

    if (typeof pdfParse?.PDFParse === "function") {
      const parser = new pdfParse.PDFParse({ data: buffer });
      try {
        const parsed = await parser.getText();
        return parsed.text || "";
      } finally {
        await parser.destroy();
      }
    }

    throw new Error("PDF parsing library failed to load correctly.");
  } catch (err) {
    console.error("PDF extraction error:", err);
    throw err;
  }
};

const buildAiInput = (rawText) => {
  const chunks = chunkText(rawText, 4000);
  const selected = chunks.slice(0, 3).join("\n\n");
  return clampText(selected || rawText, 12000);
};

const createDeckFromPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload a PDF file");
    error.statusCode = 400;
    throw error;
  }

  const extractedText = await extractPdfText(req.file.buffer);
  if (!extractedText.trim()) {
    const error = new Error("No readable text was found in the PDF");
    error.statusCode = 400;
    throw error;
  }

  const aiInput = buildAiInput(extractedText);
  const cards = await generateFlashcardsFromText(aiInput);

  const normalizedCards = cards.map((card) => ({
    question: card.question.trim(),
    answer: card.answer.trim(),
    masteryLevel: "still_learning",
  }));

  const deck = await Deck.create({
    title: req.body.title?.trim() || req.file.originalname.replace(/\.pdf$/i, ""),
    sourceFileName: req.file.originalname,
    cards: normalizedCards,
  });

  const cardStatuses = {};
  deck.cards.forEach((card) => {
    cardStatuses[card._id.toString()] = "still_learning";
  });

  await Mastery.create({
    userId: DEFAULT_USER,
    deckId: deck._id,
    cardStatuses,
    masteredCount: 0,
    progressPercent: 0,
  });

  res.status(201).json({
    deck,
    progressPercent: getMasteryProgress(deck.cards),
  });
});

const getDecks = asyncHandler(async (req, res) => {
  const decks = await Deck.find().sort({ createdAt: -1 }).lean();

  const payload = decks.map((deck) => ({
    _id: deck._id,
    title: deck.title,
    sourceFileName: deck.sourceFileName,
    totalCards: deck.cards.length,
    progressPercent: getMasteryProgress(deck.cards),
    createdAt: deck.createdAt,
  }));

  res.json(payload);
});

const getDeckById = asyncHandler(async (req, res) => {
  const deck = await Deck.findById(req.params.deckId);
  if (!deck) {
    const error = new Error("Deck not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({
    deck,
    progressPercent: getMasteryProgress(deck.cards),
  });
});

module.exports = {
  createDeckFromPdf,
  getDecks,
  getDeckById,
};
