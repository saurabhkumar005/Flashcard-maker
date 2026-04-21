const MASTERY_ORDER = {
  still_learning: 0,
  almost_there: 1,
  mastered: 2,
};

const clampText = (text, maxChars = 12000) => {
  if (!text || text.length <= maxChars) {
    return text;
  }

  return text.slice(0, maxChars);
};

const chunkText = (text, chunkSize = 5000) => {
  if (!text) return [];

  const paragraphs = text.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
  const chunks = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if ((currentChunk + "\n\n" + paragraph).length > chunkSize) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
      continue;
    }

    currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

const getMasteryProgress = (cards = []) => {
  if (!cards.length) {
    return 0;
  }

  const masteredCount = cards.filter((card) => card.masteryLevel === "mastered").length;
  return Math.round((masteredCount / cards.length) * 100);
};

const getNextReviewDate = (masteryLevel, baseDate = new Date()) => {
  const date = new Date(baseDate);
  const offsets = {
    still_learning: 1,
    almost_there: 3,
    mastered: 7,
  };

  const dayOffset = offsets[masteryLevel] ?? 1;
  date.setDate(date.getDate() + dayOffset);
  return date;
};

module.exports = {
  MASTERY_ORDER,
  clampText,
  chunkText,
  getMasteryProgress,
  getNextReviewDate,
};
