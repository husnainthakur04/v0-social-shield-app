"use client"

import { useState, useEffect } from "react"
import { TimeLimits } from "./time-limits"
import { MobileLayout } from "./mobile-layout"
import { initializeServices } from "@/lib/client-services"

export function TimeLimitsWrapper() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize services
    initializeServices()
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <TimeLimits />
    </MobileLayout>
  )
}
