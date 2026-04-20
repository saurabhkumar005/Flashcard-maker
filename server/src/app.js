const express = require("express");
const cors = require("cors");
const deckRoutes = require("./routes/deckRoutes");
const masteryRoutes = require("./routes/masteryRoutes");
const { clientUrl } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: clientUrl }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "flashcard-maker-api" });
});

app.use("/api/decks", deckRoutes);
app.use("/api/mastery", masteryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
