
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(errors.length > 0 && { errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export default errorHandler;
