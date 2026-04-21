const Deck = require("../models/Deck");
const Mastery = require("../models/Mastery");
const asyncHandler = require("../middleware/asyncHandler");
const { getMasteryProgress, getNextReviewDate } = require("../utils/studyUtils");
const VALID_LEVELS = ["still_learning", "almost_there", "mastered"];

const getTodayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const updateCardMastery = asyncHandler(async (req, res) => {
  const { deckId, cardId } = req.params;
  const { masteryLevel } = req.body;

  if (!VALID_LEVELS.includes(masteryLevel)) {
    const error = new Error("Invalid mastery level provided");
    error.statusCode = 400;
    throw error;
  }

  const deck = await Deck.findOne({ _id: deckId, userId: req.user._id });
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

  let mastery = await Mastery.findOne({ userId: req.user._id, deckId });
  if (!mastery) {
    mastery = await Mastery.create({ userId: req.user._id, deckId, cardStatuses: {} });
  }

  const now = new Date();
  const statusEntry = {
    masteryLevel,
    nextReviewDate: getNextReviewDate(masteryLevel, now),
    lastReviewedAt: now,
  };

  mastery.cardStatuses.set(cardId, statusEntry);
  mastery.masteredCount = deck.cards.filter((item) => item.masteryLevel === "mastered").length;
  mastery.progressPercent = getMasteryProgress(deck.cards);
  await mastery.save();

  const todayKey = getTodayKey(now);
  const dailyReview = req.user.dailyReview || { date: "", count: 0 };
  const nextCount = dailyReview.date === todayKey ? dailyReview.count + 1 : 1;
  req.user.dailyReview = { date: todayKey, count: nextCount };
  await req.user.save();

  res.json({
    cardId,
    masteryLevel,
    nextReviewDate: statusEntry.nextReviewDate,
    progressPercent: mastery.progressPercent,
    masteredCount: mastery.masteredCount,
    reviewedToday: nextCount,
    dailyGoal: req.user.dailyGoal,
  });
});

const getDailyGoalStats = asyncHandler(async (req, res) => {
  const todayKey = getTodayKey();
  const reviewedToday = req.user.dailyReview?.date === todayKey ? req.user.dailyReview.count : 0;
  res.json({
    reviewedToday,
    dailyGoal: req.user.dailyGoal,
  });
});

module.exports = {
  updateCardMastery,
  getDailyGoalStats,
};
