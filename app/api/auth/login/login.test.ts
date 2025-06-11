import { POST } from './route'; // Adjust if your route handler is in a different file name
import { NextRequest } from 'next/server';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken'; // Import actual jwt to spy on sign

// Mock dependencies
const mockFsPromises = {
  readFile: jest.fn(),
  mkdir: jest.fn(() => Promise.resolve()), // Though not directly used by login, often part of shared utils
};
jest.mock('fs/promises', () => mockFsPromises);

const mockBcrypt = {
  compare: jest.fn(),
};
jest.mock('bcrypt', () => mockBcrypt);

// Mock next/headers
const mockCookiesSet = jest.fn();
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: mockCookiesSet,
  })),
}));

// Spy on jwt.sign
const jwtSignSpy = jest.spyOn(jwt, 'sign');

// Helper to create a mock NextRequest for POST
function createMockLoginRequest(body: any): NextRequest {
  const request = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return request as NextRequest;
}

// Sample users for testing
const MOCK_USERS_STORE = [
  {
    userId: 'user-123',
    email: 'test@example.com',
    passwordHash: 'correctpassword-hashed', // Assume this is the hashed version
    registrationDate: new Date().toISOString(),
  },
  {
    userId: 'user-456',
    email: 'another@example.com',
    passwordHash: 'anotherpassword-hashed',
    registrationDate: new Date().toISOString(),
  },
];

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mocks for each test
    mockFsPromises.readFile.mockResolvedValue(JSON.stringify(MOCK_USERS_STORE));
    jwtSignSpy.mockReturnValue('mock-jwt-token' as any); // cast to any if type issues with mock
  });

  test('should login successfully with correct credentials and set cookie', async () => {
    mockBcrypt.compare.mockResolvedValue(true); // Simulate correct password

    const request = createMockLoginRequest({ email: 'test@example.com', password: 'correctpassword' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe('test@example.com');
    expect(body.user.passwordHash).toBeUndefined(); // Ensure hash is not returned

    expect(mockBcrypt.compare).toHaveBeenCalledWith('correctpassword', 'correctpassword-hashed');
    expect(jwtSignSpy).toHaveBeenCalledWith(
      { userId: 'user-123', email: 'test@example.com' },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev', // ensure this matches route's secret
      { expiresIn: '1h' } // ensure this matches route's expiry
    );
    expect(mockCookiesSet).toHaveBeenCalledWith('session_token', 'mock-jwt-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600, // 1 hour in seconds
    });
  });

  test('should return 401 for non-existent email', async () => {
    const request = createMockLoginRequest({ email: 'nouser@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('Invalid email or password.');
    expect(mockBcrypt.compare).not.toHaveBeenCalled();
    expect(jwtSignSpy).not.toHaveBeenCalled();
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });

  test('should return 401 for incorrect password', async () => {
    mockBcrypt.compare.mockResolvedValue(false); // Simulate incorrect password

    const request = createMockLoginRequest({ email: 'test@example.com', password: 'wrongpassword' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('Invalid email or password.');
    expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'correctpassword-hashed');
    expect(jwtSignSpy).not.toHaveBeenCalled();
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });

  test('should return 400 if email is not provided', async () => {
    const request = createMockLoginRequest({ password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Email and password are required.');
  });

  test('should return 400 if password is not provided', async () => {
    const request = createMockLoginRequest({ email: 'test@example.com' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Email and password are required.');
  });

  test('should handle error during fs.readFile', async () => {
    mockFsPromises.readFile.mockRejectedValueOnce(new Error('Failed to read users file'));
    const request = createMockLoginRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to read users file');
  });

  test('should handle error during bcrypt.compare', async () => {
    mockBcrypt.compare.mockRejectedValueOnce(new Error('Bcrypt error'));
    const request = createMockLoginRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Bcrypt error');
  });
});
