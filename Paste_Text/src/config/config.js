// Configuration file
module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLEANUP_INTERVAL: 60000, // 1 minute in milliseconds
  MAX_CONTENT_LENGTH: 1000000 // 1MB max content
};
