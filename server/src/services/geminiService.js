const { GoogleGenerativeAI } = require("@google/generative-ai");

let client;
let model;
let modelIndex = 0;
const MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

const initGemini = (apiKey) => {
  client = new GoogleGenerativeAI(apiKey);
  modelIndex = 0;
  model = client.getGenerativeModel({ model: MODEL_CANDIDATES[modelIndex] });
};

const stripCodeFence = (rawText) => rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
const canRetryWithDifferentModel = (message) =>
  /not found|not supported for generateContent|service unavailable|high demand|429/i.test(message || "");

const generateFlashcardsFromText = async (text) => {
  if (!model || !client) {
    throw new Error("Gemini model is not initialized");
  }

  const prompt = `You are a high-quality teacher helping a student deeply understand material.
Analyze this text. Create 10 flashcards that focus on key concepts, edge cases, and worked examples. Do not just provide simple definitions.
Return exactly in JSON format: [{"question":"...","answer":"..."}]

TEXT START
${text}
TEXT END`;

  let content;
  let lastError;
  for (let offset = 0; offset < MODEL_CANDIDATES.length; offset += 1) {
    const candidateIndex = (modelIndex + offset) % MODEL_CANDIDATES.length;
    const candidateModel = MODEL_CANDIDATES[candidateIndex];

    try {
      model = client.getGenerativeModel({ model: candidateModel });
      const response = await model.generateContent(prompt);
      modelIndex = candidateIndex;
      content = response.response.text();
      break;
    } catch (error) {
      lastError = error;
      if (!canRetryWithDifferentModel(error.message) || offset === MODEL_CANDIDATES.length - 1) {
        throw error;
      }
    }
  }

  if (!content && lastError) {
    throw lastError;
  }

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFence(content));
  } catch (error) {
    throw new Error("Failed to parse Gemini response as JSON flashcards");
  }

  const validCards = Array.isArray(parsed)
    ? parsed.filter((card) => card?.question && card?.answer).slice(0, 10)
    : [];

  if (!validCards.length) {
    throw new Error("Gemini did not return any valid flashcards");
  }

  return validCards;
};

module.exports = {
  initGemini,
  generateFlashcardsFromText,
};
