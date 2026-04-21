const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      const error = new Error("Unauthorized: missing token");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      const error = new Error("Unauthorized: user not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
      err.message = "Unauthorized: invalid token";
    }
    next(err);
  }
};

module.exports = { protect };
