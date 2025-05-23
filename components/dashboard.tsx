"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Focus, Award, Flame, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"
import { formatTime, calculateTotalUsage, calculateTotalLimit, calculateSavedTime, getAppIcon } from "@/lib/utils"
import { useAppStore, motivationalQuotes } from "@/lib/store"
import { initializeServices } from "@/lib/client-services"

export function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusActive, setFocusActive] = useState(false)
  const [focusEndTime, setFocusEndTime] = useState<number | null>(null)
  const [streakCount, setStreakCount] = useState(0)
  const [totalSavedTime, setTotalSavedTime] = useState(0)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState<any[]>([])
  const [apps, setApps] = useState<any[]>([])
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [usagePercentage, setUsagePercentage] = useState(0)
  const [quote, setQuote] = useState<any | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [showPermissions, setShowPermissions] = useState(true)

  // Initialize services and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize services
        const services = initializeServices()

        // Check permissions - handle case where services might be null
        let hasPermissions = false
        if (services.appUsageTracker) {
          try {
            hasPermissions = await services.appUsageTracker.checkPermissions()
          } catch (error) {
            console.error("Error checking permissions:", error)
          }
        }
        setPermissionsGranted(hasPermissions)

        // Load store data
        const store = useAppStore.getState()
        setFocusActive(store.focusActive)
        setFocusEndTime(store.focusEndTime)
        setStreakCount(store.streakCount)
        setTotalSavedTime(store.totalSavedTime)
        setPoints(store.points)
        setLevel(store.level)
        setBadges(store.badges || [])
        setApps(store.apps || [])

        // Get a random quote
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
        setQuote(motivationalQuotes[randomIndex])

        // Subscribe to store changes
        const unsubscribe = useAppStore.subscribe((state) => {
          setFocusActive(state.focusActive)
          setFocusEndTime(state.focusEndTime)
          setStreakCount(state.streakCount)
          setTotalSavedTime(state.totalSavedTime)
          setPoints(state.points)
          setLevel(state.level)
          setBadges(state.badges || [])
          setApps(state.apps || [])
        })

        setIsLoaded(true)
        return unsubscribe
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        setIsLoaded(true) // Still set isLoaded to true to avoid infinite loading state
        return () => {}
      }
    }

    const unsubscribe = loadData()
    return () => {
      unsubscribe.then((fn) => fn && fn())
    }
  }, [])

  // Update stats and time remaining
  useEffect(() => {
    if (!isLoaded) return

    // Calculate usage percentage
    const totalUsage = calculateTotalUsage(apps)
    const totalLimit = calculateTotalLimit(apps)
    const percentage = totalLimit > 0 ? Math.min(100, Math.round((totalUsage / totalLimit) * 100)) : 0
    setUsagePercentage(percentage)

    // Update focus timer if active
    if (focusActive && focusEndTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, focusEndTime - now)
        const minutes = Math.floor(remaining / (60 * 1000))
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)

        if (remaining <= 0) {
          clearInterval(interval)
          useAppStore.getState().endFocusSession()
          toast({
            title: "Focus session completed!",
            description: "Great job staying focused!",
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isLoaded, focusActive, focusEndTime, apps, toast])

  const toggleFocusMode = () => {
    if (focusActive) {
      useAppStore.getState().endFocusSession()
      toast({
        title: "Focus mode disabled",
        description: "You can now access all your apps.",
      })
    } else {
      useAppStore.getState().startFocusSession()
      toast({
        title: "Focus mode enabled",
        description: "All distracting apps are now blocked.",
      })
    }
  }

  // Count earned badges
  const earnedBadgesCount = badges.filter((badge) => badge.earned).length || 0

  // If not loaded yet, show a loading placeholder
  if (!isLoaded) {
    return (
      <div className="p-4 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  const totalUsage = calculateTotalUsage(apps)
  const totalLimit = calculateTotalLimit(apps)
  const savedTime = calculateSavedTime(apps)

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="mr-2 text-teal-600 dark:text-white" />
              Social Shield
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Control Your Scroll. Live More.</p>
          </div>
        </div>
      </AnimatedSection>

      {showPermissions && !permissionsGranted && (
        <AnimatedSection animation="fade" delay={0.1} duration={0.4}>
          <Card className="border-amber-200 dark:border-amber-800 mb-4">
            <CardContent className="p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                <p className="text-sm">App needs permissions to track usage</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-amber-600 dark:text-amber-400"
                  onClick={() => {
                    setShowPermissions(false)
                    router.push("/settings")
                  }}
                >
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Quick Stats */}
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Today's Usage</h3>
                <div className="text-2xl font-bold">{formatTime(totalUsage)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">of {formatTime(totalLimit)} limit</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium">Time Saved</h3>
                <div className="text-2xl font-bold text-teal-600 dark:text-white">{formatTime(savedTime)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Great job!</p>
              </div>
            </div>
            <Progress value={usagePercentage} className="h-2 mt-4" />
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Focus Mode Toggle */}
      <AnimatedSection animation="scale" delay={0.2} duration={0.6}>
        <Card
          className={`border-2 ${focusActive ? "border-teal-500 dark:border-white" : "border-gray-200 dark:border-gray-800"}`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Focus
                  className={`mr-3 ${focusActive ? "text-teal-600 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                  size={24}
                />
                <div>
                  <h3 className="font-medium">Focus Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {focusActive ? `Active - ${timeRemaining} remaining` : "Block all social apps"}
                  </p>
                </div>
              </div>
              <Button variant={focusActive ? "destructive" : "default"} size="sm" onClick={toggleFocusMode}>
                {focusActive ? "Disable" : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Gamification Preview */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Award className="mr-2 h-5 w-5 text-teal-600 dark:text-white" />
              Your Progress
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-white"
              onClick={() => router.push("/rewards")}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="cursor-pointer" onClick={() => router.push("/rewards")}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-yellow-500">{points}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Level {level}
                </Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => router.push("/rewards")}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-500 flex items-center justify-center">
                  <Flame className="h-5 w-5 mr-1" />
                  {streakCount}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => router.push("/rewards")}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{earnedBadgesCount}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* App Usage */}
      <AnimatedSection animation="slide-up" delay={0.4} duration={0.6}>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">App Limits</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-white"
              onClick={() => router.push("/time-limits")}
            >
              View All
            </Button>
          </div>

          <AnimatedList staggerDelay={0.1} className="space-y-3">
            {apps.slice(0, 3).map((app) => {
              const AppIcon = getAppIcon(app.icon)
              const usagePercentage = app.limit > 0 ? (app.usedTime / app.limit) * 100 : 0

              return (
                <Card key={app.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1 mr-2">
                        <div className={`p-2 rounded-full ${app.bgColor} dark:bg-white mr-3 flex-shrink-0`}>
                          <AppIcon className={`h-5 w-5 ${app.color.replace("bg-", "text-")}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{app.name}</h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {app.usedTime}m / {app.limit}m
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={usagePercentage}
                        className={`h-2 w-20 flex-shrink-0 ${usagePercentage > 80 ? "bg-red-200 dark:bg-red-950" : ""}`}
                        indicatorClassName={app.color}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </AnimatedList>
        </div>
      </AnimatedSection>

      {/* Motivational Quote */}
      <AnimatedSection animation="fade" delay={0.5} duration={0.6}>
        {quote && (
          <Card className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <CardContent className="p-4">
              <p className="text-sm font-medium italic">"{quote.quote}"</p>
              <p className="text-xs mt-1 opacity-70">— {quote.author}</p>
            </CardContent>
          </Card>
        )}
      </AnimatedSection>
    </div>
  )
}
