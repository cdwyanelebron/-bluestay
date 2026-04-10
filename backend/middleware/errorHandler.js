// Global Error Handler & Response Formatter
// File: /backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let data = null;

  // Handle specific error types
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    data = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate entry';
  } else if (statusCode === 500) {
    // Don't expose internal errors to client
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};

// Consistent response formatter for success
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Async error wrapper for controllers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, successResponse, asyncHandler };
