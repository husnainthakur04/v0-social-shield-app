import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface User {
  userId: string;
  email: string;
  passwordHash: string; // This will be excluded from the response
  registrationDate: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

const usersFilePath = join(process.cwd(), 'uploads', 'users.json');
const uploadDir = join(process.cwd(), 'uploads');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev';

async function readUsers(): Promise<User[]> {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await readFile(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading users file for /me endpoint:', error);
    throw new Error('Could not read users file.');
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated: No token found.' }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (err) {
      console.error('JWT verification error:', err);
      // Clear potentially invalid cookie
      cookies().set('session_token', '', { maxAge: 0, path: '/' });
      return NextResponse.json({ error: 'Not authenticated: Invalid or expired token.' }, { status: 401 });
    }

    const allUsers = await readUsers();
    const user = allUsers.find(u => u.userId === decoded.userId);

    if (!user) {
      // This case means the user ID in a valid token doesn't exist in users.json anymore
      // Clear the cookie as the session is invalid
      cookies().set('session_token', '', { maxAge: 0, path: '/' });
      return NextResponse.json({ error: 'User not found for token.' }, { status: 404 });
    }

    // Return user info (excluding password hash) and add isAdmin flag
    const { passwordHash, ...userWithoutPassword } = user;
    const isAdmin = !!process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL;
    
    return NextResponse.json({ success: true, user: { ...userWithoutPassword, isAdmin } });

  } catch (error: any) {
    console.error('Error in /me endpoint:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch user details.' }, { status: 500 });
  }
}
