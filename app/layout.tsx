import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/AuthContext" // Re-add AuthProvider
// import { Header } from "@/components/header";
// If Header was meant to be directly in RootLayout, that's a different structure.
// The current RootLayout does not directly render a Header. The Header is typically part of the page content or a sub-layout.
// So, no change needed here for Header unless it was incorrectly placed in RootLayout previously.

const siteName = 'FileShareX';
const defaultDescription = 'Easily upload, share, and download files with optional password protection and expiry settings. No sign-up needed for quick and secure file sharing.';
const defaultOgImageUrl = '/og-default.png'; // Ensure this image exists in public/

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), // Required for absolute OG image URLs
  title: {
    default: `${siteName} - Easy File Upload and Sharing`,
    template: `%s | ${siteName}`, // Allows child pages to customize (e.g., "About Us | FileShareX")
  },
  description: defaultDescription,
  manifest: "/manifest.json", // Assuming you have one
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  openGraph: {
    type: 'website',
    siteName: siteName,
    title: {
        default: siteName,
        template: `%s | ${siteName}`
    },
    description: defaultDescription,
    images: [
      {
        url: defaultOgImageUrl,
        width: 1200, // Specify width
        height: 630, // Specify height
        alt: `Preview image for ${siteName}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: siteName,
        template: `%s | ${siteName}`
    },
    description: defaultDescription,
    images: [defaultOgImageUrl], // Must be an absolute URL or path from public/
    // site: '@yourTwitterHandle', // Optional: Your Twitter handle
  },
  // Favicons - Next.js will automatically look for files like icon.png, apple-icon.png in app/ or public/
  // Or you can specify them directly:
  icons: {
    // icon: '/icon.png', // Commented out due to placeholder being an empty file causing build errors. Next.js might auto-detect app/icon.png if valid.
    shortcut: '/favicon.ico', // Example
    apple: '/apple-icon.png', // Example
    // other: [
    //   { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
    //   { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    // ],
  },
  // For good measure, though not strictly part of OG/Twitter
  keywords: ['file sharing', 'upload files', 'secure sharing', 'download files', 'ephemeral storage'],
  authors: [{ name: 'FileShareX Team' }],
  creator: 'FileShareX Team',
  publisher: 'FileShareX',
  // generator: 'v0.dev' // This was in the original, can be kept or removed
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overscroll-none flex flex-col min-h-screen" style={{ margin: 0, padding: 0 }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider> {/* Re-add AuthProvider */}
            <div className="flex-grow">
              {children} {/* This will render the simplified page.tsx */}
            </div>
            <Toaster />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
