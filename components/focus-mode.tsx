"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Focus, Clock, Shield, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { formatTimeRemaining } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"

// Import types only to avoid importing the actual implementation
import type { App } from "@/lib/store"

// Progress component
const Progress = ({
  value,
  className,
  indicatorClassName,
}: {
  value: number
  className?: string
  indicatorClassName?: string
}) => {
  return (
    <div className={`w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ${className || ""}`}>
      <div className={`h-full ${indicatorClassName || "bg-teal-500"}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export function FocusMode() {
  const router = useRouter()
  const { toast } = useToast()

  // Local state
  const [focusActive, setFocusActive] = useState(false)
  const [focusDuration, setFocusDuration] = useState(30)
  const [focusEndTime, setFocusEndTime] = useState(0)
  const [apps, setApps] = useState<App[]>([])
  const [allowCalls, setAllowCalls] = useState(true)
  const [allowSMS, setAllowSMS] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState("0:00")
  const [isLoaded, setIsLoaded] = useState(false)
  const [overLimitApps, setOverLimitApps] = useState<App[]>([])
  const [approachingLimitApps, setApproachingLimitApps] = useState<App[]>([])

  // Load data from store only on client side
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadStoreData = async () => {
      try {
        const { useAppStore } = await import("@/lib/store")
        const store = useAppStore.getState()

        setFocusActive(store.focusActive)
        setFocusDuration(store.focusDuration)
        setFocusEndTime(store.focusEndTime || 0)
        setApps(store.apps || [])

        // Calculate apps over limit and approaching limit
        const appsWithUsage = store.apps || []
        const over = appsWithUsage.filter((app) => app.usedTime > app.limit)
        const approaching = appsWithUsage.filter((app) => app.usedTime >= app.limit * 0.8 && app.usedTime <= app.limit)

        setOverLimitApps(over)
        setApproachingLimitApps(approaching)

        // Subscribe to store changes
        const unsubscribe = useAppStore.subscribe((state) => {
          setFocusActive(state.focusActive)
          setFocusDuration(state.focusDuration)
          setFocusEndTime(state.focusEndTime || 0)
          setApps(state.apps || [])

          const appsWithUsage = state.apps || []
          const over = appsWithUsage.filter((app) => app.usedTime > app.limit)
          const approaching = appsWithUsage.filter(
            (app) => app.usedTime >= app.limit * 0.8 && app.usedTime <= app.limit,
          )

          setOverLimitApps(over)
          setApproachingLimitApps(approaching)
        })

        setIsLoaded(true)
        return unsubscribe
      } catch (error) {
        console.error("Failed to load store data:", error)
        return () => {}
      }
    }

    const unsubscribe = loadStoreData()
    return () => {
      unsubscribe.then((fn) => fn())
    }
  }, [])

  // Update the timer every second when focus mode is active
  useEffect(() => {
    if (!focusActive || !focusEndTime) return

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(focusEndTime)
      setTimeRemaining(remaining)

      // Auto-end the session when time is up
      if (remaining === "0:00") {
        handleEndFocusSession()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [focusActive, focusEndTime])

  // Handle starting a focus session
  const handleStartFocusSession = async () => {
    try {
      const { useAppStore } = await import("@/lib/store")
      useAppStore.getState().startFocusSession()

      // Set local state
      setFocusActive(true)
      const endTime = Date.now() + focusDuration * 60 * 1000
      setFocusEndTime(endTime)

      // Try to block apps
      try {
        const { appBlocker } = await import("@/services/app-blocker")
        appBlocker.startBlocking(apps)
      } catch (error) {
        console.error("Failed to start app blocking:", error)
      }

      toast({
        title: "Focus mode activated",
        description: `All distractions will be blocked for ${focusDuration} minutes.`,
      })
    } catch (error) {
      console.error("Failed to start focus session:", error)
    }
  }

  // Handle ending a focus session
  const handleEndFocusSession = async () => {
    try {
      const { useAppStore } = await import("@/lib/store")
      useAppStore.getState().endFocusSession()

      // Set local state
      setFocusActive(false)
      setFocusEndTime(0)

      // Try to unblock apps
      try {
        const { appBlocker } = await import("@/services/app-blocker")
        appBlocker.stopBlocking()
      } catch (error) {
        console.error("Failed to stop app blocking:", error)
      }

      toast({
        title: "Focus mode ended",
        description: "Your focus session has been ended.",
      })
    } catch (error) {
      console.error("Failed to end focus session:", error)
    }
  }

  // Handle changing focus duration
  const handleDurationChange = async (value: string) => {
    try {
      const duration = Number.parseInt(value, 10)
      setFocusDuration(duration)

      const { useAppStore } = await import("@/lib/store")
      useAppStore.getState().setFocusDuration(duration)
    } catch (error) {
      console.error("Failed to change duration:", error)
    }
  }

  // Get app icon component
  const getAppIcon = (iconName: string) => {
    // Return a simple div as placeholder
    return () => <div className="w-5 h-5 rounded-full bg-current"></div>
  }

  // If not loaded yet, show a loading placeholder
  if (!isLoaded) {
    return (
      <div className="p-4 space-y-6">
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Focus className="mr-2 text-teal-600 dark:text-white" />
            Focus Mode
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Block distractions and stay focused</p>
        </div>
      </AnimatedSection>

      {/* Focus Mode Card */}
      <AnimatedSection animation="scale" delay={0.1} duration={0.6}>
        <Card
          className={`border-2 ${focusActive ? "border-teal-500 dark:border-white" : "border-gray-200 dark:border-gray-800"}`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`p-4 rounded-full ${focusActive ? "bg-teal-100 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <Shield
                  className={`h-10 w-10 ${focusActive ? "text-teal-600 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{focusActive ? "Focus Mode Active" : "Focus Mode"}</h2>
                {focusActive ? (
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-teal-600 dark:text-white">{timeRemaining}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">remaining</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Block all social media apps temporarily
                  </p>
                )}
              </div>
              <Button
                size="lg"
                variant={focusActive ? "destructive" : "default"}
                className={
                  focusActive
                    ? ""
                    : "bg-teal-600 hover:bg-teal-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                }
                onClick={focusActive ? handleEndFocusSession : handleStartFocusSession}
              >
                {focusActive ? "End Focus Session" : "Start Focus Session"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Focus Settings */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Focus Settings</h2>

          <Tabs defaultValue="duration">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="duration">Duration</TabsTrigger>
              <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
            </TabsList>

            <TabsContent value="duration" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RadioGroup
                    value={focusDuration.toString()}
                    onValueChange={handleDurationChange}
                    className="space-y-3"
                    disabled={focusActive}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15" id="r1" />
                      <Label htmlFor="r1" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        15 minutes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="r2" />
                      <Label htmlFor="r2" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        30 minutes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60" id="r3" />
                      <Label htmlFor="r3" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />1 hour
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="120" id="r4" />
                      <Label htmlFor="r4" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />2 hours
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="r5" />
                      <Label htmlFor="r5" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Custom
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exceptions" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <AnimatedList staggerDelay={0.1}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">📞</div>
                        <div>
                          <h3 className="font-medium">Allow Phone Calls</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Incoming and outgoing calls</p>
                        </div>
                      </div>
                      <Switch checked={allowCalls} onCheckedChange={setAllowCalls} disabled={focusActive} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">✉️</div>
                        <div>
                          <h3 className="font-medium">Allow SMS</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Text messages only</p>
                        </div>
                      </div>
                      <Switch checked={allowSMS} onCheckedChange={setAllowSMS} disabled={focusActive} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">⏰</div>
                        <div>
                          <h3 className="font-medium">Allow Alarms</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Clock and reminder apps</p>
                        </div>
                      </div>
                      <Switch defaultChecked disabled={focusActive} />
                    </div>
                  </AnimatedList>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedSection>

      {/* Time Limits Section */}
      <AnimatedSection animation="slide-up" delay={0.4} duration={0.6}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Time Limits</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-teal-400"
              onClick={() => router.push("/time-limits")}
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Apps Over Limit */}
          {overLimitApps.length > 0 && (
            <Card className="border-red-200 dark:border-red-900">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-medium text-red-500">Apps Over Limit</h3>
                </div>
                <div className="space-y-3">
                  {overLimitApps.slice(0, 2).map((app) => {
                    const AppIcon = getAppIcon(app.icon)
                    const percentage = Math.min(Math.round((app.usedTime / app.limit) * 100), 150)
                    return (
                      <div key={app.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${app.bgColor} dark:bg-gray-800 mr-2`}>
                              <AppIcon className={`h-4 w-4 ${app.color.replace("bg-", "text-")}`} />
                            </div>
                            <span className="font-medium">{app.name}</span>
                          </div>
                          <span className="text-sm text-red-500 font-medium">
                            {app.usedTime} / {app.limit} min
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 bg-gray-100 dark:bg-gray-800"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apps Approaching Limit */}
          {approachingLimitApps.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-900">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-medium text-amber-500">Approaching Limit</h3>
                </div>
                <div className="space-y-3">
                  {approachingLimitApps.slice(0, 2).map((app) => {
                    const AppIcon = getAppIcon(app.icon)
                    const percentage = Math.round((app.usedTime / app.limit) * 100)
                    return (
                      <div key={app.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${app.bgColor} dark:bg-gray-800 mr-2`}>
                              <AppIcon className={`h-4 w-4 ${app.color.replace("bg-", "text-")}`} />
                            </div>
                            <span className="font-medium">{app.name}</span>
                          </div>
                          <span className="text-sm text-amber-500 font-medium">
                            {app.usedTime} / {app.limit} min
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 bg-gray-100 dark:bg-gray-800"
                          indicatorClassName="bg-amber-500"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No apps over or approaching limit */}
          {overLimitApps.length === 0 && approachingLimitApps.length === 0 && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="py-6">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="font-medium text-gray-600 dark:text-gray-300">All Apps Within Limits</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You're doing great! All your apps are within their time limits.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" className="w-full" onClick={() => router.push("/time-limits")}>
            Manage Time Limits
          </Button>
        </div>
      </AnimatedSection>

      {/* Quick Limits */}
      <AnimatedSection animation="slide-up" delay={0.6} duration={0.6}>
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Limits</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <AnimatedList staggerDelay={0.1}>
                {apps.slice(0, 3).map((app) => {
                  const AppIcon = getAppIcon(app.icon)
                  return (
                    <div key={app.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${app.bgColor} dark:bg-white mr-3`}>
                          <AppIcon className={`h-5 w-5 ${app.color.replace("bg-", "text-")}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{app.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.limit} minutes per day</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push("/time-limits")
                        }}
                      >
                        Adjust
                      </Button>
                    </div>
                  )
                })}
              </AnimatedList>

              <Button
                variant="ghost"
                className="w-full text-teal-600 dark:text-white"
                onClick={() => router.push("/time-limits")}
              >
                View All Limits
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  )
}
