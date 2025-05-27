'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header'; // Assuming a generic header for dashboard

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">Loading Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This will likely be brief as the useEffect should redirect.
    // Or, if preferred, this can be the main way to show "access denied" before redirect.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
        <p className="text-gray-700 dark:text-gray-300">You must be logged in to view this page.</p>
        <button
            onClick={() => router.push('/auth/login?redirect=/dashboard')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      {/* The main app layout already includes a header. 
          If a specific dashboard header is needed, it can be added here or handled by layout.
          For now, assuming the global header from layout.tsx is sufficient.
          If a different title is needed for this page in the existing header:
          <Header title="My Dashboard" /> 
          But the current Header component might need adjustment to accept title dynamically from pages.
          For this iteration, we'll rely on the global header.
      */}
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome, {user?.email}!
          </h1>
          
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Your Files</h2>
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                  (Placeholder) History of your uploads and downloads will be displayed here.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  (Placeholder) Ability to manage and delete your uploaded files will be available here.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Account Details</h2>
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                 <p className="text-sm text-gray-600 dark:text-gray-300">User ID: <span className="font-mono text-xs">{user?.userId}</span></p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">Registered on: <span className="font-mono text-xs">{user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}</span></p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
