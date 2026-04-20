const Deck = require("../models/Deck");
const Mastery = require("../models/Mastery");
const asyncHandler = require("../middleware/asyncHandler");
const { getMasteryProgress } = require("../utils/studyUtils");

const DEFAULT_USER = "anonymous";
const VALID_LEVELS = ["still_learning", "almost_there", "mastered"];

const updateCardMastery = asyncHandler(async (req, res) => {
  const { deckId, cardId } = req.params;
  const { masteryLevel } = req.body;

  if (!VALID_LEVELS.includes(masteryLevel)) {
    const error = new Error("Invalid mastery level provided");
    error.statusCode = 400;
    throw error;
  }

  const deck = await Deck.findById(deckId);
  if (!deck) {
    const error = new Error("Deck not found");
    error.statusCode = 404;
    throw error;
  }

  const card = deck.cards.id(cardId);
  if (!card) {
    const error = new Error("Card not found");
    error.statusCode = 404;
    throw error;
  }

  card.masteryLevel = masteryLevel;
  await deck.save();

  let mastery = await Mastery.findOne({ userId: DEFAULT_USER, deckId });
  if (!mastery) {
    mastery = await Mastery.create({ userId: DEFAULT_USER, deckId, cardStatuses: {} });
  }

  mastery.cardStatuses.set(cardId, masteryLevel);
  mastery.masteredCount = deck.cards.filter((item) => item.masteryLevel === "mastered").length;
  mastery.progressPercent = getMasteryProgress(deck.cards);
  await mastery.save();

  res.json({
    cardId,
    masteryLevel,
    progressPercent: mastery.progressPercent,
    masteredCount: mastery.masteredCount,
  });
});

module.exports = {
  updateCardMastery,
};
