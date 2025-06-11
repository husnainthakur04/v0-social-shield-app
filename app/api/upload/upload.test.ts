import { POST } from './route'; // Adjust path if your route handler is in a different file
import { NextRequest } from 'next/server';
import { jest } from '@jest/globals'; // Or import {describe, test, expect, jest} from '@jest/globals';

// Mock dependencies
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve()),
  readFile: jest.fn(() => Promise.resolve('[]')), // Default to empty metadata
  stat: jest.fn(() => Promise.resolve({ isDirectory: () => true })), // Mock stat to avoid ENOENT for directory checks
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));
// bcrypt is used for passwords, but not directly in the simplest upload case without password.
// If testing password hashing, bcrypt.hash would need mocking.
jest.mock('bcrypt', () => ({
  hash: jest.fn((password, saltRounds) => Promise.resolve(`${password}-hashed`)),
}));


// Helper to create a mock NextRequest
function createMockNextRequest(formData: FormData): NextRequest {
  const request = new Request('http://localhost/api/upload', {
    method: 'POST',
    body: formData,
    // headers: { 'Content-Type': 'multipart/form-data' } // Superfluous, browser sets it with boundary
  });
  return request as NextRequest;
}

describe('POST /api/upload', () => {
  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
    // Reset specific mocks if they need different behavior per test
    const fsPromises = require('fs/promises');
    fsPromises.readFile.mockResolvedValue('[]'); // Reset to empty metadata for each test
  });

  test('should return 400 if no file is provided', async () => {
    const formData = new FormData(); // Empty form data
    const request = createMockNextRequest(formData);

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('No file uploaded.');
  });

  test('should successfully upload a file and create metadata', async () => {
    const mockFile = new Blob(['test file content'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', mockFile, 'test.txt');
    formData.append('expiryOption', '7days');

    const request = createMockNextRequest(formData);
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.fileId).toBe('mock-uuid-1234.txt');

    const { writeFile, readFile, mkdir } = require('fs/promises');
    expect(mkdir).toHaveBeenCalledWith(expect.stringContaining('uploads'), { recursive: true });
    expect(writeFile).toHaveBeenCalledTimes(2); // Once for file, once for metadata

    // Check file write call
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('uploads/mock-uuid-1234.txt'), // path
      expect.any(Buffer) // buffer
    );

    // Check metadata write call
    const expectedMetadata = [{
      fileId: 'mock-uuid-1234.txt',
      originalFilename: 'test.txt',
      uploadTimestamp: expect.any(Number),
      password: undefined,
      expiryType: 'days',
      expiryValue: 7,
      downloadCount: 0,
      fileExtension: 'txt',
      fileSize: mockFile.size,
      virusScanStatus: 'pending',
      virusScanDetails: 'Scan scheduled.',
      userId: undefined, // Assuming no user for this basic test
    }];
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('uploads/metadata.json'),
      JSON.stringify(expectedMetadata, null, 2)
    );
    expect(readFile).toHaveBeenCalledWith(expect.stringContaining('uploads/metadata.json'), 'utf-8');
  });

  test('should correctly save password and expiry options', async () => {
    const mockFile = new Blob(['password test'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', mockFile, 'protected.txt');
    formData.append('password', 'testpassword');
    formData.append('expiryOption', '10downloads');

    const request = createMockNextRequest(formData);
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.fileId).toBe('mock-uuid-1234.txt'); // Assuming same mock UUID

    const { writeFile } = require('fs/promises');
    const expectedMetadata = [{
      fileId: 'mock-uuid-1234.txt',
      originalFilename: 'protected.txt',
      uploadTimestamp: expect.any(Number),
      password: 'testpassword-hashed', // Bcrypt mock appends '-hashed'
      expiryType: 'downloads',
      expiryValue: 10,
      downloadCount: 0,
      fileExtension: 'txt',
      fileSize: mockFile.size,
      virusScanStatus: 'pending',
      virusScanDetails: 'Scan scheduled.',
      userId: undefined,
    }];
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('uploads/metadata.json'),
      JSON.stringify(expectedMetadata, null, 2)
    );
  });

  test('should return 500 if writeFile fails for the file', async () => {
    const fsPromises = require('fs/promises');
    // Make the first writeFile (for the file itself) fail, but metadata write succeed (or not be reached)
    fsPromises.writeFile.mockImplementationOnce(() => Promise.reject(new Error('Disk full')));

    const mockFile = new Blob(['test content'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', mockFile, 'test.txt');

    const request = createMockNextRequest(formData);
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Disk full'); // Or your generic error message
  });

  test('should return 500 if writeFile fails for metadata.json', async () => {
    const fsPromises = require('fs/promises');
    // Make the first writeFile (file) succeed, second (metadata) fail
    fsPromises.writeFile
      .mockImplementationOnce(() => Promise.resolve()) // File write succeeds
      .mockImplementationOnce(() => Promise.reject(new Error('Metadata write failed'))); // Metadata write fails

    const mockFile = new Blob(['test content'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', mockFile, 'test.txt');

    const request = createMockNextRequest(formData);
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Metadata write failed');
  });
});

// Note: Testing actual file content writing requires more complex setup or not mocking writeFile's content part.
// These tests focus on the API's interaction with the file system module and metadata generation.
// The Blob and FormData are part of Node.js v18+ standard library, so they don't need explicit polyfills for testing in that environment.
// If running in an older Node environment, you might need to polyfill them or use a library like 'form-data'.
// jest.config.js should have testEnvironment: 'node' for these tests.
