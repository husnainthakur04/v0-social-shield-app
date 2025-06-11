'use client';

import { useState, DragEvent, ChangeEvent } from 'react';
// import { CopyLinkButton } from './copy-link-button'; // Temporarily commented out during debug, will keep basic button for now
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // For simulated progress
  const [uploadResponse, setUploadResponse] = useState<{ fileId: string; fullUrl?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryOption, setExpiryOption] = useState('7days'); // Default expiry

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResponse(null);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Add some visual indication if needed
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResponse(null);
    }
    // Reset visual indication
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResponse(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (showPasswordInput && password) {
      formData.append('password', password);
    }
    formData.append('expiryOption', expiryOption);
    // formData.append('customFilename', selectedFile.name); // If filename editing is implemented

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 200); // Adjust timing for simulation

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval); // Stop simulation on actual response
      setUploadProgress(100); // Mark as complete

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      // Construct the full URL for display and copying
      const fullUrl = `${window.location.origin}/download/${result.fileId}`;
      setUploadResponse({ ...result, fullUrl });
      setSelectedFile(null); // Clear selection
      setShowPasswordInput(false); // Reset password field
      setPassword('');
      setExpiryOption('7days'); // Reset expiry
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during upload.');
      setUploadProgress(0); // Reset progress on error
    } finally {
      setIsUploading(false);
      if (progress < 100 && !isUploading) { // Ensure interval is cleared if upload finishes early or errors out
        clearInterval(interval);
      }
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="drag-drop-area border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 text-center mb-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
          accept="*" // Allow all file types, or specify (e.g., "image/*,application/pdf")
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <p className="text-gray-500 dark:text-gray-400">
            Drag & drop your file here, or click to select file
          </p>
        </label>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Max file size: 100MB</p>
      </div>

      {selectedFile && (
        <div className="selected-file-info mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          {/* Optional: File name editing input
          <input
            type="text"
            value={selectedFile.name}
            onChange={(e) => setSelectedFile(new File([selectedFile], e.target.value, { type: selectedFile.type }))}
            className="mt-2 w-full p-2 border rounded-md dark:bg-gray-600 dark:text-white"
          />
          */}
        </div>
      )}

      {/* Password Protection */}
      <div className="mb-4">
        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={showPasswordInput}
            onChange={(e) => {
              setShowPasswordInput(e.target.checked);
              if (!e.target.checked) setPassword(''); // Clear password if unchecked
            }}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Protect with password?
        </label>
        {showPasswordInput && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Expiry Settings */}
      <div className="mb-6">
        <label htmlFor="expiryOption" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          File expires after:
        </label>
        <select
          id="expiryOption"
          value={expiryOption}
          onChange={(e) => setExpiryOption(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1day">1 day</option>
          <option value="7days">7 days</option>
          <option value="30days">30 days</option>
          <option value="10downloads">10 downloads</option>
        </select>
      </div>

      {isUploading && (
        <div className="progress-bar-container mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 text-center mt-1">{uploadProgress}%</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || (showPasswordInput && !password)}
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition duration-150"
      >
        {isUploading ? 'Uploading...' : 'Upload File & Get Link'}
      </button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {uploadResponse && uploadResponse.fileId && (
        <Alert variant="default" className="mt-4 bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-300">Upload Successful!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            <p className="mb-2">Your download link is ready:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={uploadResponse.fullUrl || `Loading...`}
                className="w-full p-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500"
              />
              {/* Using basic copy button as per previous debugging steps */}
              {uploadResponse.fullUrl && (
                <button
                  onClick={() => navigator.clipboard.writeText(uploadResponse.fullUrl!)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Copy Link
                </button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
