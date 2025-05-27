import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';
import bcrypt from 'bcrypt';

interface FileMetadata {
  fileId: string;
  originalFilename: string;
  uploadTimestamp: number;
  password?: string;
  expiryType?: 'days' | 'downloads' | 'none';
  expiryValue?: number;
  downloadCount: number;
  fileExtension?: string;
  fileSize: number; // Ensure this is present from previous tasks
  virusScanStatus: 'pending' | 'clean' | 'infected';
  virusScanDetails?: string;
}

const metadataFilePath = join(process.cwd(), 'uploads', 'metadata.json');
const uploadDir = join(process.cwd(), 'uploads');

async function readMetadata(): Promise<FileMetadata[]> {
  try {
    const data = await readFile(metadataFilePath, 'utf-8');
    return JSON.parse(data) as FileMetadata[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading metadata:', error);
    throw new Error('Could not read metadata file.');
  }
}

async function writeMetadata(metadata: FileMetadata[]): Promise<void> {
  try {
    await writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error('Error writing metadata:', error);
    throw new Error('Could not write metadata file.');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;
  const passwordAttempt = request.nextUrl.searchParams.get('password');

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is missing.' }, { status: 400 });
  }

  try {
    const allMetadata = await readMetadata();
    const metadataIndex = allMetadata.findIndex(m => m.fileId === fileId);

    if (metadataIndex === -1) {
      return NextResponse.json({ error: 'File not found or link invalid (m).', status: 404 });
    }

    const metadata = allMetadata[metadataIndex];

    // Password Check (API only checks if password is required, actual prompt is on download page)
    // For this API, if a password is set and not provided or incorrect, we'd deny access.
    // The download page (next step) would be responsible for GETTING the password from the user.
    // This API endpoint could be called by the download page after collecting the password.
    if (metadata.password) {
      if (!passwordAttempt) {
        return NextResponse.json({ error: 'Password required.', code: 'PASSWORD_REQUIRED' }, { status: 401 });
      }
      const passwordMatches = await bcrypt.compare(passwordAttempt, metadata.password);
      if (!passwordMatches) {
        return NextResponse.json({ error: 'Incorrect password.', code: 'INCORRECT_PASSWORD' }, { status: 403 });
      }
    }

    // Virus Scan Check
    if (metadata.virusScanStatus === 'infected') {
      return NextResponse.json({ error: 'File is infected and cannot be downloaded.', code: 'FILE_INFECTED' }, { status: 403 });
    }
    // Optionally, block downloads if scan is 'pending' depending on policy
    // if (metadata.virusScanStatus === 'pending') {
    //   return NextResponse.json({ error: 'Virus scan is pending. Please try again later.', code: 'SCAN_PENDING' }, { status: 423 }); // 423 Locked
    // }


    // Expiry Check (Days)
    if (metadata.expiryType === 'days' && metadata.expiryValue) {
      const expiryDate = new Date(metadata.uploadTimestamp);
      expiryDate.setDate(expiryDate.getDate() + metadata.expiryValue);
      if (new Date() > expiryDate) {
        // Optionally, delete the file and its metadata here
        return NextResponse.json({ error: 'Link expired (date).', code: 'LINK_EXPIRED_DATE' }, { status: 410 }); // 410 Gone
      }
    }

    // Expiry Check (Downloads)
    if (metadata.expiryType === 'downloads' && metadata.expiryValue !== undefined) {
      if (metadata.downloadCount >= metadata.expiryValue) {
        // Optionally, delete the file and its metadata here
        return NextResponse.json({ error: 'Download limit reached.', code: 'LINK_EXPIRED_DOWNLOADS'}, { status: 410 }); // 410 Gone
      }
    }

    const filePath = join(uploadDir, metadata.fileId); // fileId from metadata includes extension

    // Check if the physical file exists
    try {
        await stat(filePath);
    } catch (fileStatError: any) {
        if (fileStatError.code === 'ENOENT') {
            return NextResponse.json({ error: 'File not found on server.', code: 'FILE_NOT_FOUND_DISK' }, { status: 404 });
        }
        throw fileStatError; // Other stat errors
    }

    const fileBuffer = await readFile(filePath);

    // Increment Download Count if applicable
    if (metadata.expiryType === 'downloads' && metadata.expiryValue !== undefined) {
      allMetadata[metadataIndex].downloadCount += 1;
      await writeMetadata(allMetadata);
    }

    let contentType = 'application/octet-stream';
    if (metadata.fileExtension) {
        const ext = metadata.fileExtension.toLowerCase();
        if (ext === 'txt') contentType = 'text/plain';
        else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
        else if (ext === 'png') contentType = 'image/png';
        else if (ext === 'pdf') contentType = 'application/pdf';
        // Add more common types as needed
    }


    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${metadata.originalFilename}"`); // Use original filename

    return new NextResponse(fileBuffer, { status: 200, headers });

  } catch (error: any) {
    console.error('Error processing download:', error);
    if (error.code === 'ENOENT') { // Should be caught by specific file stat check now
      return NextResponse.json({ error: 'File not found.', code: 'FILE_NOT_FOUND_GENERAL' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Error processing file download.' }, { status: 500 });
  }
}
