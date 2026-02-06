# Alibaba Cloud OSS File Uploader - React + Vite

A full-stack React + Vite project to upload files to Alibaba Cloud OSS (Object Storage Service) bucket with a modern, responsive web UI to browse and manage uploaded files.

## Features

- 📤 **File Upload**: Upload files to specific folders in the OSS bucket
- 📁 **File Browser**: View all uploaded files with metadata (size, date)
- 🔍 **Folder Filtering**: Filter files by folder path
- 🗑️ **File Deletion**: Delete files from the bucket
- ⚛️ **React + Vite**: Modern, fast development experience
- 🎨 **Modern UI**: Beautiful, responsive user interface with gradient design

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Storage**: Alibaba Cloud OSS
- **Styling**: CSS3 with modern gradients and animations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Alibaba Cloud OSS bucket: `everyusb-usky`
- Valid Alibaba Cloud Access Key credentials

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure OSS credentials (optional - defaults are set in config.js):
   - Copy `.env.example` to `.env` (if you want to use environment variables)
   - Or modify `config.js` directly with your credentials

## Configuration

The project uses the following default configuration (from `config.js`):

- **Bucket**: `everyusb-usky`
- **Region**: `oss-ap-southeast-1` (adjust if your bucket is in a different region)
- **Access Key ID**: Set in config.js
- **Access Key Secret**: Set in config.js

### Important: Region Configuration

You may need to adjust the `region` in `config.js` based on your bucket's actual region. Common regions:
- `oss-cn-hangzhou` (China Hangzhou)
- `oss-cn-shanghai` (China Shanghai)
- `oss-cn-beijing` (China Beijing)
- `oss-cn-shenzhen` (China Shenzhen)
- `oss-ap-southeast-1` (Singapore)
- `oss-us-west-1` (US West)
- `oss-eu-central-1` (Germany)

## Usage

### Development Mode

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- **Backend server**: `http://localhost:3000` (Express API)
- **Frontend dev server**: `http://localhost:5173` (Vite)

Open your browser and navigate to:
```
http://localhost:5173
```

The Vite dev server automatically proxies API requests to the backend.

### Production Build

1. Build the React app:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The server will serve the built React app from the `dist` folder.

### Individual Commands

- **Backend only**: `npm run dev:server`
- **Frontend only**: `npm run dev:client`
- **Build**: `npm run build`
- **Preview build**: `npm run preview`

## Usage Guide

### Upload Files
1. Enter a folder path (e.g., `documents`, `images/photos`)
2. Select a file from your computer
3. Click "Upload File"
4. Wait for the upload confirmation

### Browse Files
1. Enter a folder path in the filter input
2. Click "Refresh" or press Enter
3. View file details (name, size, date)
4. Click "View" to open the file in a new tab
5. Click "Delete" to remove a file from the bucket

## API Endpoints

### POST `/api/upload`
Upload a file to OSS.

**Body (multipart/form-data)**:
- `file`: The file to upload
- `folder`: Target folder path (default: "uploads")
- `fileName`: Optional custom file name

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://...",
  "objectName": "folder/filename.ext",
  "size": 12345
}
```

### GET `/api/files?folder=<folder_path>`
List files in a specific folder.

**Response**:
```json
{
  "success": true,
  "folder": "uploads",
  "files": [
    {
      "name": "uploads/file.txt",
      "size": 12345,
      "lastModified": "2024-01-01T00:00:00.000Z",
      "url": "https://..."
    }
  ],
  "count": 1
}
```

### DELETE `/api/files?objectName=<object_name>`
Delete a file from OSS.

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Project Structure

```
.
├── server.js              # Express server with OSS integration (ES modules)
├── config.js              # Configuration file (ES modules)
├── vite.config.js         # Vite configuration
├── index.html             # React app entry HTML
├── package.json           # Dependencies and scripts
├── src/                   # React source code
│   ├── main.jsx          # React app entry point
│   ├── App.jsx           # Main App component
│   ├── App.css           # App styles
│   ├── index.css         # Global styles
│   ├── components/       # React components
│   │   ├── FileUpload.jsx
│   │   ├── FileUpload.css
│   │   ├── FileBrowser.jsx
│   │   └── FileBrowser.css
│   ├── services/        # API services
│   │   └── api.js       # Axios API client
│   └── utils/          # Utility functions
│       └── formatters.js
├── public/              # Static files (legacy, optional)
├── dist/                # Production build output (generated)
└── README.md            # This file
```

## Testing

### Automated Tests

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Security Notes

- ⚠️ **Never commit credentials to version control**
- The `.gitignore` file excludes `.env` files
- Consider using environment variables for production
- Ensure your OSS bucket has appropriate access policies

## Troubleshooting

### Upload fails with region error
- Check that the `region` in `config.js` matches your bucket's region
- Verify your Access Key credentials are correct

### Files not showing up
- Verify the folder path is correct
- Check that files were uploaded successfully
- Ensure the bucket name is correct: `everyusb-usky`

### CORS errors
- Ensure your OSS bucket CORS settings allow requests from your domain
- The server includes CORS middleware for local development

### Vite dev server issues
- Make sure port 5173 is not in use
- Check that the backend server is running on port 3000
- The Vite proxy is configured to forward `/api` requests to the backend

### Module import errors
- Ensure you're using Node.js v16+ (ES modules support)
- The project uses ES modules (`"type": "module"` in package.json)

## License

ISC
