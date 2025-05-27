'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin as checkIsAdminClientSide } from '@/lib/authUtils'; // Client-side check based on user object
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header'; // Using the global header

// Define interfaces for the data to be displayed
interface FileMetadataAdminView {
  fileId: string;
  originalFilename: string;
  uploadTimestamp: number;
  fileSize: number;
  userId?: string;
  virusScanStatus: 'pending' | 'clean' | 'infected';
  password?: string; // Will display 'Yes' or 'No'
  expiryType?: 'days' | 'downloads' | 'none';
  expiryValue?: number;
  downloadCount: number;
}

interface AbuseReportAdminView {
  reportId: string;
  fileId: string;
  reason: string;
  reporterEmail?: string;
  comments: string;
  timestamp: string;
}

// Helper to format bytes (can be moved to a utils file)
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [files, setFiles] = useState<FileMetadataAdminView[]>([]);
  const [abuseReports, setAbuseReports] = useState<AbuseReportAdminView[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      const isAdmin = checkIsAdminClientSide(user); // user object now has isAdmin flag from /me
      setIsAdminUser(isAdmin);
      if (!isAuthenticated || !isAdmin) {
        router.push('/'); // Redirect to homepage if not authenticated or not an admin
      } else {
        // Fetch admin data only if user is admin
        const fetchData = async () => {
          setIsLoadingData(true);
          setError(null);
          try {
            const [filesResponse, reportsResponse] = await Promise.all([
              fetch('/api/admin/files'),
              fetch('/api/admin/abuse-reports'),
            ]);

            if (!filesResponse.ok) {
              const filesError = await filesResponse.json();
              throw new Error(`Failed to fetch files: ${filesError.error || filesResponse.statusText}`);
            }
            const filesData = await filesResponse.json();
            setFiles(filesData);

            if (!reportsResponse.ok) {
              const reportsError = await reportsResponse.json();
              throw new Error(`Failed to fetch abuse reports: ${reportsError.error || reportsResponse.statusText}`);
            }
            const reportsData = await reportsResponse.json();
            setAbuseReports(reportsData);

          } catch (err: any) {
            console.error("Error fetching admin data:", err);
            setError(err.message);
          } finally {
            setIsLoadingData(false);
          }
        };
        fetchData();
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || (isAuthenticated && isAdminUser && isLoadingData)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdminUser) {
    // This state should ideally be brief due to redirection, or shown if redirection fails/is delayed
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
        <p className="text-gray-700 dark:text-gray-300">You do not have permission to view this page.</p>
         <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Go to Homepage
        </button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)] text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-6">Error Loading Data</h1>
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
         <button
            onClick={() => router.push('/')} // Or a retry button
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Assuming global header is sufficient. If a specific title for this page is needed in the header,
          the Header component would need to be adapted or a context used for page titles. */}
      <main className="container mx-auto px-2 sm:px-4 py-8 min-h-[calc(100vh-200px)]">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8">Admin Dashboard</h1>

          {/* Files Table Section */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Uploaded Files ({files.length})</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3">File ID</th>
                    <th scope="col" className="px-4 py-3">Filename</th>
                    <th scope="col" className="px-4 py-3">Uploaded</th>
                    <th scope="col" className="px-4 py-3">Size</th>
                    <th scope="col" className="px-4 py-3">User ID</th>
                    <th scope="col" className="px-4 py-3">Scan</th>
                    <th scope="col" className="px-4 py-3">Pwd</th>
                    <th scope="col" className="px-4 py-3">Expiry</th>
                    <th scope="col" className="px-4 py-3">DLs</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.fileId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-[100px]" title={file.fileId}>{file.fileId}</td>
                      <td className="px-4 py-2 truncate max-w-[150px]" title={file.originalFilename}>{file.originalFilename}</td>
                      <td className="px-4 py-2">{new Date(file.uploadTimestamp).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{formatBytes(file.fileSize)}</td>
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-[100px]" title={file.userId}>{file.userId || 'N/A'}</td>
                      <td className="px-4 py-2">{file.virusScanStatus}</td>
                      <td className="px-4 py-2">{file.password ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">{file.expiryType !== 'none' ? `${file.expiryValue} ${file.expiryType}` : 'None'}</td>
                      <td className="px-4 py-2">{file.downloadCount}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">Details</button>
                        <button className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {files.length === 0 && (
                    <tr><td colSpan={10} className="text-center py-4">No files found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Abuse Reports Table Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Abuse Reports ({abuseReports.length})</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3">Report ID</th>
                    <th scope="col" className="px-4 py-3">File ID</th>
                    <th scope="col" className="px-4 py-3">Reason</th>
                    <th scope="col" className="px-4 py-3">Reporter Email</th>
                    <th scope="col" className="px-4 py-3">Comments</th>
                    <th scope="col" className="px-4 py-3">Reported At</th>
                    <th scope="col" className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {abuseReports.map((report) => (
                    <tr key={report.reportId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-[100px]" title={report.reportId}>{report.reportId}</td>
                      <td className="px-4 py-2 font-mono text-xs truncate max-w-[100px]" title={report.fileId}>
                        <a href={`/download/${report.fileId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                          {report.fileId}
                        </a>
                      </td>
                      <td className="px-4 py-2">{report.reason}</td>
                      <td className="px-4 py-2 truncate max-w-[150px]" title={report.reporterEmail}>{report.reporterEmail || 'N/A'}</td>
                      <td className="px-4 py-2 truncate max-w-[200px]" title={report.comments}>{report.comments}</td>
                      <td className="px-4 py-2">{new Date(report.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">View File</button>
                        <button className="text-green-600 dark:text-green-400 hover:underline text-xs">Mark Resolved</button>
                      </td>
                    </tr>
                  ))}
                   {abuseReports.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-4">No abuse reports found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
