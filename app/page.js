'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileBrowser from './components/FileBrowser';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of file browser
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Alibaba Cloud OSS File Manager</h1>
        <p className="subtitle">Bucket: <strong>everyusb-usky</strong></p>
      </header>

      <div className="main-content">
        <div className="content-grid">
          <section className="upload-section">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </section>

          <section className="browser-section">
            <FileBrowser key={refreshKey} />
          </section>
        </div>
      </div>
    </div>
  );
}

