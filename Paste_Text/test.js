
const http = require('http');

console.log('\n[TEST] Starting server...');
const app = require('./server.js');
const PORT = 3001; 
const server = app.listen(PORT, () => {
  console.log(`[TEST] Server started on port ${PORT}`);
  
  setTimeout(() => {
    testAPI();
  }, 1000);
});

function testAPI() {
  console.log('\n[TEST] Testing API endpoints...\n');
  
  createPaste('Hello from modular test!', 30).then(result => {
    console.log(' CREATE PASTE: Success');
    console.log('   ID:', result.id);
    console.log('   Message:', result.message);
    const pasteId = result.id;
    

    setTimeout(() => {
      getPaste(pasteId).then(paste => {
        console.log('\n RETRIEVE PASTE: Success');
        console.log('   Content:', paste.content.substring(0, 50) + '...');
        console.log('   Created:', paste.createdAt);
        
     
        setTimeout(() => {
          getAllPastes().then(data => {
            console.log('\n LIST ALL PASTES: Success');
            console.log('   Total pastes:', data.total);
            
        
            setTimeout(() => {
              deletePaste(pasteId).then(() => {
                console.log('\n DELETE PASTE: Success');
                console.log('\n' + '='.repeat(50));
                console.log('ALL TESTS PASSED!');
                console.log('='.repeat(50) + '\n');
                
                server.close(() => {
                  process.exit(0);
                });
              });
            }, 500);
          });
        }, 500);
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
      port: 3000,
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

function getPaste(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/pastes/${id}`,
      method: 'GET'
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
    req.end();
  });
}

function getAllPastes() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pastes',
      method: 'GET'
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
    req.end();
  });
}

function deletePaste(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/pastes/${id}`,
      method: 'DELETE'
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
    req.end();
  });
}
