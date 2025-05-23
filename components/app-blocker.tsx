"use client"

import { useState, useEffect } from "react"
import { Shield, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"
import { getAppIcon } from "@/lib/utils"
import { appBlocker } from "@/lib/client-services"

export function AppBlocker() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [blockedApps, setBlockedApps] = useState<any[]>([])
  const [blockingEnabled, setBlockingEnabled] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (appBlocker) {
        try {
          const apps = appBlocker.getBlockedApps()
          setBlockedApps(apps || [])
          setBlockingEnabled(appBlocker.isEnabled())
        } catch (error) {
          console.error("Error loading blocked apps:", error)
          setBlockedApps([])
        }
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleBlocking = () => {
    const newState = !blockingEnabled
    setBlockingEnabled(newState)
    if (appBlocker) {
      appBlocker.setEnabled(newState)
    }

    toast({
      title: `App Blocking ${newState ? "Enabled" : "Disabled"}`,
      description: newState
        ? "Apps will be blocked when they reach their time limit"
        : "Apps will not be blocked when they reach their time limit",
    })
  }

  // Render app icon
  const renderAppIcon = (iconName: string, className = "h-5 w-5") => {
    const IconComponent = getAppIcon(iconName)
    return <IconComponent className={className} />
  }

  return (
    <AnimatedSection animation="slide-up" delay={0.1} duration={0.5}>
      <Card className={blockingEnabled ? "border-teal-500" : "border-gray-200 dark:border-gray-800"}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  blockingEnabled ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"
                } mr-3 dark:bg-gray-800`}
              >
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">App Blocking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {blockingEnabled
                    ? "Apps will be blocked when they reach their time limit"
                    : "Apps will not be blocked when they reach their time limit"}
                </p>
              </div>
            </div>
            <Switch checked={blockingEnabled} onCheckedChange={toggleBlocking} />
          </div>

          {blockingEnabled && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Currently Blocked Apps</h4>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" /> Active
                </Badge>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-16 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              ) : blockedApps.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {blockedApps.map((app, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <div className={`p-1.5 rounded-full ${app.bgColor} mb-1`}>
                        {renderAppIcon(app.icon, `h-4 w-4 ${app.color.replace("bg-", "text-")}`)}
                      </div>
                      <span className="text-xs truncate w-full text-center">{app.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">No apps currently blocked</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Apps will appear here when they reach their time limit
                    </p>
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full mt-3">
                View Blocking Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
