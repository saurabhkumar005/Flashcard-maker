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
const repairMalformedJson = (rawText) => {
  if (!rawText) return null;
  const fenced = stripCodeFence(rawText);
  const arrayMatch = fenced.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];
  const objectMatch = fenced.match(/\{[\s\S]*\}/);
  return objectMatch ? `[${objectMatch[0]}]` : null;
};

const generateFlashcardsFromText = async (text) => {
  if (!model || !client) {
    throw new Error("Gemini model is not initialized");
  }

  const prompt = `You are a high-quality teacher helping a student deeply understand material.
Create exactly 10 flashcards from the text.
For every card, include:
- question: targets edge cases or worked examples (avoid rote definitions)
- answer: concise but complete explanation
- teacherTip: a mnemonic or encouraging hint related to the concept
Return ONLY valid JSON in this exact format:
[{"question":"...","answer":"...","teacherTip":"..."}]

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
    const repaired = repairMalformedJson(content);
    if (!repaired) {
      throw new Error("Failed to parse Gemini response as JSON flashcards");
    }
    try {
      parsed = JSON.parse(repaired);
    } catch (repairError) {
      throw new Error("Failed to parse Gemini response as JSON flashcards");
    }
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
