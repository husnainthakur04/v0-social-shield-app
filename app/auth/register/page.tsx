import { RegisterForm } from '@/components/auth/RegisterForm';
import React from 'react';

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
