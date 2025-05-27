import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { isUserAdminByEmail } from '@/lib/authUtils'; // Server-side admin check

// Define User and DecodedToken interfaces locally or import if shared
interface UserForAuth {
  userId: string;
  email: string;
  // other fields if present in JWT or user object
}
interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

const metadataFilePath = join(process.cwd(), 'uploads', 'metadata.json');
const uploadDir = join(process.cwd(), 'uploads'); // To ensure directory exists
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev';

// Function to read the actual user data from users.json (if needed for cross-referencing)
// For this specific endpoint, we might only need the email from the token for admin check.
// However, a more robust check might involve fetching the user from users.json.
// For now, we will rely on the email in the JWT for the admin check.

async function readAllFileMetadata() {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await readFile(metadataFilePath, 'utf-8');
    return JSON.parse(data); // Assuming metadata.json contains an array of file metadata objects
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    console.error('Error reading file metadata:', error);
    throw new Error('Could not read file metadata.');
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated: No token provided.' }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (err) {
      return NextResponse.json({ error: 'Not authenticated: Invalid or expired token.' }, { status: 401 });
    }

    // Admin Check: Use the email from the decoded token
    if (!isUserAdminByEmail(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden: User is not an admin.' }, { status: 403 });
    }

    // If admin, proceed to fetch and return file metadata
    const allFileMetadata = await readAllFileMetadata();
    return NextResponse.json(allFileMetadata);

  } catch (error: any) {
    console.error('Error in /api/admin/files:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch file metadata.' }, { status: 500 });
  }
}
