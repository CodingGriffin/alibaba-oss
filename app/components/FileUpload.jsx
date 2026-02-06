'use client';

import { useState } from 'react';
import { uploadFile } from '../services/api';

export default function FileUpload({ onUploadSuccess }) {
  const [folder, setFolder] = useState('uploads');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setStatus({ message: '', type: '' });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ message: 'Please select a file to upload', type: 'error' });
      return;
    }

    setUploading(true);
    setStatus({ message: '', type: '' });

    try {
      const result = await uploadFile(selectedFile, folder);
      
      if (result.success) {
        setStatus({ 
          message: `File uploaded successfully! URL: ${result.url}`, 
          type: 'success' 
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        
        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setStatus({ 
          message: `Upload failed: ${result.error || result.message}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      setStatus({ 
        message: `Upload error: ${error.response?.data?.error || error.message}`, 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File</h2>
      <div className="upload-form">
        <div className="form-group">
          <label htmlFor="folderInput">Folder Path:</label>
          <input
            type="text"
            id="folderInput"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g., documents, images/photos"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fileInput">Select File:</label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <div className="file-info">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="btn btn-primary"
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </button>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

