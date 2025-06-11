import { UploadForm } from '@/components/upload-form'; // Restore UploadForm

import { UploadForm } from '@/components/upload-form';
import { DownloadCloud, UserX, ShieldCheck, Zap } from 'lucide-react'; // Import selected icons

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-center">
      {/* Hero Section */}
      <section className="hero-section mb-10 md:mb-16 w-full max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Upload. Share. Download Instantly.
        </h1>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
          Easily upload files and get a shareable download link—no sign-up needed.
        </p>
      </section>

      {/* Upload Area */}
      <section id="upload-area" className="upload-area w-full max-w-lg mb-16">
        <UploadForm />
      </section>

      {/* Key Features Section */}
      <section className="key-features-section w-full max-w-5xl"> {/* Increased max-w for better spacing with icons potentially */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">Why Choose Our Service?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Feature 1 */}
          <div className="feature-item flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <DownloadCloud className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Unlimited Free Downloads</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No limits on how many times your files are downloaded.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-item flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <UserX className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">No Sign-Up Required</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Quickly upload and share without creating an account.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-item flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ShieldCheck className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Secure File Storage</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Your files are stored securely (details coming soon!).</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-item flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Fast Upload/Download</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Optimized for speed and efficiency.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
