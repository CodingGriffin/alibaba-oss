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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';
    const fileName = formData.get('fileName') || file.name;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const client = getOSSClient();
    const objectName = `${folder}/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to OSS
    const result = await client.put(objectName, buffer, {
      headers: {
        'Content-Type': file.type
      }
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.url,
      objectName: objectName,
      size: file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        message: error.message
      },
      { status: 500 }
    );
  }
}

