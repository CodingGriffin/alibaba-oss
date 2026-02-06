import express from 'express';
import multer from 'multer';
import OSS from 'ali-oss';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OSS client
const client = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket,
  endpoint: config.oss.endpoint
});

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Upload file to OSS
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'uploads'; // Default folder is 'uploads'
    const fileName = req.body.fileName || req.file.originalname;
    const objectName = `${folder}/${fileName}`;

    // Upload to OSS
    const result = await client.put(objectName, req.file.buffer, {
      headers: {
        'Content-Type': req.file.mimetype
      }
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.url,
      objectName: objectName,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file', 
      message: error.message 
    });
  }
});

// List files and folders in a specific folder (or root)
app.get('/api/files', async (req, res) => {
  try {
    const folder = req.query.folder || '';
    const prefix = folder ? (folder.endsWith('/') ? folder : `${folder}/`) : '';
    
    const result = await client.list({
      prefix: prefix,
      'max-keys': 1000,
      delimiter: '/'
    });

    // Map files
    const files = (result.objects || []).map(obj => ({
      name: obj.name,
      size: obj.size,
      lastModified: obj.lastModified,
      url: obj.url || `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com/${obj.name}`,
      type: 'file'
    }));

    // Map folders
    const folders = (result.prefixes || []).map(prefix => ({
      name: prefix,
      type: 'folder',
      size: 0,
      lastModified: null
    }));

    // Combine files and folders, sort by type (folders first) then name
    const items = [...folders, ...files].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      folder: folder || 'root',
      items: items,
      files: files,
      folders: folders,
      count: items.length
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      error: 'Failed to list files', 
      message: error.message 
    });
  }
});

// List all folders
app.get('/api/folders', async (req, res) => {
  try {
    const result = await client.list({
      'max-keys': 1000,
      delimiter: '/'
    });

    const folders = result.prefixes || [];
    
    res.json({
      success: true,
      folders: folders
    });
  } catch (error) {
    console.error('List folders error:', error);
    res.status(500).json({ 
      error: 'Failed to list folders', 
      message: error.message 
    });
  }
});

// Delete a file
app.delete('/api/files', async (req, res) => {
  try {
    const objectName = req.query.objectName;
    
    if (!objectName) {
      return res.status(400).json({ error: 'objectName parameter is required' });
    }

    await client.delete(objectName);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file', 
      message: error.message 
    });
  }
});

// Delete a folder (deletes all objects with the folder prefix)
app.delete('/api/folders', async (req, res) => {
  try {
    const folderPath = req.query.folderPath;
    
    if (!folderPath) {
      return res.status(400).json({ error: 'folderPath parameter is required' });
    }

    // Ensure folder path ends with /
    const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // List all objects in the folder
    let deletedCount = 0;
    let continuationToken = null;
    
    do {
      const listOptions = {
        prefix: prefix,
        'max-keys': 1000
      };
      
      if (continuationToken) {
        listOptions['continuation-token'] = continuationToken;
      }
      
      const result = await client.list(listOptions);
      
      if (result.objects && result.objects.length > 0) {
        // Delete all objects in batch
        const objectNames = result.objects.map(obj => obj.name);
        const deleteResult = await client.deleteMulti(objectNames, {
          quiet: true
        });
        
        deletedCount += objectNames.length;
      }
      
      continuationToken = result.nextContinuationToken || null;
    } while (continuationToken);

    res.json({
      success: true,
      message: `Folder deleted successfully. ${deletedCount} file(s) removed.`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ 
      error: 'Failed to delete folder', 
      message: error.message 
    });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, serve old public folder if it exists
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Serve old pages if they exist
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
  });
}

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OSS Bucket: ${config.oss.bucket}`);
  console.log(`OSS Region: ${config.oss.region}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`React dev server: http://localhost:5173`);
  }
});
