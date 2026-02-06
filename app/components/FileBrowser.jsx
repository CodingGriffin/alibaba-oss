'use client';

import { useState, useEffect } from 'react';
import { getFiles, deleteFile, deleteFolder } from '../services/api';
import { formatFileSize, formatDate } from '../utils/formatters';

export default function FileBrowser() {
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFiles = async (path = '') => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFiles(path);
      if (result.success) {
        setItems(result.items || []);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const handleRefresh = () => {
    loadFiles(currentPath);
  };

  const handleFolderClick = (folderPath) => {
    setCurrentPath(folderPath);
  };

  const handleNavigateUp = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(p => p);
      pathParts.pop();
      setCurrentPath(pathParts.join('/'));
    }
  };

  const handleNavigateToRoot = () => {
    setCurrentPath('');
  };

  const handleDelete = async (objectName, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const result = await deleteFile(objectName);
      if (result.success) {
        // Reload files after deletion
        loadFiles(currentPath);
      } else {
        alert(`Delete failed: ${result.error || result.message}`);
      }
    } catch (err) {
      alert(`Delete error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeleteFolder = async (folderPath, folderName) => {
    if (!window.confirm(`Are you sure you want to delete the folder "${folderName}" and all its contents? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteFolder(folderPath);
      if (result.success) {
        alert(result.message || `Folder "${folderName}" deleted successfully. ${result.deletedCount || 0} file(s) removed.`);
        // Reload files after deletion
        loadFiles(currentPath);
      } else {
        alert(`Delete failed: ${result.error || result.message}`);
      }
    } catch (err) {
      alert(`Delete error: ${err.response?.data?.error || err.message}`);
    }
  };

  // Build breadcrumb path
  const getBreadcrumbs = () => {
    if (!currentPath) return [{ name: 'Root', path: '' }];
    
    const parts = currentPath.split('/').filter(p => p);
    const breadcrumbs = [{ name: 'Root', path: '' }];
    
    let current = '';
    parts.forEach(part => {
      current = current ? `${current}/${part}` : part;
      breadcrumbs.push({ name: part, path: current });
    });
    
    return breadcrumbs;
  };

  const folders = items.filter(item => item.type === 'folder');
  const files = items.filter(item => item.type === 'file');

  return (
    <div className="file-browser">
      <div className="browser-header">
        <h2>File Browser</h2>
        <div className="browser-controls">
          <button onClick={handleRefresh} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        {getBreadcrumbs().map((crumb, index) => (
          <span key={index} className="breadcrumb">
            {index > 0 && <span className="breadcrumb-separator"> / </span>}
            <button
              onClick={() => setCurrentPath(crumb.path)}
              className={`breadcrumb-link ${crumb.path === currentPath ? 'active' : ''}`}
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {/* Current Path Display */}
      <div className="current-path">
        <strong>Current Path:</strong> {currentPath || 'root'}
      </div>

      <div className="file-list-container">
        {loading && (
          <div className="loading">Loading files...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="empty">No files or folders found</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="file-list">
            {/* Show Folders First */}
            {folders.map((folder, index) => {
              const folderName = folder.name.replace(/\/$/, '').split('/').pop();
              return (
                <div key={`folder-${index}`} className="file-item folder-item">
                  <div className="file-info">
                    <div className="file-name">
                      <span className="folder-icon">📁</span>
                      {folderName}
                    </div>
                    <div className="file-meta">
                      <span className="file-type">Folder</span>
                      <span className="file-path">{folder.name}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      onClick={() => handleFolderClick(folder.name)}
                      className="btn-small btn-view"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder.name, folderName)}
                      className="btn-small btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Show Files */}
            {files.map((file, index) => {
              const fileName = file.name.split('/').pop();
              return (
                <div key={`file-${index}`} className="file-item">
                  <div className="file-info">
                    <div className="file-name">
                      <span className="file-icon">📄</span>
                      {fileName}
                    </div>
                    <div className="file-meta">
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      <span className="file-date">{formatDate(file.lastModified)}</span>
                      <span className="file-path">{file.name}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-small btn-view"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.name, fileName)}
                      className="btn-small btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

