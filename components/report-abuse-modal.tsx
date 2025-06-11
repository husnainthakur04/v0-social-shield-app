'use client';

import { useState, FormEvent } from 'react';
import { XMarkIcon, AlertCircle, CheckCircle2 } from '@heroicons/react/24/outline'; // Using Heroicons as they are already imported
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReportAbuseModalProps {
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (message: string) => void;
}

export function ReportAbuseModal({ fileId, isOpen, onClose, onSubmitSuccess }: ReportAbuseModalProps) {
  const [reason, setReason] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!reason) {
      setError('Please select a reason for reporting.');
      return;
    }
    if (!comments) {
      setError('Please provide some comments explaining your report.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/report-abuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          reason,
          reporterEmail: reporterEmail || undefined, // Send undefined if empty, API handles it
          comments,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to submit report: ${response.status}`);
      }

      setSuccessMessage(result.message || 'Report submitted successfully.');
      onSubmitSuccess(result.message || 'Report submitted successfully.'); // Notify parent
      // Reset form or close modal after a delay
      setTimeout(() => {
        onClose(); // Close modal after successful submission
        setReason('');
        setReporterEmail('');
        setComments('');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Report Abuse for File ID: {fileId}</h2>

        {successMessage && (
           <Alert variant="default" className="mb-4 bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-700 dark:text-green-300">Report Submitted</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-400">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!successMessage && ( // Keep the form visible if there's an error, hide if success until modal closes
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Reason for reporting <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a reason...</option>
                <option value="copyright">Copyright Infringement</option>
                <option value="malware">Malware / Virus</option>
                <option value="illegal">Illegal Content</option>
                <option value="terms_of_service">Terms of Service Violation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Your Email (Optional)
              </label>
              <input
                type="email"
                id="reporterEmail"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                placeholder="Please provide details about the issue."
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 disabled:bg-red-300 dark:disabled:bg-red-800"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
