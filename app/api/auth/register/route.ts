import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface User {
  userId: string;
  email: string;
  passwordHash: string; // Store hash, not plaintext
  registrationDate: string;
}

const usersFilePath = join(process.cwd(), 'uploads', 'users.json');
const uploadDir = join(process.cwd(), 'uploads'); // To ensure directory exists
const SALT_ROUNDS = 10;

async function readUsers(): Promise<User[]> {
  try {
    await mkdir(uploadDir, { recursive: true }); // Ensure uploads directory exists
    const data = await readFile(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If file doesn't exist, return empty array
    }
    console.error('Error reading users file:', error);
    throw new Error('Could not read users file.');
  }
}

async function writeUsers(users: User[]): Promise<void> {
  try {
    await writeFile(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Could not write users file.');
  }
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Basic password complexity (e.g., at least 6 characters)
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const allUsers = await readUsers();
    const existingUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 }); // 409 Conflict
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: User = {
      userId: uuidv4(),
      email: email.toLowerCase(),
      passwordHash,
      registrationDate: new Date().toISOString(),
    };

    allUsers.push(newUser);
    await writeUsers(allUsers);

    console.log(`New user registered: ${newUser.email}, userId: ${newUser.userId}`);
    // Do not return passwordHash or any sensitive info other than a success message
    return NextResponse.json({ success: true, message: 'User registered successfully.', userId: newUser.userId });

  } catch (error: any) {
    console.error('Error during user registration:', error);
    if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to register user.' }, { status: 500 });
  }
}
