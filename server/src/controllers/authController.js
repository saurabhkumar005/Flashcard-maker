const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

const buildToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "dev_secret_change_me", { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  dailyGoal: user.dailyGoal,
});

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    const error = new Error("Name, valid email, and password (min 6 chars) are required");
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  res.status(201).json({
    token: buildToken(user._id.toString()),
    user: sanitizeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    token: buildToken(user._id.toString()),
    user: sanitizeUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = {
  signUp,
  login,
  me,
};
