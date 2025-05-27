import { LoginForm } from '@/components/auth/LoginForm';
import React from 'react';

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
