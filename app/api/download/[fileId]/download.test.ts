import { GET } from './route'; // Adjust if your handler is in a different file name
import { NextRequest } from 'next/server';
import { jest } from '@jest/globals';
import { join } from 'path'; // Needed for constructing expected paths if any

// Mock dependencies
const mockFsPromises = {
  readFile: jest.fn(),
  writeFile: jest.fn(() => Promise.resolve()), // For updating downloadCount
  stat: jest.fn(),
  mkdir: jest.fn(() => Promise.resolve()), // Though not directly used by GET, often part of shared utils
};
jest.mock('fs/promises', () => mockFsPromises);

// bcrypt is used for passwords.
jest.mock('bcrypt', () => ({
  compare: jest.fn((plainPassword, hash) => Promise.resolve(plainPassword === hash.replace('-hashed', ''))), // Simple mock for testing
}));

// Initial sample metadata
let MOCK_METADATA_STORE: any[] = [];

// Helper to create a mock NextRequest for GET
function createMockNextGetRequest(fileId: string, password?: string): NextRequest {
  const url = password
    ? `http://localhost/api/download/${fileId}?password=${encodeURIComponent(password)}`
    : `http://localhost/api/download/${fileId}`;
  const request = new Request(url, { method: 'GET' });
  return request as NextRequest;
}

describe('GET /api/download/[fileId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset MOCK_METADATA_STORE and readFile mock for each test
    MOCK_METADATA_STORE = [
      {
        fileId: 'publicfile.txt',
        originalFilename: 'public_file.txt',
        uploadTimestamp: Date.now(),
        fileExtension: 'txt',
        fileSize: 100,
        downloadCount: 0,
        virusScanStatus: 'clean',
      },
      {
        fileId: 'protectedfile.txt',
        originalFilename: 'protected_file.txt',
        uploadTimestamp: Date.now(),
        password: 'testpassword-hashed', // Mocked bcrypt appends '-hashed'
        fileExtension: 'txt',
        fileSize: 200,
        downloadCount: 0,
        virusScanStatus: 'clean',
      },
      {
        fileId: 'expiredfile_time.txt',
        originalFilename: 'expired_time.txt',
        uploadTimestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiryType: 'days',
        expiryValue: 1, // Expires after 1 day
        fileExtension: 'txt',
        fileSize: 50,
        downloadCount: 0,
        virusScanStatus: 'clean',
      },
      {
        fileId: 'expiredfile_downloads.txt',
        originalFilename: 'expired_downloads.txt',
        uploadTimestamp: Date.now(),
        expiryType: 'downloads',
        expiryValue: 2,
        downloadCount: 2, // Already reached download limit
        fileExtension: 'txt',
        fileSize: 60,
        virusScanStatus: 'clean',
      },
      {
        fileId: 'infectedfile.txt',
        originalFilename: 'infected_file.txt',
        uploadTimestamp: Date.now(),
        fileExtension: 'txt',
        fileSize: 70,
        downloadCount: 0,
        virusScanStatus: 'infected',
      },
      {
        fileId: 'downloadcount_test.txt',
        originalFilename: 'download_count.txt',
        uploadTimestamp: Date.now(),
        expiryType: 'downloads',
        expiryValue: 5, // 5 downloads allowed
        downloadCount: 1,
        fileExtension: 'txt',
        fileSize: 80,
        virusScanStatus: 'clean',
      }
    ];
    mockFsPromises.readFile.mockImplementation((path) => {
      if (path.endsWith('metadata.json')) {
        return Promise.resolve(JSON.stringify(MOCK_METADATA_STORE));
      }
      // For actual file content
      const requestedFileId = path.toString().split('/').pop();
      const fileMeta = MOCK_METADATA_STORE.find(f => f.fileId === requestedFileId);
      if (fileMeta) {
        return Promise.resolve(Buffer.from(`mock content for ${fileMeta.originalFilename}`));
      }
      return Promise.reject(new Error('File content not found in mock'));
    });
    mockFsPromises.stat.mockResolvedValue({ isDirectory: () => false }); // Assume file exists by default
  });

  test('should download a public file successfully', async () => {
    const request = createMockNextGetRequest('publicfile.txt');
    const response = await GET(request, { params: { fileId: 'publicfile.txt' } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="public_file.txt"');
    expect(response.headers.get('Content-Type')).toBe('text/plain'); // Based on .txt extension logic in route
    expect(mockFsPromises.readFile).toHaveBeenCalledWith(expect.stringContaining('publicfile.txt'));
  });

  test('should return 404 for a non-existent fileId', async () => {
    const request = createMockNextGetRequest('nonexistent.txt');
    const response = await GET(request, { params: { fileId: 'nonexistent.txt' } });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('File not found or link invalid (m).');
  });

  test('should return 404 if stat shows file does not exist on disk', async () => {
    mockFsPromises.stat.mockRejectedValueOnce({ code: 'ENOENT' });
    const request = createMockNextGetRequest('publicfile.txt');
    const response = await GET(request, { params: { fileId: 'publicfile.txt' } });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('File not found on server.');
  });

  test('should download a password-protected file with correct password', async () => {
    const request = createMockNextGetRequest('protectedfile.txt', 'testpassword');
    const response = await GET(request, { params: { fileId: 'protectedfile.txt' } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="protected_file.txt"');
  });

  test('should return 403 for password-protected file with incorrect password', async () => {
    const request = createMockNextGetRequest('protectedfile.txt', 'wrongpassword');
    const response = await GET(request, { params: { fileId: 'protectedfile.txt' } });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe('Incorrect password.');
  });

  test('should return 401 for password-protected file without password query', async () => {
    const request = createMockNextGetRequest('protectedfile.txt');
    const response = await GET(request, { params: { fileId: 'protectedfile.txt' } });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('Password required.');
  });

  test('should return 410 for time-expired file', async () => {
    const request = createMockNextGetRequest('expiredfile_time.txt');
    const response = await GET(request, { params: { fileId: 'expiredfile_time.txt' } });
    const body = await response.json();

    expect(response.status).toBe(410);
    expect(body.error).toBe('Link expired (date).');
  });

  test('should return 410 for download-limit-expired file', async () => {
    const request = createMockNextGetRequest('expiredfile_downloads.txt');
    const response = await GET(request, { params: { fileId: 'expiredfile_downloads.txt' } });
    const body = await response.json();

    expect(response.status).toBe(410);
    expect(body.error).toBe('Download limit reached.');
  });

  test('should increment download count for a successful download with limit', async () => {
    const fileIdToTest = 'downloadcount_test.txt';
    const initialMetadata = MOCK_METADATA_STORE.find(f => f.fileId === fileIdToTest);
    const initialDownloadCount = initialMetadata?.downloadCount || 0;

    const request = createMockNextGetRequest(fileIdToTest);
    const response = await GET(request, { params: { fileId: fileIdToTest } });

    expect(response.status).toBe(200);

    // Check if writeFile was called to update metadata
    expect(mockFsPromises.writeFile).toHaveBeenCalled();
    const writtenMetadataString = mockFsPromises.writeFile.mock.calls[0][1]; // Get the stringified metadata
    const writtenMetadata = JSON.parse(writtenMetadataString);
    const updatedFileMeta = writtenMetadata.find((f: any) => f.fileId === fileIdToTest);

    expect(updatedFileMeta.downloadCount).toBe(initialDownloadCount + 1);
  });

  test('should return 403 for infected file', async () => {
    const request = createMockNextGetRequest('infectedfile.txt');
    const response = await GET(request, { params: { fileId: 'infectedfile.txt' } });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe('File is infected and cannot be downloaded.');
  });
});
