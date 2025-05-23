"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the dashboard component with SSR disabled
const DashboardComponent = dynamic(() => import("./dashboard").then((mod) => ({ default: mod.Dashboard })), {
  ssr: false,
  loading: () => <DashboardLoading />,
})

function DashboardLoading() {
  return (
    <div className="p-4 space-y-6">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    </div>
  )
}

export function DashboardWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardLoading />
  }

  return <DashboardComponent />
}
