import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review the Terms of Service for FileShareX. Understand your rights and responsibilities when using our file sharing platform.',
  openGraph: {
    title: 'FileShareX Terms of Service',
    description: 'Familiarize yourself with the conditions of use for FileShareX to ensure a safe and compliant file sharing experience.',
  },
  twitter: {
    title: 'FileShareX Terms of Service',
    description: 'Familiarize yourself with the conditions of use for FileShareX.',
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the FileShareX website (the "Service") operated by us.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Acceptance of Terms</h2>
          <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Use of Service</h2>
          <p>You agree not to use the Service for any unlawful purpose or to violate any laws in your jurisdiction.</p>
          <p>You are responsible for any content you upload and share through the Service. You must ensure you have the necessary rights to share such content.</p>
          <p>We reserve the right to remove any content that violates these Terms or is otherwise objectionable, without prior notice.</p>
          <p>Prohibited activities include, but are not limited to:</p>
          <ul>
            <li>Uploading or sharing copyrighted material without permission.</li>
            <li>Distributing malware, viruses, or other harmful software.</li>
            <li>Sharing illegal, abusive, or harassing content.</li>
            <li>Attempting to gain unauthorized access to our systems or user data.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of FileShareX and its licensors.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
          <p>In no event shall FileShareX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us through the contact information provided on our Contact Us page.</p>

          <p className="mt-8 text-sm">
            <em>These Terms of Service are a template and should be reviewed and customized by a legal professional. This is placeholder content.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
