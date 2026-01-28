
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}


function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
}
function loggingMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
}

module.exports = {
  errorHandler,
  notFoundHandler,
  loggingMiddleware
};
