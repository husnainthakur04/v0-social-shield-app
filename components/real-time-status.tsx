"use client"

import { useEffect, useState } from "react"
import { Activity, Shield, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useRealTimeStore } from "@/lib/real-time-store"
import { useAppStore } from "@/lib/store"
import { appUsageTracker } from "@/services/app-usage-tracker"
import { notificationService } from "@/services/notification-service"

export function RealTimeStatus() {
  const { toast } = useToast()
  const { isTracking, startTracking, stopTracking, permissionsGranted, backgroundServiceActive, lastSyncTime } =
    useRealTimeStore()
  const { apps } = useAppStore()

  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)

  // Format the last sync time
  const formatLastSync = () => {
    if (!lastSyncTime) return "Never"

    const now = Date.now()
    const diff = now - lastSyncTime

    if (diff < 60000) {
      return "Just now"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`
    } else {
      return new Date(lastSyncTime).toLocaleTimeString()
    }
  }

  // Check permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermissions = await appUsageTracker.checkPermissions()
      if (!hasPermissions && !showPermissionPrompt) {
        setShowPermissionPrompt(true)
      }
    }

    checkPermissions()
  }, [])

  // Toggle tracking
  const toggleTracking = async () => {
    if (isTracking) {
      stopTracking()
      toast({
        title: "Tracking stopped",
        description: "App usage tracking has been paused.",
      })
    } else {
      // Check permissions before starting
      const hasPermissions = await appUsageTracker.checkPermissions()

      if (!hasPermissions) {
        const granted = await appUsageTracker.requestPermissions()
        if (!granted) {
          toast({
            title: "Permission required",
            description: "Usage access permission is required for tracking.",
            variant: "destructive",
          })
          return
        }
      }

      startTracking()
      toast({
        title: "Tracking started",
        description: "App usage is now being monitored in real-time.",
      })
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission()
    if (granted) {
      toast({
        title: "Notifications enabled",
        description: "You'll receive alerts when approaching time limits.",
      })
    } else {
      toast({
        title: "Notifications disabled",
        description: "You won't receive alerts about your app usage.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-teal-200 dark:border-teal-800">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
            <h3 className="font-medium">Real-Time Monitoring</h3>
          </div>
          <Badge variant={isTracking ? "default" : "outline"} className={isTracking ? "bg-green-600" : ""}>
            {isTracking ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">App Usage Tracking</span>
            </div>
            <Switch checked={isTracking} onCheckedChange={toggleTracking} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Notifications</span>
            </div>
            <Button variant="ghost" size="sm" onClick={requestNotificationPermission}>
              Test
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Last Sync</span>
            </div>
            <span className="text-sm text-gray-500">{formatLastSync()}</span>
          </div>
        </div>

        {!permissionsGranted && showPermissionPrompt && (
          <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md text-sm">
            <p className="text-amber-800 dark:text-amber-200 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Usage access permission required
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full bg-amber-100 dark:bg-amber-900"
              onClick={async () => {
                const granted = await appUsageTracker.requestPermissions()
                if (granted) {
                  setShowPermissionPrompt(false)
                }
              }}
            >
              Grant Permission
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
