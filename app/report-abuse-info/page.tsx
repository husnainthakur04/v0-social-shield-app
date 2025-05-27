import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Abuse Information',
  description: 'Learn how to report abuse on FileShareX, what types of content to report, and what happens after a report is submitted. Help us maintain a safe platform.',
  openGraph: {
    title: 'FileShareX Abuse Reporting Information',
    description: 'Understand the process for reporting content that violates our policies. Your reports help keep FileShareX secure.',
  },
  twitter: {
    title: 'FileShareX Abuse Reporting Information',
    description: 'Understand the process for reporting content that violates our policies.',
  },
};

export default function ReportAbuseInfoPage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reporting Abuse</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>FileShareX is committed to maintaining a safe and respectful environment for all users. We take violations of our Terms of Service and illegal activities very seriously.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">How to Report Abuse</h2>
          <p>If you encounter a file on our platform that you believe violates our policies or is illegal, please report it to us immediately.</p>
          <p>The primary way to report a specific file is by using the <strong>"Report Abuse"</strong> button located on the download page for that file. This button will open a form where you can specify the reason for your report and provide additional comments.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">What to Report</h2>
          <p>You should report content that includes, but is not limited to:</p>
          <ul>
            <li>Copyright Infringement (e.g., unauthorized sharing of movies, music, software).</li>
            <li>Malware, viruses, or other harmful software.</li>
            <li>Illegal content (e.g., child exploitation material, incitement to violence).</li>
            <li>Content that violates our <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">Terms of Service</Link>.</li>
            <li>Harassment, hate speech, or other abusive content.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">What Happens After a Report?</h2>
          <p>Once a report is submitted, our team will review the reported content and the information you provided. We aim to investigate reports promptly.</p>
          <p>If we find that the content violates our policies, we will take appropriate action, which may include:</p>
          <ul>
            <li>Removing the content from our platform.</li>
            <li>Restricting access to the content.</li>
            <li>In severe cases, reporting the incident to law enforcement authorities.</li>
          </ul>
          <p>Please note that due to privacy considerations, we may not always be able to provide you with specific details about the outcome of our investigation.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Contact for Urgent Matters</h2>
          <p>If you believe there is an urgent matter that requires immediate attention outside of the standard reporting process for a specific file, please contact us via the details on our <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">Contact Us page</Link>, clearly indicating the urgency.</p>
          
          <p className="mt-8 text-sm">
            <em>Thank you for helping us keep FileShareX a safe platform. This page provides general information; specific reporting should be done via the download page of the file in question.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
