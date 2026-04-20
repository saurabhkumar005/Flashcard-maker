const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const { port, mongoUri, geminiApiKey, clientUrl } = require("./src/config/env");
const connectDB = require("./src/config/db");
const { initGemini } = require("./src/services/geminiService");
const app = require("./src/app");

const start = async () => {
  await connectDB(mongoUri);
  initGemini(geminiApiKey);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS allowed origin: ${clientUrl}`);
  });
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
});

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
