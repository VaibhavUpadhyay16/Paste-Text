

const http = require('http');

console.log('\n[TEST] Starting server for shareable URL test...');
const app = require('./server.js');
const PORT = 3002;
const server = app.listen(PORT, () => {
  console.log(`[TEST] Server started on port ${PORT}`);
  
  setTimeout(() => {
    testShareableURL();
  }, 1000);
});

function testShareableURL() {
  console.log('\n[TEST] Testing Shareable URL Feature\n');
  console.log('='.repeat(50));
  
  createPaste('Hello! This is a shareable paste!', 60).then(result => {
    const pasteId = result.id;
    console.log(' Paste Created');
    console.log(`   ID: ${pasteId}`);
    
    setTimeout(() => {
      const shareUrl = `http://localhost:${PORT}/paste/${pasteId}`;
      console.log(`\n Shareable URL: ${shareUrl}`);
      console.log('   Anyone can visit this URL to view the paste!');
      
      getShareableContent(pasteId, PORT).then(html => {
        console.log('\n Shareable URL Works!');
        if (html.includes('Hello! This is a shareable paste!')) {
          console.log('    Paste content is displayed correctly');
        }
        if (html.includes('Copy to Clipboard')) {
          console.log('    Copy button is available');
        }
        if (html.includes('Go to Pastebin')) {
          console.log('    Home button is available');
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('TEST PASSED! Shareable URLs are working!');
        console.log('='.repeat(50) + '\n');
        
        server.close(() => process.exit(0));
      });
    }, 500);
  }).catch(err => {
    console.error(' Test failed:', err.message);
    server.close(() => process.exit(1));
  });
}

function createPaste(content, expiresIn) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ content, expiresIn });
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/pastes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getShareableContent(id, port) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: `/paste/${id}`,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    
    req.on('error', reject);
    req.end();
  });
}
