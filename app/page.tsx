export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-center">
import { UploadForm } from '@/components/upload-form'; // Import the new component

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
        {/* The "Upload File" button from the hero section is effectively replaced by the UploadForm.
            If a separate Hero CTA button is desired that *scrolls* to the UploadForm or opens it in a modal,
            that can be added. For now, the form itself will be directly visible. */}
      </section>

      {/* Upload Area */}
      <section id="upload-area" className="upload-area w-full max-w-lg mb-16">
        <UploadForm />
      </section>

      {/* Key Features Section */}
      <section className="key-features-section w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">Why Choose Our Service?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-item p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Unlimited Free Downloads</h3>
            <p className="text-gray-600 dark:text-gray-400">No limits on how many times your files are downloaded.</p>
          </div>
          <div className="feature-item p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">No Sign-Up Required</h3>
            <p className="text-gray-600 dark:text-gray-400">Quickly upload and share without creating an account.</p>
          </div>
          <div className="feature-item p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Secure File Storage</h3>
            <p className="text-gray-600 dark:text-gray-400">Your files are stored securely (details coming soon!).</p>
          </div>
          <div className="feature-item p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Fast Upload/Download</h3>
            <p className="text-gray-600 dark:text-gray-400">Optimized for speed and efficiency.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
