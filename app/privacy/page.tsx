import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the FileShareX Privacy Policy to understand how we handle your data, file uploads, and personal information when you use our file sharing service.',
  openGraph: {
    title: 'FileShareX Privacy Policy',
    description: 'Learn about data collection, usage, sharing, and retention practices at FileShareX. Your privacy is important to us.',
  },
  twitter: {
    title: 'FileShareX Privacy Policy',
    description: 'Learn about data collection, usage, sharing, and retention practices at FileShareX.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>This Privacy Policy describes how FileShareX ("we", "us", or "our") collects, uses, and shares information when you use our file sharing service (the "Service").</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
          <p><strong>Files You Upload:</strong> We temporarily store files you upload to provide the sharing service. Metadata associated with these files (like filename, size, upload date, password if set, and expiry options) is also stored.</p>
          <p><strong>Usage Information:</strong> We may collect information about how you interact with the Service, such as IP addresses, browser type, access times, and referring URLs. This is for analytical purposes and to improve our service.</p>
          <p><strong>Abuse Reports:</strong> If you submit an abuse report, we collect the information you provide, such as your email (optional), the reason for the report, and comments.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Information</h2>
          <p>To provide and maintain the Service.</p>
          <p>To monitor and analyze usage to improve the Service.</p>
          <p>To address abuse reports and enforce our Terms of Service.</p>
          <p>To protect the security and integrity of our Service.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Information Sharing</h2>
          <p>We do not sell your personal information.</p>
          <p>Uploaded files are accessible via their unique share links. If password-protected, the password is required for access.</p>
          <p>We may disclose information if required by law or in response to valid requests by public authorities.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Data Retention</h2>
          <p>Files are retained according to their expiry settings. Once expired or if the system cleans up old files, they are deleted from our servers.</p>
          <p>Metadata may be retained for longer periods for analytical and operational purposes.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Security</h2>
          <p>We take reasonable measures to protect the information provided via the Service, but no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <p className="mt-8 text-sm">
            <em>This Privacy Policy is a template and should be reviewed and customized by a legal professional to accurately reflect your data practices. This is placeholder content.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
