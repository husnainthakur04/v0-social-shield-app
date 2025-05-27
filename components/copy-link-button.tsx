'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons is available

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Optionally, display an error message to the user
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000); // Reset copied state after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-colors
                  ${copied
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${copied ? 'focus:ring-green-400' : 'focus:ring-blue-400'}`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy link to clipboard'}
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5 mr-1" /> Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="h-5 w-5 mr-1" /> Copy
        </>
      )}
    </button>
  );
}

// Helper function to ensure Heroicons are installed or provide fallbacks
// This is more of a conceptual note for a real project.
// For this environment, we assume necessary icons are available if @heroicons/react is part of the project.
// If not, replace CheckIcon and ClipboardIcon with simple text or SVGs.

// Example of simple text fallback if Heroicons are not used:
// {copied ? 'Copied!' : 'Copy'}
