"use client"

import { useEffect, useState } from "react"
import { FocusMode } from "./focus-mode"

export function FocusModeWrapper() {
  const [mounted, setMounted] = useState(false)

  // Only show the component after it's mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return (
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <div className="mr-2 w-5 h-5 bg-gray-200 rounded-full"></div>
            Focus Mode
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return <FocusMode />
}
