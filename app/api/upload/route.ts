import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
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
  fileSize: number;
  virusScanStatus: 'pending' | 'clean' | 'infected';
  virusScanDetails?: string;
  userId?: string; // Added for associating uploads with users
}

const metadataFilePath = join(process.cwd(), 'uploads', 'metadata.json');
const uploadDir = join(process.cwd(), 'uploads');
const SALT_ROUNDS = 10; // For bcrypt

async function readMetadata(): Promise<FileMetadata[]> {
  try {
    const data = await readFile(metadataFilePath, 'utf-8');
    return JSON.parse(data) as FileMetadata[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
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

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let password = formData.get('password') as string | null;
    const expiryOption = formData.get('expiryOption') as string | '7days';
    // const customFilename = formData.get('customFilename') as string | null; // For future use

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileId = uuidv4();
    const originalFilename = file.name;
    const fileSize = file.size;
    const fileExtension = originalFilename.split('.').pop() || '';
    const filenameOnDisk = `${fileId}.${fileExtension}`;
    const filePath = join(uploadDir, filenameOnDisk);

    // --- Conceptual Virus Scan Placeholder ---
    // In a real app, this is where you'd trigger an async virus scan.
    // For now, we'll set a default status.
    const virusScanStatus: FileMetadata['virusScanStatus'] = 'pending';
    const virusScanDetails = virusScanStatus === 'pending' ? 'Scan scheduled.' : 'No threats detected (simulated).';
    // --- End Conceptual Virus Scan Placeholder ---

    // --- User ID Association (Conceptual) ---
    // In a real setup with robust auth, you'd get userId from the verified session/token.
    // For this example, we'll assume it might come from a trusted header or be undefined.
    // const currentUserId = request.headers.get('X-User-Id'); // Example: if a gateway/middleware added it
    // Or, you might need to verify a JWT passed in headers/body if not using HttpOnly cookies for API auth.
    // For now, it will likely be undefined unless explicitly passed and handled.
    const currentUserId = undefined; // Placeholder for conceptual association
    // --- End User ID Association ---


    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);

    if (password) {
      password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const allMetadata = await readMetadata();

    let expiryType: FileMetadata['expiryType'] = 'none';
    let expiryValue: FileMetadata['expiryValue'] = 0;

    if (expiryOption.endsWith('days')) {
      expiryType = 'days';
      expiryValue = parseInt(expiryOption.replace('days', ''), 10);
    } else if (expiryOption.endsWith('downloads')) {
      expiryType = 'downloads';
      expiryValue = parseInt(expiryOption.replace('downloads', ''), 10);
    }

    const newMetadata: FileMetadata = {
      fileId: filenameOnDisk, // Use the filename with extension as ID
      originalFilename,
      uploadTimestamp: Date.now(),
      password: password || undefined, // Store hashed password
      expiryType,
      expiryValue,
      downloadCount: 0,
      fileExtension,
      fileSize,
      virusScanStatus,
      virusScanDetails,
      userId: currentUserId, // Add userId to metadata
    };

    allMetadata.push(newMetadata);
    await writeMetadata(allMetadata);

    return NextResponse.json({ success: true, fileId: filenameOnDisk });
  } catch (error: any) {
    console.error('Error in POST /api/upload:', error);
    return NextResponse.json({ error: error.message || 'Error saving file.' }, { status: 500 });
  }
}
