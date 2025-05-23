"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the settings component with SSR disabled
const SettingsComponent = dynamic(() => import("./settings").then((mod) => ({ default: mod.Settings })), {
  ssr: false,
  loading: () => <SettingsLoading />,
})

function SettingsLoading() {
  return (
    <div className="p-4 space-y-6">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    </div>
  )
}

export function SettingsWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <SettingsLoading />
  }

  return <SettingsComponent />
}
