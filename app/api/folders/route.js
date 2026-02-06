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
    const client = getOSSClient();
    const result = await client.list({
      'max-keys': 1000,
      delimiter: '/'
    });

    const folders = result.prefixes || [];

    return NextResponse.json({
      success: true,
      folders: folders
    });
  } catch (error) {
    console.error('List folders error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list folders',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get('folderPath');

    if (!folderPath) {
      return NextResponse.json(
        { error: 'folderPath parameter is required' },
        { status: 400 }
      );
    }

    const client = getOSSClient();
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
        await client.deleteMulti(objectNames, {
          quiet: true
        });

        deletedCount += objectNames.length;
      }

      continuationToken = result.nextContinuationToken || null;
    } while (continuationToken);

    return NextResponse.json({
      success: true,
      message: `Folder deleted successfully. ${deletedCount} file(s) removed.`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete folder',
        message: error.message
      },
      { status: 500 }
    );
  }
}

