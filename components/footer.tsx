import Link from 'next/link';
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Branding/Copyright (Optional) */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">FileShareX</h3>
            <p className="text-sm mt-1">
              &copy; {currentYear} FileShareX. All rights reserved.
            </p>
            <p className="text-xs mt-1">Simple & Secure File Sharing.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-100 mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal/Support */}
          <div className="text-center md:text-left">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-100 mb-2">Legal & Support</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/report-abuse-info" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Report Abuse Info</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-xs">
          <p>
            Disclaimer: This is a demo application. Do not upload sensitive personal data.
          </p>
        </div>
      </div>
    </footer>
  );
}
