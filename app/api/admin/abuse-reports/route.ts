import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { isUserAdminByEmail } from '@/lib/authUtils'; // Server-side admin check

// Define User and DecodedToken interfaces locally or import if shared
interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

const abuseReportsFilePath = join(process.cwd(), 'uploads', 'abuse_reports.json');
const uploadDir = join(process.cwd(), 'uploads'); // To ensure directory exists
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev';


async function readAllAbuseReports() {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await readFile(abuseReportsFilePath, 'utf-8');
    return JSON.parse(data); // Assuming abuse_reports.json contains an array of report objects
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    console.error('Error reading abuse reports file:', error);
    throw new Error('Could not read abuse reports file.');
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

    // If admin, proceed to fetch and return abuse reports
    const allAbuseReports = await readAllAbuseReports();
    return NextResponse.json(allAbuseReports);

  } catch (error: any) {
    console.error('Error in /api/admin/abuse-reports:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch abuse reports.' }, { status: 500 });
  }
}
