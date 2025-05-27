import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us', // Will be combined with siteName template from layout
  description: 'Learn more about FileShareX, our mission for easy and secure file sharing, and the key features of our platform.',
  openGraph: {
    title: 'About FileShareX', // Explicit OG title
    description: 'Discover FileShareX: a platform dedicated to simple, secure, and efficient file sharing for everyone.',
    // Images will be inherited from layout unless specified
  },
  twitter: {
    title: 'About FileShareX',
    description: 'Discover FileShareX: a platform dedicated to simple, secure, and efficient file sharing for everyone.',
    // Images will be inherited from layout unless specified
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]"> {/* Adjust min-h as needed based on header/footer height */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">About Us</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>Welcome to FileShareX! We are dedicated to providing a seamless and secure file sharing experience.</p>
          <p>Our mission is to offer a platform that is easy to use, respects your privacy, and ensures your files are handled with care. Whether you're sharing documents for work, photos with family, or any other type of file, FileShareX is designed to make the process straightforward and efficient.</p>
          <p>Key features of our service include:</p>
          <ul>
            <li>Simple drag-and-drop uploading.</li>
            <li>Optional password protection for your files.</li>
            <li>Customizable expiry settings for your links.</li>
            <li>No account required for quick uploads and downloads.</li>
          </ul>
          <p>This platform is continuously evolving, and we are committed to adding new features and improvements based on user feedback and technological advancements.</p>
          <p>Thank you for choosing FileShareX. We hope you find our service valuable.</p>
          <p className="mt-6 text-sm">
            <em>Content for this page is currently a placeholder and will be updated with more detailed information.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
