const mongoose = require("mongoose");

const masterySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true },
    cardStatuses: {
      type: Map,
      of: {
        type: String,
        enum: ["still_learning", "almost_there", "mastered"],
        default: "still_learning",
      },
      default: {},
    },
    masteredCount: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

masterySchema.index({ userId: 1, deckId: 1 }, { unique: true });

module.exports = mongoose.model("Mastery", masterySchema);
