
const storage = require('../models/PasteStorage');
const { generateId, validateContent, validateExpiration, formatDate } = require('../utils/validators');
const config = require('../config/config');

function createPaste(req, res) {
  const { content, expiresIn } = req.body;

  const contentValidation = validateContent(content, config.MAX_CONTENT_LENGTH);
  if (!contentValidation.valid) {
    return res.status(400).json({ error: contentValidation.error });
  }

  const expirationValidation = validateExpiration(expiresIn);
  if (!expirationValidation.valid) {
    return res.status(400).json({ error: expirationValidation.error });
  }

  const id = generateId();
  const expiresAt = expirationValidation.timestamp;

  storage.create(id, content.trim(), expiresAt);

  console.log(`[New paste] ID: ${id}, Expires: ${expiresAt ? new Date(expiresAt).toISOString() : 'Never'}`);

  res.status(201).json({
    success: true,
    id,
    message: 'Paste created successfully',
    expiresAt: formatDate(expiresAt)
  });
}


function getPaste(req, res) {
  const { id } = req.params;

  const check = storage.checkPaste(id);

  if (!check.exists) {
    return res.status(404).json({ error: 'Paste not found' });
  }

  if (check.expired) {
    return res.status(410).json({ error: 'Paste has expired' });
  }

  const paste = check.paste;
  res.json({
    id,
    content: paste.content,
    createdAt: paste.createdAt,
    expiresAt: formatDate(paste.expiresAt)
  });
}

function deletePaste(req, res) {
  const { id } = req.params;

  const paste = storage.getById(id);
  if (!paste) {
    return res.status(404).json({ error: 'Paste not found' });
  }

  storage.delete(id);
  console.log(`[Deleted] Paste ${id}`);

  res.json({
    success: true,
    message: 'Paste deleted successfully'
  });
}

function getAllPastes(req, res) {
  const pastes = storage.getAll();

  res.json({
    total: pastes.length,
    pastes
  });
}

function viewPaste(req, res) {
  const { id } = req.params;

  const check = storage.checkPaste(id);

  if (!check.exists) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paste Not Found</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
          h1 { color: #ff6b6b; }
          p { color: #666; }
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>Paste Not Found</h1>
        <p>The paste you're looking for doesn't exist or has been deleted.</p>
        <a href="/">← Go back to Pastebin</a>
      </body>
      </html>
    `);
  }

  if (check.expired) {
    return res.status(410).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paste Expired</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
          h1 { color: #ff9800; }
          p { color: #666; }
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1> Paste Expired</h1>
        <p>This paste has expired and is no longer available.</p>
        <a href="/">← Create a new paste</a>
      </body>
      </html>
    `);
  }

  const paste = check.paste;
  const expiresText = paste.expiresAt 
    ? `Expires: ${new Date(paste.expiresAt).toLocaleString()}` 
    : 'No expiration';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paste - Pastebin Lite</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        header h1 { font-size: 2em; margin-bottom: 10px; }
        header p { opacity: 0.9; }
        .content {
          padding: 30px;
        }
        .paste-info {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .paste-info small {
          color: #666;
          font-size: 0.9em;
        }
        .paste-content {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 20px;
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
          line-height: 1.6;
          font-family: 'Courier New', monospace;
          font-size: 0.95em;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .buttons {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        button, a {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-block;
        }
        .btn-copy {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .btn-copy:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .btn-home {
          background: #f0f0f0;
          color: #333;
          border: 2px solid #ddd;
        }
        .btn-home:hover {
          background: #e0e0e0;
        }
        .copy-status {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
          display: none;
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          color: #666;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1> Paste View</h1>
          <p>Shared Content</p>
        </header>
        <div class="content">
          <div class="paste-info">
            <small><strong>Created:</strong> ${new Date(paste.createdAt).toLocaleString()}</small>
            <small><strong>${expiresText}</strong></small>
          </div>
          <div class="paste-content">${escapeHtml(paste.content)}</div>
          <div class="buttons">
            <button class="btn-copy" onclick="copyToClipboard()"> Copy to Clipboard</button>
            <a href="/" class="btn-home">Go to Pastebin</a>
          </div>
          <div class="copy-status" id="copyStatus"> Copied to clipboard!</div>
        </div>
        <footer>
          <p>&copy; 2025 Pastebin Lite | Simple & Fast Text Sharing</p>
        </footer>
      </div>

      <script>
        function copyToClipboard() {
          const content = document.querySelector('.paste-content').textContent;
          navigator.clipboard.writeText(content).then(() => {
            const status = document.getElementById('copyStatus');
            status.style.display = 'block';
            setTimeout(() => {
              status.style.display = 'none';
            }, 3000);
          }).catch(() => {
            alert('Failed to copy to clipboard');
          });
        }
      </script>
    </body>
    </html>
  `);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = {
  createPaste,
  getPaste,
  deletePaste,
  getAllPastes,
  viewPaste
};
