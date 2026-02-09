import { NextResponse } from 'next/server';
import OSS from 'ali-oss';

// Initialize OSS client
function getOSSClient() {
  return new OSS({
    region: process.env.OSS_REGION || 'oss-cn-shenzhen',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
    endpoint: process.env.OSS_ENDPOINT
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const prefix = folder ? (folder.endsWith('/') ? folder : `${folder}/`) : '';

    const client = getOSSClient();
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
      url: obj.url || `https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com/${obj.name}`,
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

    return NextResponse.json({
      success: true,
      folder: folder || 'root',
      items: items,
      files: files,
      folders: folders,
      count: items.length
    });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list files',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const objectName = searchParams.get('objectName');

    if (!objectName) {
      return NextResponse.json(
        { error: 'objectName parameter is required' },
        { status: 400 }
      );
    }

    const client = getOSSClient();
    await client.delete(objectName);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete file',
        message: error.message
      },
      { status: 500 }
    );
  }
}


