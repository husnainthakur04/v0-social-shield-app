import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface FileMetadata {
  fileId: string; // Filename on disk, e.g., uuid.ext
  originalFilename: string;
  uploadTimestamp: number;
  password?: string;
  expiryType?: 'days' | 'downloads' | 'none';
  expiryValue?: number;
  downloadCount: number;
  fileExtension?: string;
  fileSize: number;
  virusScanStatus: 'pending' | 'clean' | 'infected'; // Added
  virusScanDetails?: string; // Added
}

const metadataFilePath = join(process.cwd(), 'uploads', 'metadata.json');

async function readMetadata(): Promise<FileMetadata[]> {
  try {
    const data = await readFile(metadataFilePath, 'utf-8');
    return JSON.parse(data) as FileMetadata[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    console.error('Error reading metadata for metadata API:', error);
    throw new Error('Could not read metadata file.');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is missing.' }, { status: 400 });
  }

  try {
    const allMetadata = await readMetadata();
    const metadata = allMetadata.find(m => m.fileId === fileId);

    if (!metadata) {
      return NextResponse.json({ error: 'File metadata not found.' }, { status: 404 });
    }

    // Return non-sensitive metadata
    const publicMetadata = {
      originalFilename: metadata.originalFilename,
      fileSize: metadata.fileSize,
      fileExtension: metadata.fileExtension,
      isPasswordProtected: !!metadata.password, // Only indicate if password is set
      expiryType: metadata.expiryType,
      expiryValue: metadata.expiryValue,
      uploadTimestamp: metadata.uploadTimestamp,
      downloadCount: metadata.downloadCount, // Useful for "expires after X downloads"
      fileId: metadata.fileId, // Send back the fileId for constructing download/preview URLs
      virusScanStatus: metadata.virusScanStatus, // Added virus scan status
    };

    return NextResponse.json(publicMetadata);

  } catch (error: any) {
    console.error(`Error fetching metadata for ${fileId}:`, error);
    return NextResponse.json({ error: error.message || 'Error fetching file metadata.' }, { status: 500 });
  }
}
