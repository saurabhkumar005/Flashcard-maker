const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    teacherTip: { type: String, default: "" },
    masteryLevel: {
      type: String,
      enum: ["still_learning", "almost_there", "mastered"],
      default: "still_learning",
    },
  },
  { _id: true }
);

const deckSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    sourceFileName: { type: String, required: true },
    cards: { type: [flashcardSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deck", deckSchema);
