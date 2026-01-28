# Pastebin Lite - Node.js Application

A simple, fully functional Pastebin-like web application built with Node.js and Express.

## Features

✅ **Create Pastes** - Share text content with optional expiration  
✅ **Retrieve Pastes** - Access pastes by their unique ID  
✅ **Shareable URLs** - Direct link to view paste (e.g., `/paste/abc123`)  
✅ **Delete Pastes** - Remove pastes manually  
✅ **Auto-Expiration** - Pastes can expire after a specified time  
✅ **View All Pastes** - List all active pastes with their metadata  
✅ **Simple UI** - Clean, responsive web interface  
✅ **REST API** - Full REST API for programmatic access  

## Project Structure

```
Paste_Text/
├── server.js              # Main Express server
├── package.json           # Node.js dependencies
├── public/
│   ├── index.html        # Web UI
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
└── README.md             # This file
```

## Installation

### Prerequisites
- **Node.js** (v14 or higher) - Download from https://nodejs.org/

### Setup Steps

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\royal\OneDrive\Desktop\Paste-Text-Code\Paste_Text"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open your web browser and go to: **http://localhost:3000**

## Usage

### Web Interface

#### Create a New Paste
1. Enter your text content in the textarea
2. (Optional) Specify expiration time in minutes
3. Click "Create Paste"
4. **Get a shareable link** to send to others
5. Copy the link with one button click

#### View Paste from Shareable Link
1. Receive a link like: `http://localhost:3000/paste/abc12345`
2. Click the link
3. View the paste in a formatted page
4. Copy content with one button
5. See creation time and expiration status

#### Retrieve a Paste by ID (Advanced)
1. Enter a paste ID in the "Paste ID" field
2. Click "Get Paste"
3. View the content, creation time, and expiration info
4. (Optional) Delete the paste

#### View All Pastes
1. Click "View All Pastes" button
2. See a list of all active pastes with metadata

### REST API

#### Create a Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "Your paste content here",
  "expiresIn": 60  // Optional: minutes until expiration
}

Response (201):
{
  "success": true,
  "id": "abc12345",
  "message": "Paste created successfully",
  "expiresAt": "2025-01-28T15:30:00.000Z" // null if no expiration
}
```

#### Retrieve a Paste
```
GET /api/pastes/:id

Response (200):
{
  "id": "abc12345",
  "content": "Your paste content here",
  "createdAt": "2025-01-28T14:30:00.000Z",
  "expiresAt": "2025-01-28T15:30:00.000Z" // null if no expiration
}
```

#### Delete a Paste
```
DELETE /api/pastes/:id

Response (200):
{
  "success": true,
  "message": "Paste deleted successfully"
}
```

#### List All Pastes
```
GET /api/pastes

Response (200):
{
  "total": 5,
  "pastes": [
    {
      "id": "abc12345",
      "createdAt": "2025-01-28T14:30:00.000Z",
      "expiresAt": "2025-01-28T15:30:00.000Z",
      "contentLength": 150
    }
    // ... more pastes
  ]
}
```

## Example Usage with cURL

```bash
# Create a paste
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World", "expiresIn": 30}'

# Retrieve a paste (replace 'abc12345' with actual ID)
curl http://localhost:3000/api/pastes/abc12345

# Delete a paste
curl -X DELETE http://localhost:3000/api/pastes/abc12345

# List all pastes
curl http://localhost:3000/api/pastes
```

## Technical Details

### Database
- In-memory storage using JavaScript `Map`
- Data is lost when server restarts
- Automatic cleanup of expired pastes every 60 seconds

### Expiration
- Optional expiration time specified in minutes
- Expired pastes return HTTP 410 (Gone)
- Automatic deletion every minute

### Error Handling
- Comprehensive error messages
- Proper HTTP status codes (201, 400, 404, 410, 500)
- Input validation for all requests

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Modern UI with gradient design
- Smooth interactions and animations

## Dependencies

- **express** - Web framework
- **body-parser** - Middleware for parsing request bodies
- **uuid** - For generating unique paste IDs

## Stopping the Server

Press **CTRL+C** in the terminal where the server is running.

## Troubleshooting

### Port 3000 already in use
If port 3000 is already in use, you can modify the PORT variable in `server.js`:
```javascript
const PORT = 3001; // or any other available port
```

### npm command not found
Make sure Node.js is installed correctly. Verify with:
```bash
node --version
npm --version
```

### CORS Issues
If accessing from a different domain, add CORS headers to `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

## License
This is a sample project for educational purposes.

## Support
For issues or questions, refer to the assignment PDF or consult the source code comments.
