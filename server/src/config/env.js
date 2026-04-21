const required = ["PORT", "MONGODB_URI", "GEMINI_API_KEY", "CLIENT_URL"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  allowedOrigins: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:5173"],
  clientUrl: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",")[0] : "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "secretsaurabh1529",
};
