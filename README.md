# Alibaba Cloud OSS File Manager

A full-stack Next.js application for uploading and managing files in Alibaba Cloud OSS (Object Storage Service) buckets.

## Features

- 📤 Upload files to OSS with folder organization
- 📁 Browse files and folders in your OSS bucket
- 🗑️ Delete files and folders
- 🎨 Modern, responsive UI

## Prerequisites

- Node.js 18+ 
- Alibaba Cloud OSS account with:
  - Access Key ID
  - Access Key Secret
  - Bucket name
  - Region

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
OSS_REGION=oss-cn-shenzhen
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name
OSS_ENDPOINT=
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── upload/       # File upload endpoint
│   │   ├── files/        # File listing and deletion
│   │   └── folders/      # Folder operations
│   ├── components/        # React components
│   │   ├── FileUpload.jsx
│   │   └── FileBrowser.jsx
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page
│   └── globals.css       # Global styles
├── next.config.js        # Next.js configuration
└── package.json
```

## API Endpoints

- `POST /api/upload` - Upload a file to OSS
- `GET /api/files?folder=<path>` - List files in a folder
- `DELETE /api/files?objectName=<name>` - Delete a file
- `GET /api/folders` - List all folders
- `DELETE /api/folders?folderPath=<path>` - Delete a folder and its contents

## Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **ali-oss** - Alibaba Cloud OSS SDK
- **Axios** - HTTP client

## License

ISC
