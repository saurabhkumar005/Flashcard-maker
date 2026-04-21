import api from "./client";

export const uploadDeckPdf = async ({ file, title }) => {
  const payload = new FormData();
  payload.append("pdf", file);
  if (title?.trim()) payload.append("title", title.trim());

  const { data } = await api.post("/decks/upload", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getDecks = async () => {
  const { data } = await api.get("decks");
  return data;
};

export const getDeckById = async (deckId) => {
  const { data } = await api.get(`decks/${deckId}`);
  return data;
};

export const updateMastery = async ({ deckId, cardId, masteryLevel }) => {
  const { data } = await api.patch(`mastery/${deckId}/cards/${cardId}`, {
    masteryLevel,
  });
  return data;
};

export const getDailyGoalStats = async () => {
  const { data } = await api.get("mastery/daily-goal");
  return data;
};
