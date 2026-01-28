
class PasteStorage {
  constructor() {
    this.pastes = new Map();
  }

  /**
   
   * @param {string} id - Unique paste ID
   * @param {string} content - Paste content
   * @param {number|null} expiresAt - Expiration timestamp
   */
  create(id, content, expiresAt) {
    this.pastes.set(id, {
      content,
      createdAt: new Date().toISOString(),
      expiresAt
    });
    return { id, createdAt: this.pastes.get(id).createdAt, expiresAt };
  }

  /**
 
   * @param {string} id - Paste ID
   * @returns {object|null} Paste object or null
   */
  getById(id) {
    return this.pastes.get(id) || null;
  }

  /**
   
   * @param {string} id - Paste ID
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    return this.pastes.delete(id);
  }

  /**
   
   * @returns {array} Array of paste objects with IDs
   */
  getAll() {
    const all = [];
    for (let [id, paste] of this.pastes.entries()) {
      all.push({
        id,
        createdAt: paste.createdAt,
        expiresAt: paste.expiresAt,
        contentLength: paste.content.length
      });
    }
    return all;
  }

  /**

   * @returns {number} Number of pastes deleted
   */
  cleanupExpired() {
    const now = Date.now();
    let deletedCount = 0;

    for (let [id, paste] of this.pastes.entries()) {
      if (paste.expiresAt && paste.expiresAt < now) {
        this.pastes.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
  
   * @param {string} id - Paste ID
   * @returns {object} {exists, expired, paste}
   */
  checkPaste(id) {
    const paste = this.pastes.get(id);

    if (!paste) {
      return { exists: false, expired: false, paste: null };
    }

    const isExpired = paste.expiresAt && paste.expiresAt < Date.now();

    if (isExpired) {
      this.pastes.delete(id);
      return { exists: true, expired: true, paste: null };
    }

    return { exists: true, expired: false, paste };
  }

  /**
   
   * @returns {number} Total pastes
   */
  count() {
    return this.pastes.size;
  }
}

const storage = new PasteStorage();

module.exports = storage;
