import { POST } from './route'; // Adjust if your route handler is in a different file name
import { NextRequest } from 'next/server';
import { jest } from '@jest/globals';

// Mock dependencies
const mockFsPromises = {
  readFile: jest.fn(),
  writeFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
};
jest.mock('fs/promises', () => mockFsPromises);

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-user-uuid-1234'),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn((password, saltRounds) => Promise.resolve(`${password}-hashed-with-${saltRounds}`)),
}));

// Helper to create a mock NextRequest for POST
function createMockRegisterRequest(body: any): NextRequest {
  const request = new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return request as NextRequest;
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to empty users list for most tests
    mockFsPromises.readFile.mockResolvedValue('[]');
  });

  test('should register a new user successfully', async () => {
    const request = createMockRegisterRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200); // Assuming 200 for successful registration based on previous API structure
    expect(body.success).toBe(true);
    expect(body.message).toBe('User registered successfully.');
    expect(body.userId).toBe('mock-user-uuid-1234');

    expect(require('bcrypt').hash).toHaveBeenCalledWith('password123', 10); // 10 is SALT_ROUNDS in route

    const expectedUserData = {
      userId: 'mock-user-uuid-1234',
      email: 'test@example.com',
      passwordHash: 'password123-hashed-with-10',
      registrationDate: expect.any(String), // Check for string, actual date will vary
    };
    expect(mockFsPromises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('users.json'),
      JSON.stringify([expectedUserData], null, 2)
    );
  });

  test('should return 409 if email already exists', async () => {
    const existingUsers = [{
      userId: 'existing-user-id',
      email: 'test@example.com',
      passwordHash: 'existing-hash',
      registrationDate: new Date().toISOString(),
    }];
    mockFsPromises.readFile.mockResolvedValue(JSON.stringify(existingUsers));

    const request = createMockRegisterRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe('Email already in use.');
    expect(mockFsPromises.writeFile).not.toHaveBeenCalled();
  });

  test('should return 400 if email is not provided', async () => {
    const request = createMockRegisterRequest({ password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Email and password are required.');
  });

  test('should return 400 if password is not provided', async () => {
    const request = createMockRegisterRequest({ email: 'test@example.com' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Email and password are required.');
  });

  test('should return 400 for invalid email format', async () => {
    const request = createMockRegisterRequest({ email: 'invalid-email', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Invalid email format.');
  });

  test('should return 400 for short password', async () => {
    const request = createMockRegisterRequest({ email: 'test@example.com', password: '123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Password must be at least 6 characters long.');
  });

  test('should handle errors during file reading', async () => {
    mockFsPromises.readFile.mockRejectedValueOnce(new Error('Failed to read users file'));
    const request = createMockRegisterRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to read users file');
  });

  test('should handle errors during file writing', async () => {
    mockFsPromises.writeFile.mockRejectedValueOnce(new Error('Failed to write users file'));
    const request = createMockRegisterRequest({ email: 'test@example.com', password: 'password123' });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to write users file');
  });
});
