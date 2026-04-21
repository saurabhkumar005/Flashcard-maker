const mongoose = require("mongoose");

const cardStatusSchema = new mongoose.Schema(
  {
    masteryLevel: {
      type: String,
      enum: ["still_learning", "almost_there", "mastered"],
      default: "still_learning",
    },
    nextReviewDate: { type: Date, required: true },
    lastReviewedAt: { type: Date, default: null },
  },
  { _id: false }
);

const masterySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true },
    cardStatuses: {
      type: Map,
      of: cardStatusSchema,
      default: {},
    },
    masteredCount: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

masterySchema.index({ userId: 1, deckId: 1 }, { unique: true });

module.exports = mongoose.model("Mastery", masterySchema);
