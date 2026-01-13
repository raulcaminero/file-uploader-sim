// Centralized error handling middleware
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error'
    });
  }

  // Database errors
  if (err.code && err.code.startsWith('SQLITE')) {
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

// Middleware to handle routes not found
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}
