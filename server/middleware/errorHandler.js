/**
 * Centralized Error Handling Middleware
 */

function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      path: req.originalUrl
    }
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      message: `Resource not found at ${req.originalUrl}`,
      status: 404
    }
  });
}

module.exports = { errorHandler, notFoundHandler };
