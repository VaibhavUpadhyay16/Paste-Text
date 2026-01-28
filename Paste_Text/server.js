
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./src/config/config');

const pasteRoutes = require('./src/routes/pasteRoutes');

const { errorHandler, notFoundHandler, loggingMiddleware } = require('./src/middleware/errorHandler');

const { startCleanup, stopCleanup } = require('./src/utils/scheduler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(loggingMiddleware);

app.use(express.static('public'));


const pasteController = require('./src/controllers/pasteController');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/paste/:id', pasteController.viewPaste);

app.get('/api/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Pastebin Lite API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

app.use('/api/pastes', pasteRoutes);

app.use(notFoundHandler);

app.use(errorHandler);
const server = app.listen(config.PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     Pastebin-Lite Server Started       ║
╠════════════════════════════════════════╣
║  Environment: ${config.NODE_ENV.padEnd(33)}║
║  Server: http://localhost:${config.PORT.toString().padEnd(28)}║
║  Press CTRL+C to stop the server       ║
╚════════════════════════════════════════╝
  `);

  startCleanup();
});

process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down gracefully...');
  stopCleanup();
  server.close(() => {
    console.log('[Server] Closed');
    process.exit(0);
  });
});

module.exports = app;
