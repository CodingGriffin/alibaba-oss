// API base URL
const API_BASE = '/api';

// Use utility functions from utils.js (loaded before this script)
const { formatFileSize, formatDate } = window.utils || {};

// DOM elements
const fileInput = document.getElementById('fileInput');
const folderInput = document.getElementById('folderInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileList = document.getElementById('fileList');
const folderFilter = document.getElementById('folderFilter');
const refreshBtn = document.getElementById('refreshBtn');

// Show status message
function showStatus(message, type = 'success') {
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message ${type}`;
    setTimeout(() => {
        uploadStatus.className = 'status-message';
        uploadStatus.style.display = 'none';
    }, 5000);
}

// Upload file
async function uploadFile() {
    const file = fileInput.files[0];
    const folder = folderInput.value.trim() || 'uploads';

    if (!file) {
        showStatus('Please select a file to upload', 'error');
        return;
    }

    // Disable upload button
    uploadBtn.disabled = true;
    uploadBtn.querySelector('.btn-text').style.display = 'none';
    uploadBtn.querySelector('.btn-loader').style.display = 'inline';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('fileName', file.name);

    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showStatus(`File uploaded successfully! URL: ${data.url}`, 'success');
            fileInput.value = '';
            // Refresh file list if folder matches
            if (folderFilter.value === folder) {
                loadFiles();
            }
        } else {
            showStatus(`Upload failed: ${data.error || data.message}`, 'error');
        }
    } catch (error) {
        showStatus(`Upload error: ${error.message}`, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.querySelector('.btn-text').style.display = 'inline';
        uploadBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// Load files from OSS
async function loadFiles() {
    const folder = folderFilter.value.trim() || 'uploads';
    
    fileList.innerHTML = '<div class="loading">Loading files...</div>';

    try {
        const response = await fetch(`${API_BASE}/files?folder=${encodeURIComponent(folder)}`);
        const data = await response.json();

        if (data.success) {
            displayFiles(data.files, folder);
        } else {
            fileList.innerHTML = `<div class="empty">Error loading files: ${data.error || data.message}</div>`;
        }
    } catch (error) {
        fileList.innerHTML = `<div class="empty">Error: ${error.message}</div>`;
    }
}

// Display files in the list
function displayFiles(files, folder) {
    if (files.length === 0) {
        fileList.innerHTML = `<div class="empty">No files found in folder: ${folder}</div>`;
        return;
    }

    fileList.innerHTML = files.map(file => {
        const fileName = file.name.split('/').pop();
        const filePath = file.name;
        
        return `
            <div class="file-item">
                <div class="file-info">
                    <div class="file-name">${fileName}</div>
                    <div class="file-meta">
                        <span class="file-size">${formatFileSize(file.size)}</span>
                        <span class="file-date">${formatDate(file.lastModified)}</span>
                        <span class="file-path" style="color: #999; font-size: 0.8em;">${filePath}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <a href="${file.url}" target="_blank" class="btn-small btn-view">View</a>
                    <button class="btn-small btn-delete" onclick="deleteFile('${filePath}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Delete file
async function deleteFile(objectName) {
    if (!confirm(`Are you sure you want to delete "${objectName}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/files?objectName=${encodeURIComponent(objectName)}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showStatus('File deleted successfully', 'success');
            loadFiles();
        } else {
            showStatus(`Delete failed: ${data.error || data.message}`, 'error');
        }
    } catch (error) {
        showStatus(`Delete error: ${error.message}`, 'error');
    }
}

// Event listeners
uploadBtn.addEventListener('click', uploadFile);

refreshBtn.addEventListener('click', loadFiles);

folderFilter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadFiles();
    }
});

// Load files on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
});

// Make deleteFile available globally
window.deleteFile = deleteFile;


