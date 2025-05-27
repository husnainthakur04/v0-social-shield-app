// 'use client'; // generateMetadata runs on the server, so 'use client' might be for the component itself, not the whole file.
// For Next.js App Router, page components are Server Components by default.
// We can keep 'use client' if client-side hooks are used in the component part.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDownTrayIcon, EyeIcon, LockClosedIcon, ExclamationTriangleIcon, InformationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { ReportAbuseModal } from '@/components/report-abuse-modal'; // Import the modal

interface PublicFileMetadata {
  originalFilename: string;
  fileSize: number;
  fileExtension?: string;
  isPasswordProtected: boolean;
  expiryType?: 'days' | 'downloads' | 'none';
  expiryValue?: number;
  uploadTimestamp: number;
  downloadCount: number;
  fileId: string;
  virusScanStatus?: 'pending' | 'clean' | 'infected';
  fileSize: number; // Ensure this is present
}

// --- Metadata for generateMetadata ---
import type { Metadata, ResolvingMetadata } from 'next';
import { readFile } from 'fs/promises'; // For generateMetadata
import { join } from 'path'; // For generateMetadata

interface ServerFileMetadata { // More complete metadata for server-side generation
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
}

const metadataFilePath = join(process.cwd(), 'uploads', 'metadata.json');
const defaultOgImageUrl = '/og-default.png'; // Ensure this image exists in public/
const siteName = 'FileShareX';

async function getFileMetadata(fileId: string): Promise<ServerFileMetadata | null> {
  try {
    const data = await readFile(metadataFilePath, 'utf-8');
    const allMetadata = JSON.parse(data) as ServerFileMetadata[];
    const metadata = allMetadata.find(m => m.fileId === fileId);
    return metadata || null;
  } catch (error) {
    console.error('Error reading metadata for generateMetadata:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { fileId: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const fileId = params.fileId;
  const metadata = await getFileMetadata(fileId);
  const parentMetadata = await parent; // Access resolved metadata from parent (layout.tsx)

  if (!metadata) {
    return {
      title: `File Not Found | ${siteName}`,
      description: 'The file you are looking for could not be found or is no longer available.',
      openGraph: {
        ...parentMetadata.openGraph,
        title: `File Not Found | ${siteName}`,
        description: 'The file you are looking for could not be found or is no longer available.',
        images: [{ url: defaultOgImageUrl, alt: `${siteName} - File Not Found` }],
      },
      twitter: {
        ...parentMetadata.twitter,
        title: `File Not Found | ${siteName}`,
        description: 'The file you are looking for could not be found or is no longer available.',
        images: [defaultOgImageUrl],
      },
    };
  }

  const fileName = metadata.originalFilename;
  const fileSizeFormatted = formatBytes(metadata.fileSize); // Use existing helper
  const title = `Download ${fileName}`;
  const description = `Download ${fileName} (${fileSizeFormatted}). Shared via ${siteName}.`;
  // Note: Expiry info is hard to get here without more complex date logic, keeping it simple for now.

  return {
    title: title, // title.template from layout will append "| FileShareX"
    description: description,
    openGraph: {
      ...parentMetadata.openGraph, // Inherit base OG tags
      title: title, // Override specific OG title
      description: description,
      // Using default image; using file as OG image is complex & has security risks
      images: [{ url: defaultOgImageUrl, alt: `Download ${fileName} on ${siteName}` }],
      // Could add specific OG type if relevant, e.g., 'article' if it's a document
      // type: 'article', 
      // publishedTime: new Date(metadata.uploadTimestamp).toISOString(), // Example
    },
    twitter: {
      ...parentMetadata.twitter, // Inherit base Twitter tags
      title: title,
      description: description,
      images: [defaultOgImageUrl],
    },
  };
}


// Helper function to format bytes (already in the file, ensure it's accessible or duplicate if needed for server context)
// Helper function to format bytes - ensure it's defined if not already accessible
// It was defined below, so this is fine.
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper function to calculate expiry information
function getExpiryInfo(metadata: PublicFileMetadata): { text: string; expired: boolean; colorClass: string } {
  if (metadata.expiryType === 'days' && metadata.expiryValue) {
    const expiryDate = new Date(metadata.uploadTimestamp);
    expiryDate.setDate(expiryDate.getDate() + metadata.expiryValue);
    const now = new Date();
    if (now > expiryDate) {
      return { text: 'Link has expired (date).', expired: true, colorClass: 'text-red-500' };
    }
    const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { text: `Expires in ${diffDays} day(s).`, expired: false, colorClass: 'text-green-600 dark:text-green-400' };
  } else if (metadata.expiryType === 'downloads' && metadata.expiryValue !== undefined) {
    if (metadata.downloadCount >= metadata.expiryValue) {
      return { text: 'Download limit reached.', expired: true, colorClass: 'text-red-500' };
    }
    const remaining = metadata.expiryValue - metadata.downloadCount;
    return { text: `Expires after ${remaining} more download(s).`, expired: false, colorClass: 'text-green-600 dark:text-green-400' };
  }
  return { text: 'No specific expiry set.', expired: false, colorClass: 'text-gray-500 dark:text-gray-400' };
}


export default function DownloadPage() {
  const params = useParams();
  const fileId = params?.fileId as string | undefined;
  const router = useRouter();

  const [metadata, setMetadata] = useState<PublicFileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);


  const isImage = metadata?.fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(metadata.fileExtension.toLowerCase());

  useEffect(() => {
    if (fileId) {
      fetch(`/api/metadata/${fileId}`)
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to fetch metadata: ${res.status}`);
          }
          return res.json();
        })
        .then((data: PublicFileMetadata) => {
          setMetadata(data);
          if (!data.isPasswordProtected) {
            setDownloadUrl(`/api/download/${data.fileId}`);
          }
          // Check for immediate expiry from metadata (e.g. if API already determined it)
          const expiryInfo = getExpiryInfo(data);
          if (expiryInfo.expired) {
            setError(expiryInfo.text);
          }
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'Could not retrieve file information.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setError('File ID is missing.');
      setIsLoading(false);
    }
  }, [fileId]);

  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!metadata || !password) {
      setPasswordError('Password cannot be empty.');
      return;
    }
    setPasswordError(null);

    // Attempt to fetch the file with the password to verify.
    // This also serves as a check if the download link is valid with this password.
    const testDownloadUrl = `/api/download/${metadata.fileId}?password=${encodeURIComponent(password)}`;
    try {
        const res = await fetch(testDownloadUrl, { method: 'HEAD' }); // Use HEAD to check headers, not download
        if (res.ok) {
            setDownloadUrl(testDownloadUrl); // Password is correct, allow download and preview
            // The actual download will happen when the user clicks the download button or views preview
        } else if (res.status === 401 || res.status === 403) {
            const errorData = await res.json();
            if (errorData.code === 'PASSWORD_REQUIRED' && !password) {
                 setPasswordError('Password is required to download this file.');
            } else if (errorData.code === 'INCORRECT_PASSWORD') {
                 setPasswordError('Incorrect password. Please try again.');
            } else {
                 setPasswordError(errorData.error || 'Failed to unlock with password.');
            }
            setDownloadUrl(null);
        } else if (res.status === 410) { // Link expired (date or downloads)
            const errorData = await res.json();
            setError(errorData.error || 'This link has expired.');
            setDownloadUrl(null);
        }
         else {
            setPasswordError('An unexpected error occurred while verifying the password.');
            setDownloadUrl(null);
        }
    } catch (err) {
        console.error("Error verifying password:", err);
        setPasswordError('Could not verify password. Check your connection.');
        setDownloadUrl(null);
    }
  };

  const expiryDetails = metadata ? getExpiryInfo(metadata) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <InformationCircleIcon className="h-12 w-12 text-blue-500 animate-pulse mb-4" />
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading file details...</p>
      </div>
    );
  }

  if (error || (expiryDetails && expiryDetails.expired && !metadata?.isPasswordProtected)) { // If already expired and no password needed to check again
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">Download Error</h1>
        <p className="text-gray-600 dark:text-gray-300">{error || 'This link is no longer available.'}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  if (!metadata) {
    // This case should ideally be covered by the error state from fetch, but as a fallback:
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl text-gray-700 dark:text-gray-300">File not found.</p>
         <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Homepage
        </button>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 truncate" title={metadata.originalFilename}>
          {metadata.originalFilename}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Size: {formatBytes(metadata.fileSize)}
        </div>
        {metadata.fileExtension && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Type: .{metadata.fileExtension}
          </div>
        )}
        {expiryDetails && (
            <div className={`text-sm mb-6 ${expiryDetails.expired ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Status: {expiryDetails.text}
            </div>
        )}

        {/* Virus Scan Status */}
        {metadata.virusScanStatus && (
          <div className={`text-sm mb-1 ${metadata.virusScanStatus === 'infected' ? 'text-red-500 dark:text-red-400 font-semibold' : metadata.virusScanStatus === 'pending' ? 'text-yellow-500 dark:text-yellow-400' : 'text-green-500 dark:text-green-400'}`}>
            Virus Scan: {metadata.virusScanStatus.charAt(0).toUpperCase() + metadata.virusScanStatus.slice(1)}
          </div>
        )}
        {metadata.virusScanStatus === 'infected' && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                This file has been flagged as potentially harmful and cannot be downloaded.
            </p>
        )}


        {/* Password Form */}
        {metadata.isPasswordProtected && !downloadUrl && !expiryDetails?.expired && metadata.virusScanStatus !== 'infected' && (
          <form onSubmit={handlePasswordSubmit} className="mb-6 space-y-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
              <LockClosedIcon className="h-5 w-5 mr-2" /> This file is password protected.
            </p>
            <div>
              <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Enter Password:
              </label>
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <LockClosedIcon className="h-5 w-5 mr-2" /> Unlock
            </button>
          </form>
        )}

        {/* Download Button and Preview */}
        {downloadUrl && !expiryDetails?.expired && metadata.virusScanStatus !== 'infected' && (
          <div className="space-y-6">
            {isImage && (
              <div className="preview-section border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-2"
                >
                  <EyeIcon className="h-5 w-5 mr-1" /> {showPreview ? 'Hide' : 'Show'} Preview
                </button>
                {showPreview && (
                  <div className="mt-2 border dark:border-gray-600 rounded-md overflow-hidden max-h-96 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
                    <img
                      src={downloadUrl} // Use the (potentially passworded) download URL for preview
                      alt={`Preview of ${metadata.originalFilename}`}
                      className="max-w-full max-h-96 object-contain"
                      onError={() => {
                        setShowPreview(false);
                        setError('Preview could not be loaded. The file might be corrupted or not a displayable image.');
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <a
              href={downloadUrl}
              download={metadata.originalFilename} // Suggests original filename to browser
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
            >
              <ArrowDownTrayIcon className="h-6 w-6 mr-3" />
              Download Now
            </a>
          </div>
        )}
         {/* Message if link is valid but password not yet entered or downloadUrl not set and not expired */}
        {!downloadUrl && !metadata.isPasswordProtected && !expiryDetails?.expired && (
             <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">Your download should be ready.</p>
                 {/* This case might indicate an issue if downloadUrl isn't set for a non-password protected file */}
            </div>
        )}

        {/* Report Abuse Button */}
        {!expiryDetails?.expired && metadata.virusScanStatus !== 'infected' && (
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-xs text-red-500 dark:text-red-400 hover:underline flex items-center justify-center mx-auto"
            >
              <ShieldExclamationIcon className="h-4 w-4 mr-1" /> Report Abuse
            </button>
          </div>
        )}
        {reportSuccessMessage && (
            <div className="mt-4 p-2 text-sm bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200 rounded-md">
                {reportSuccessMessage}
            </div>
        )}


        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Upload another file
          </button>
        </div>
      </div>

      {metadata && (
        <ReportAbuseModal
          fileId={metadata.fileId}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmitSuccess={(message) => {
            setReportSuccessMessage(message);
            setIsReportModalOpen(false); // Close modal on success
            setTimeout(() => setReportSuccessMessage(null), 5000); // Clear message after 5s
          }}
        />
      )}
    </div>
  );
}
