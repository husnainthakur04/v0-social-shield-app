"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  Brain,
  Focus,
  Award,
  Users,
  Moon,
  Smile,
  Frown,
  Meh,
  Clock,
  Heart,
  Zap,
  MessageSquare,
  AlertTriangle,
  Lock,
  Sparkles,
  BarChart3,
  Lightbulb,
  Smartphone,
  Home,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatTime, calculateTotalUsage, calculateTotalLimit, calculateSavedTime } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Skeleton } from "@/components/ui/skeleton"
import { AiRecommendations } from "@/components/ai-recommendations"
import { MoodTracker } from "@/components/mood-tracker"
import { SleepTracker } from "@/components/sleep-tracker"
import { GroupChallenges } from "@/components/group-challenges"
import { FocusChallenges } from "@/components/focus-challenges"
import { VirtualAssistant } from "@/components/virtual-assistant"
import { MentalHealthResources } from "@/components/mental-health-resources"
import { DigitalWellbeing } from "@/components/digital-wellbeing"

export function EnhancedDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    apps,
    focusActive,
    focusEndTime,
    startFocusSession,
    endFocusSession,
    streakCount,
    totalSavedTime,
    points,
    level,
    badges,
    blackoutMode,
    toggleBlackoutMode,
  } = useAppStore()

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [usagePercentage, setUsagePercentage] = useState(0)
  const [showBlackoutDialog, setShowBlackoutDialog] = useState(false)
  const [blackoutDuration, setBlackoutDuration] = useState(60) // minutes
  const [showMoodPrompt, setShowMoodPrompt] = useState(false)
  const [currentMood, setCurrentMood] = useState<"happy" | "neutral" | "sad" | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const totalUsage = calculateTotalUsage(apps)
  const totalLimit = calculateTotalLimit(apps)
  const savedTime = calculateSavedTime(apps)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Update stats and time remaining
  useEffect(() => {
    // Calculate usage percentage
    const percentage = Math.min(100, Math.round((totalUsage / totalLimit) * 100))
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
          endFocusSession()
          toast({
            title: "Focus session completed!",
            description: "Great job staying focused!",
          })
          // Show mood prompt after focus session
          setShowMoodPrompt(true)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [focusActive, focusEndTime, endFocusSession, toast, totalUsage, totalLimit])

  const toggleFocusMode = () => {
    if (focusActive) {
      endFocusSession()
      toast({
        title: "Focus mode disabled",
        description: "You can now access all your apps.",
      })
    } else {
      startFocusSession()
      toast({
        title: "Focus mode enabled",
        description: "All distracting apps are now blocked.",
      })
    }
  }

  const startBlackoutMode = () => {
    toggleBlackoutMode(true, blackoutDuration)
    setShowBlackoutDialog(false)
    toast({
      title: "Blackout Mode Activated",
      description: `All social media apps will be blocked for ${blackoutDuration} minutes.`,
    })
  }

  const handleMoodSelection = (mood: "happy" | "neutral" | "sad") => {
    setCurrentMood(mood)
    setShowMoodPrompt(false)
    toast({
      title: "Mood Recorded",
      description: "Thanks for sharing how you feel after your session.",
    })
  }

  // Count earned badges
  const earnedBadgesCount = badges.filter((badge) => badge.earned).length

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
            <p className="text-sm text-gray-500 dark:text-gray-400">Enhanced Digital Wellbeing</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center" onClick={() => setShowAssistant(true)}>
            <Brain className="h-4 w-4 mr-1 text-teal-600" />
            AI Assistant
          </Button>
        </div>
      </AnimatedSection>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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

          {/* AI Recommendations */}
          <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
            <Card className="border-teal-200 dark:border-teal-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <AiRecommendations />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/recommendations")}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Quick Actions */}
          <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
            <div className="grid grid-cols-2 gap-3">
              {/* Blackout Mode */}
              <Card
                className={`cursor-pointer border-2 ${blackoutMode ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
                onClick={() => setShowBlackoutDialog(true)}
              >
                <CardContent className="p-3 flex flex-col items-center text-center">
                  <div
                    className={`p-2 rounded-full ${blackoutMode ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"} mt-2 mb-1`}
                  >
                    <Lock
                      className={`h-5 w-5 ${blackoutMode ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                    />
                  </div>
                  <h3 className="font-medium text-sm mt-1">Blackout Mode</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {blackoutMode ? "Active" : "Block all social apps"}
                  </p>
                </CardContent>
              </Card>

              {/* Focus Mode */}
              <Card
                className={`cursor-pointer border-2 ${focusActive ? "border-teal-500" : "border-gray-200 dark:border-gray-700"}`}
                onClick={toggleFocusMode}
              >
                <CardContent className="p-3 flex flex-col items-center text-center">
                  <div
                    className={`p-2 rounded-full ${focusActive ? "bg-teal-100 dark:bg-teal-900" : "bg-gray-100 dark:bg-gray-800"} mt-2 mb-1`}
                  >
                    <Focus
                      className={`h-5 w-5 ${focusActive ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
                    />
                  </div>
                  <h3 className="font-medium text-sm mt-1">Focus Mode</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {focusActive ? `${timeRemaining} remaining` : "Start focused work"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Group Challenges */}
          <AnimatedSection animation="slide-up" delay={0.4} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Users className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Family & Group Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <GroupChallenges preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/group-challenges")}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Mood Tracking */}
          <AnimatedSection animation="slide-up" delay={0.5} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Smile className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Mood & Social Media Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <MoodTracker preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/mood-tracking")}>
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        </TabsContent>

        {/* Focus Tab */}
        <TabsContent value="focus" className="space-y-6">
          {/* Focus Challenges */}
          <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Gamified Focus Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <FocusChallenges preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/focus-challenges")}>
                  View All Challenges <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Social Media Mood Breaks */}
          <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Social Media Mood Breaks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Schedule short breaks to check social media during your focus sessions
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Enable Mood Breaks</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Allow 10-15 minute social media breaks</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Break Duration</h4>
                      <span className="text-sm text-gray-500">10 minutes</span>
                    </div>
                    <Slider defaultValue={[10]} max={20} min={5} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Break Frequency</h4>
                      <span className="text-sm text-gray-500">Every 2 hours</span>
                    </div>
                    <Slider defaultValue={[120]} max={240} min={30} step={15} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Schedule Next Break
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Sleep Mode */}
          <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Sleep Mode Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <SleepTracker preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/sleep-tracking")}>
                  View Sleep Data <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Social Media Habit Insights */}
          <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Social Media Habit Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-40 w-full rounded-md" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Your Social Media Patterns</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Peak Usage Time</span>
                          <span className="font-medium">8:00 PM - 10:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Most Used App</span>
                          <span className="font-medium">Instagram (45 min/day)</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Most Distracting App</span>
                          <span className="font-medium">TikTok (20 min sessions)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Productivity Impact:</span>
                        <span className="text-red-500 ml-1">-15% this week</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      >
                        High Impact
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/habit-insights")}>
                  View Detailed Analysis <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Progressive Rewards */}
          <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Award className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Progressive Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Your Points</h4>
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{points}</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-right">Level</h4>
                        <div className="text-2xl font-bold text-right">{level}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Level {level + 1}</span>
                        <span>{points % 500}/500</span>
                      </div>
                      <Progress value={(points % 500) / 5} className="h-2" />
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                        Available Rewards
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Custom App Theme</span>
                          <Badge variant="outline">200 points</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>$5 Gift Card</span>
                          <Badge variant="outline">500 points</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/rewards")}>
                  View All Rewards <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Cross-Platform Integration */}
          <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Cross-Platform Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-sm">Smartphone</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Primary device</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-sm">Smart Home</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Google Home</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Laptop className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-sm">Laptop</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Browser extension</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/devices")}>
                  Manage Devices <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        </TabsContent>

        {/* Wellbeing Tab */}
        <TabsContent value="wellbeing" className="space-y-6">
          {/* Digital Wellbeing */}
          <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Digital Wellbeing Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-40 w-full rounded-md" />
                  </div>
                ) : (
                  <DigitalWellbeing preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/wellbeing")}>
                  View Wellbeing Report <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Mental Health Resources */}
          <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Mental Health Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : (
                  <MentalHealthResources preview />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/mental-health")}>
                  View All Resources <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          {/* Virtual Assistant */}
          <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
            <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-full mr-3">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Virtual Assistant</h3>
                    <p className="text-sm opacity-90">Your personal accountability partner</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-teal-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setShowAssistant(true)}
                >
                  Chat Now
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </TabsContent>
      </Tabs>

      {/* Blackout Mode Dialog */}
      <Dialog open={showBlackoutDialog} onOpenChange={setShowBlackoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Blackout Mode</DialogTitle>
            <DialogDescription>
              Blackout Mode will completely block access to all social media apps for the selected duration.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={blackoutDuration === 30 ? "default" : "outline"}
                  onClick={() => setBlackoutDuration(30)}
                >
                  30 minutes
                </Button>
                <Button
                  variant={blackoutDuration === 60 ? "default" : "outline"}
                  onClick={() => setBlackoutDuration(60)}
                >
                  1 hour
                </Button>
                <Button
                  variant={blackoutDuration === 120 ? "default" : "outline"}
                  onClick={() => setBlackoutDuration(120)}
                >
                  2 hours
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                During Blackout Mode, you won't be able to access any social media apps. Emergency calls and messages
                will still work.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlackoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={startBlackoutMode}>Start Blackout Mode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mood Prompt Dialog */}
      <Dialog open={showMoodPrompt} onOpenChange={setShowMoodPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Let us know how you feel after your focus session to help track the impact on your mood.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex justify-center space-x-8">
            <Button variant="ghost" className="flex flex-col items-center" onClick={() => handleMoodSelection("happy")}>
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                <Smile className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <span>Happy</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center"
              onClick={() => handleMoodSelection("neutral")}
            >
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
                <Meh className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Neutral</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center" onClick={() => handleMoodSelection("sad")}>
              <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900 mb-2">
                <Frown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <span>Stressed</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Assistant Dialog */}
      <Dialog open={showAssistant} onOpenChange={setShowAssistant}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-teal-600" />
              AI Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <VirtualAssistant />
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAssistant(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Laptop } from "lucide-react"
