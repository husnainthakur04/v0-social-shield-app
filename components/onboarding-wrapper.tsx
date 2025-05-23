"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the onboarding component dynamically with SSR disabled
const OnboardingComponent = dynamic(() => import("./onboarding").then((mod) => ({ default: mod.Onboarding })), {
  ssr: false,
  loading: () => <OnboardingLoading />,
})

function OnboardingLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900 rounded-full"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 mx-auto w-1/2"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex justify-end">
            <div className="h-10 w-24 bg-teal-100 dark:bg-teal-900 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OnboardingWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <OnboardingLoading />
  }

  return <OnboardingComponent />
}
