const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;

  // Multer throws plain errors for file validation/size issues.
  if (error.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
  }
  if (error.message === "Only PDF files are supported") {
    statusCode = 400;
  }

  console.error("Request failed", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: error.message,
    stack: error.stack,
  });

  res.status(statusCode).json({
    message: error.message || "Server error",
    statusCode,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
