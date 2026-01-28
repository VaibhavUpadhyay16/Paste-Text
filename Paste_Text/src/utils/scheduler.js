
const storage = require('../models/PasteStorage');
const config = require('../config/config');

let cleanupInterval = null;

function startCleanup() {
  cleanupInterval = setInterval(() => {
    const deleted = storage.cleanupExpired();
    if (deleted > 0) {
      console.log(`[Auto-cleanup] Removed ${deleted} expired paste(s)`);
    }
  }, config.CLEANUP_INTERVAL);

  console.log(`[Cleanup] Started with interval: ${config.CLEANUP_INTERVAL}ms`);
}

function stopCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    console.log('[Cleanup] Stopped');
  }
}

module.exports = {
  startCleanup,
  stopCleanup
};
