const createForm = document.getElementById('createForm');
const retrieveForm = document.getElementById('retrieveForm');
const createResultDiv = document.getElementById('createResult');
const retrieveResultDiv = document.getElementById('retrieveResult');
const retrievedContentDiv = document.getElementById('retrievedContent');
const pasteContentDisplay = document.getElementById('pasteContentDisplay');
const createdAtDisplay = document.getElementById('createdAtDisplay');
const expiresAtDisplay = document.getElementById('expiresAtDisplay');
const deleteBtn = document.getElementById('deleteBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const allPastesResultDiv = document.getElementById('allPastesResult');

let currentPasteId = null;

function showMessage(element, message, type = 'info') {
  let bgColor = 'bg-blue-50 border-blue-300 text-blue-800';
  let icon = '';
  
  if (type === 'success') {
    bgColor = 'bg-green-50 border-green-300 text-green-800';
    icon = '';
  } else if (type === 'error') {
    bgColor = 'bg-red-50 border-red-300 text-red-800';
    icon = '';
  }
  
  element.innerHTML = `<div class="p-4 border-l-4 rounded ${bgColor}">${icon} ${message}</div>`;
  element.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

function clearMessage(element) {
  element.innerHTML = '';
  element.style.display = 'none';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const content = document.getElementById('pasteContent').value;
  const expiresIn = document.getElementById('expiresIn').value;

  try {
    clearMessage(createResultDiv);

    const payload = { content };
    if (expiresIn) {
      payload.expiresIn = expiresIn;
    }

    const response = await fetch('/api/pastes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create paste');
    }

    const expiresText = data.expiresAt 
      ? `\nExpires: ${formatDate(data.expiresAt)}` 
      : '\nNo expiration set';
    
    const shareLink = `${window.location.origin}/paste/${data.id}`;
    
    const resultHTML = `
      <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded space-y-3">
        <p><strong> Paste created!</strong></p>
        <p><strong>ID:</strong> <code class="bg-gray-200 px-2 py-1 rounded font-mono">${data.id}</code></p>
        <p><strong>Shareable Link:</strong></p>
        <div class="bg-gray-100 p-3 rounded border border-gray-300">
          <code class="text-blue-600 font-mono text-sm break-all">${shareLink}</code>
        </div>
        <button onclick="copyShareLink('${shareLink}')" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all">
           Copy Link
        </button>
        <p class="text-gray-600 text-sm">${expiresText}</p>
      </div>
    `;
    
    createResultDiv.innerHTML = resultHTML;
    createResultDiv.style.display = 'block';

    
    createForm.reset();
  } catch (error) {
    showMessage(createResultDiv, `Error: ${error.message}`, 'error');
  }
});

function copyShareLink(link) {
  navigator.clipboard.writeText(link).then(() => {
    alert(' Link copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy link');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

retrieveForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pasteId = document.getElementById('pasteId').value.trim();

  try {
    clearMessage(retrieveResultDiv);
    retrievedContentDiv.style.display = 'none';

    const response = await fetch(`/api/pastes/${pasteId}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Paste not found');
      } else if (response.status === 410) {
        throw new Error('Paste has expired and is no longer available');
      }
      throw new Error(data.error || 'Failed to retrieve paste');
    }

    currentPasteId = pasteId;
    pasteContentDisplay.textContent = data.content;
    createdAtDisplay.textContent = formatDate(data.createdAt);
    expiresAtDisplay.textContent = data.expiresAt 
      ? formatDate(data.expiresAt) 
      : 'Never';
    
    retrievedContentDiv.style.display = 'block';
    showMessage(retrieveResultDiv, ' Paste retrieved successfully!', 'success');
  } catch (error) {
    showMessage(retrieveResultDiv, ` Error: ${error.message}`, 'error');
    retrievedContentDiv.style.display = 'none';
  }
});


deleteBtn.addEventListener('click', async () => {
  if (!currentPasteId) {
    showMessage(retrieveResultDiv, 'No paste selected', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this paste?')) {
    return;
  }

  try {
    clearMessage(retrieveResultDiv);

    const response = await fetch(`/api/pastes/${currentPasteId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete paste');
    }

    showMessage(retrieveResultDiv, 'Paste deleted successfully!', 'success');
    retrievedContentDiv.style.display = 'none';
    document.getElementById('pasteId').value = '';
    currentPasteId = null;
  } catch (error) {
    showMessage(retrieveResultDiv, ` Error: ${error.message}`, 'error');
  }
});

viewAllBtn.addEventListener('click', async () => {
  try {
    clearMessage(allPastesResultDiv);

    const response = await fetch('/api/pastes');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch pastes');
    }

    if (data.total === 0) {
      showMessage(allPastesResultDiv, 'ℹ No pastes found', 'info');
      return;
    }

    let html = `
      <div class="overflow-x-auto mt-4">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-800">ID</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-800">Created</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-800">Expires</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-bold text-gray-800">Size</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.pastes.forEach(paste => {
      const expiresText = paste.expiresAt ? formatDate(paste.expiresAt) : 'Never';
      const sizeKB = (paste.contentLength / 1024).toFixed(2);
      html += `
        <tr class="hover:bg-gray-100 transition-all">
          <td class="border border-gray-300 px-4 py-2"><strong class="text-blue-600">${paste.id}</strong></td>
          <td class="border border-gray-300 px-4 py-2 text-sm">${formatDate(paste.createdAt)}</td>
          <td class="border border-gray-300 px-4 py-2 text-sm">${expiresText}</td>
          <td class="border border-gray-300 px-4 py-2 text-sm">${sizeKB} KB</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;

    const resultHTML = `
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="font-bold text-blue-900">Total Pastes: <span class="text-lg">${data.total}</span></p>
        ${html}
      </div>
    `;

    allPastesResultDiv.innerHTML = resultHTML;
    allPastesResultDiv.style.display = 'block';
  } catch (error) {
    showMessage(allPastesResultDiv, `Error: ${error.message}`, 'error');
  }
});
