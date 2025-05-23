"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { appUsageTracker } from "@/services/app-usage-tracker"

interface PermissionsHandlerProps {
  onComplete: () => void
  visible?: boolean
}

export function PermissionsHandler({ onComplete, visible = false }: PermissionsHandlerProps) {
  const router = useRouter()

  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermissions = await appUsageTracker.checkPermissions()

      if (hasPermissions) {
        onComplete()
      }
    }

    checkPermissions()
  }, [onComplete])

  // Don't render anything unless explicitly set to visible
  if (!visible) {
    return null
  }

  return null // No UI shown on home page
}
