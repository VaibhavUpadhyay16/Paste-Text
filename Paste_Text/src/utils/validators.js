
const { v4: uuidv4 } = require('uuid');

/**

 * @returns {string} 8-character ID
 */
function generateId() {
  return uuidv4().substring(0, 8);
}

/**

 * @param {string} content - Content to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} {valid, error}
 */
function validateContent(content, maxLength) {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content must be a string' };
  }

  if (content.trim() === '') {
    return { valid: false, error: 'Content cannot be empty' };
  }

  if (content.length > maxLength) {
    return { valid: false, error: `Content exceeds maximum length of ${maxLength} characters` };
  }

  return { valid: true, error: null };
}

/**

 * @param {string|number} expiresIn - Expiration in minutes
 * @returns {object} {valid, error, timestamp}
 */
function validateExpiration(expiresIn) {
  if (!expiresIn) {
    return { valid: true, error: null, timestamp: null };
  }

  const minutes = parseInt(expiresIn, 10);

  if (isNaN(minutes) || minutes <= 0) {
    return { valid: false, error: 'Expiration must be a positive number (in minutes)', timestamp: null };
  }

  if (minutes > 525600) { // More than 1 year
    return { valid: false, error: 'Expiration cannot exceed 1 year', timestamp: null };
  }

  const timestamp = Date.now() + minutes * 60 * 1000;
  return { valid: true, error: null, timestamp };
}

/**

 * @param {number} timestamp - Milliseconds timestamp
 * @returns {string} ISO string or null
 */
function formatDate(timestamp) {
  return timestamp ? new Date(timestamp).toISOString() : null;
}

module.exports = {
  generateId,
  validateContent,
  validateExpiration,
  formatDate
};
