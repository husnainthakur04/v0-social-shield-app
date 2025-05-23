"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the focus mode component with SSR disabled
const FocusMode = dynamic(() => import("./focus-mode").then((mod) => ({ default: mod.FocusMode })), {
  ssr: false,
  loading: () => <FocusModeLoading />,
})

function FocusModeLoading() {
  return (
    <div className="p-4 space-y-6">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    </div>
  )
}

export default function FocusModeClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FocusModeLoading />
  }

  return <FocusMode />
}
