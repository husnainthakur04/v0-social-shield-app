import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // For setting HttpOnly cookie

interface User {
  userId: string;
  email: string;
  passwordHash: string;
  registrationDate: string;
}

const usersFilePath = join(process.cwd(), 'uploads', 'users.json');
const uploadDir = join(process.cwd(), 'uploads'); // To ensure directory exists

// Ensure JWT_SECRET is set in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev';
if (JWT_SECRET === 'your-super-secret-jwt-key-for-dev') {
    console.warn("Using default JWT_SECRET. Please set a strong secret in your environment variables for production.");
}
const JWT_EXPIRY = '1h'; // Token expiry time (e.g., 1 hour)

async function readUsers(): Promise<User[]> {
  try {
    await mkdir(uploadDir, { recursive: true });
    const data = await readFile(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading users file:', error);
    throw new Error('Could not read users file.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const allUsers = await readUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 }); // Unauthorized
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set JWT in HttpOnly cookie
    cookies().set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax', // CSRF protection
      path: '/', // Cookie available for all paths
      maxAge: 60 * 60, // 1 hour in seconds, should match JWT_EXPIRY or be managed accordingly
    });

    // Return user info (excluding password hash)
    const { passwordHash, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, user: userWithoutPassword });

  } catch (error: any) {
    console.error('Error during login:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to login.' }, { status: 500 });
  }
}
