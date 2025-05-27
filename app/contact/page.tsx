import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the FileShareX team. We welcome your questions, feedback, and inquiries about our file sharing service.',
  openGraph: {
    title: 'Contact FileShareX',
    description: 'Reach out to FileShareX for support, inquiries, or feedback. We are here to help you with your file sharing needs.',
  },
  twitter: {
    title: 'Contact FileShareX',
    description: 'Reach out to FileShareX for support, inquiries, or feedback.',
  },
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Us</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>If you have any questions, concerns, or feedback regarding FileShareX, please feel free to reach out to us. We value your input and are here to help.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">General Inquiries</h2>
          <p>For general questions about our service, features, or how to use FileShareX, please email us at:</p>
          <p><a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">support@example.com</a> (This is a placeholder email)</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Technical Support</h2>
          <p>If you are experiencing technical difficulties or have found a bug, please contact our support team with detailed information about the issue:</p>
          <p><a href="mailto:techsupport@example.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">techsupport@example.com</a> (This is a placeholder email)</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Abuse Reports</h2>
          <p>To report abuse or a violation of our Terms of Service, please use the "Report Abuse" button found on the download page of the respective file. For general information on reporting abuse, see our <a href="/report-abuse-info" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">Report Abuse Information page</a>.</p>
          
          <p className="mt-8 text-sm">
            <em>Please note: The contact email addresses provided are placeholders. This page will be updated with actual contact information.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
