"use client"

import { useState, useEffect } from "react"
import {
  Award,
  Calendar,
  Clock,
  Focus,
  Flame,
  Moon,
  Sunrise,
  Lock,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import type { Badge } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function BadgesShowcase() {
  const { badges, addPoints } = useAppStore()
  const { toast } = useToast()
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "earned" | "unearned">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showAllUnearned, setShowAllUnearned] = useState(false)
  const [activeTab, setActiveTab] = useState("badges")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getIconComponent = (iconName: string, className = "h-6 w-6") => {
    switch (iconName) {
      case "Award":
        return <Award className={className} />
      case "Calendar":
        return <Calendar className={className} />
      case "Clock":
        return <Clock className={className} />
      case "Focus":
        return <Focus className={className} />
      case "Flame":
        return <Flame className={className} />
      case "Moon":
        return <Moon className={className} />
      case "Sunrise":
        return <Sunrise className={className} />
      default:
        return <Award className={className} />
    }
  }

  // Filter badges based on search query and filter type
  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === "earned") return matchesSearch && badge.earned
    if (filterType === "unearned") return matchesSearch && !badge.earned
    return matchesSearch
  })

  const earnedBadges = filteredBadges.filter((badge) => badge.earned)
  const unearnedBadges = filteredBadges.filter((badge) => !badge.earned)

  // Calculate badge stats
  const totalEarned = badges.filter((badge) => badge.earned).length
  const totalBadges = badges.length
  const earnedPercentage = Math.round((totalEarned / totalBadges) * 100)

  // Handle badge click for more details
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge)
  }

  // Simulate earning a badge (for demo purposes)
  const handleSimulateProgress = (badge: Badge) => {
    if (badge.earned) return

    toast({
      title: "Progress Updated",
      description: `You've made progress toward the "${badge.name}" badge!`,
    })
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="badges">My Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {/* Badge Stats */}
          <AnimatedSection animation="fade" duration={0.6}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-lg font-semibold">Badge Collection</h2>
                  </div>
                  <UIBadge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-100">
                    {totalEarned}/{totalBadges}
                  </UIBadge>
                </div>
                <Progress value={earnedPercentage} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{earnedPercentage}% Complete</span>
                  <span>{totalBadges - totalEarned} Remaining</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Search and Filter */}
          <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search badges..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0"
                onClick={() => {
                  if (filterType === "all") setFilterType("earned")
                  else if (filterType === "earned") setFilterType("unearned")
                  else setFilterType("all")
                }}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
            {filterType !== "all" && (
              <div className="mt-2 flex items-center">
                <UIBadge
                  variant="outline"
                  className={`${
                    filterType === "earned"
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-100"
                      : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {filterType === "earned" ? "Earned Only" : "Unearned Only"}
                </UIBadge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs ml-2 h-6 px-2"
                  onClick={() => setFilterType("all")}
                >
                  Clear
                </Button>
              </div>
            )}
          </AnimatedSection>

          {/* Earned Badges */}
          <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Badges</h2>
                {filterType !== "unearned" && (
                  <UIBadge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-100">
                    {earnedBadges.length} Earned
                  </UIBadge>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <Skeleton className="w-12 h-3 mt-2" />
                      </div>
                    ))}
                </div>
              ) : earnedBadges.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleBadgeClick(badge)}
                    >
                      <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-1 relative">
                        <div className="text-teal-600 dark:text-teal-300">{getIconComponent(badge.icon)}</div>
                        <div className="absolute -bottom-1 -right-1 bg-teal-500 dark:bg-teal-400 rounded-full p-0.5">
                          <CheckCircle2 className="h-3 w-3 text-white dark:text-black" />
                        </div>
                      </div>
                      <span className="text-xs text-center truncate w-full">{badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? "No earned badges match your search" : "Complete activities to earn badges!"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </AnimatedSection>

          {/* Badges to Earn */}
          {filterType !== "earned" && (
            <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Badges to Earn</h2>
                  <UIBadge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {unearnedBadges.length} Available
                  </UIBadge>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <Skeleton className="w-10 h-10 rounded-full mr-3" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-1 w-full mt-1" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : unearnedBadges.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatedList staggerDelay={0.1}>
                      {(showAllUnearned ? unearnedBadges : unearnedBadges.slice(0, 3)).map((badge) => (
                        <Card
                          key={badge.id}
                          className="cursor-pointer hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                          onClick={() => handleBadgeClick(badge)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                                <div className="text-gray-400">{getIconComponent(badge.icon, "h-5 w-5")}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{badge.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{badge.description}</p>
                                {badge.progress !== undefined && badge.maxProgress !== undefined && (
                                  <div className="mt-1 space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {badge.progress}/{badge.maxProgress}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 py-0 text-xs text-teal-600 dark:text-teal-400"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleSimulateProgress(badge)
                                        }}
                                      >
                                        Details
                                      </Button>
                                    </div>
                                    <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-1" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </AnimatedList>

                    {unearnedBadges.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-sm text-teal-600 dark:text-teal-400"
                        onClick={() => setShowAllUnearned(!showAllUnearned)}
                      >
                        {showAllUnearned ? "Show Less" : `View All (${unearnedBadges.length - 3} more)`}
                        <ChevronRight
                          className={`h-4 w-4 ml-1 transition-transform ${showAllUnearned ? "rotate-90" : ""}`}
                        />
                      </Button>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? "No badges match your search" : "You've earned all available badges!"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </AnimatedSection>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardSection />
        </TabsContent>
      </Tabs>

      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{selectedBadge?.name}</DialogTitle>
            <DialogDescription className="text-center">{selectedBadge?.description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-4">
            <div
              className={`w-24 h-24 rounded-full ${
                selectedBadge?.earned ? "bg-teal-100 dark:bg-teal-900" : "bg-gray-100 dark:bg-gray-800"
              } flex items-center justify-center mb-4 relative`}
            >
              <div className={selectedBadge?.earned ? "text-teal-600 dark:text-teal-300" : "text-gray-400"}>
                {selectedBadge ? getIconComponent(selectedBadge.icon, "h-12 w-12") : <Lock className="h-12 w-12" />}
              </div>
              {selectedBadge?.earned && (
                <div className="absolute -bottom-1 -right-1 bg-teal-500 dark:bg-teal-400 rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4 text-white dark:text-black" />
                </div>
              )}
            </div>

            {selectedBadge?.earned ? (
              <div className="space-y-4 w-full">
                <UIBadge className="bg-teal-500 dark:bg-teal-700 mx-auto block w-fit">
                  Earned {selectedBadge.earnedDate ? new Date(selectedBadge.earnedDate).toLocaleDateString() : ""}
                </UIBadge>

                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-3 text-sm">
                    <h4 className="font-medium mb-1">Badge Benefits:</h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• +100 points added to your account</li>
                      <li>• Special profile highlight</li>
                      <li>• Progress toward next level</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {selectedBadge?.progress !== undefined && selectedBadge?.maxProgress !== undefined && (
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium">
                        {selectedBadge.progress} / {selectedBadge.maxProgress}
                      </span>
                    </div>
                    <Progress value={(selectedBadge.progress / selectedBadge.maxProgress) * 100} className="h-2" />

                    <Card className="bg-gray-50 dark:bg-gray-800">
                      <CardContent className="p-3 text-sm">
                        <h4 className="font-medium mb-1">How to earn this badge:</h4>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                          {selectedBadge.id === "focus-master" && (
                            <>
                              <li>• Complete focus sessions</li>
                              <li>• Each completed session counts as progress</li>
                              <li>• Sessions must be at least 15 minutes long</li>
                            </>
                          )}
                          {selectedBadge.id === "time-saver" && (
                            <>
                              <li>• Stay under your daily app limits</li>
                              <li>• Each minute saved counts toward progress</li>
                              <li>• Track your savings in the Analytics section</li>
                            </>
                          )}
                          {selectedBadge.id === "streak-7" && (
                            <>
                              <li>• Maintain your daily streak</li>
                              <li>• Use the app every day</li>
                              <li>• Stay under your limits to maintain streaks</li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setSelectedBadge(null)}>
              Close
            </Button>
            {selectedBadge?.earned && (
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Badge Shared",
                    description: `You've shared your "${selectedBadge.name}" badge with friends!`,
                  })
                }}
              >
                Share Badge
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Leaderboard Component
function LeaderboardSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "allTime">("week")
  const { toast } = useToast()

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: "Alex Johnson",
      points: 1250,
      badges: 8,
      streak: 12,
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: true,
    },
    {
      id: 2,
      name: "Jamie Smith",
      points: 1450,
      badges: 10,
      streak: 15,
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "Taylor Brown",
      points: 1350,
      badges: 9,
      streak: 7,
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: false,
    },
    {
      id: 4,
      name: "Jordan Lee",
      points: 1100,
      badges: 7,
      streak: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: false,
    },
    {
      id: 5,
      name: "Casey Wilson",
      points: 950,
      badges: 6,
      streak: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: false,
    },
  ]

  // Sort leaderboard by points
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.points - a.points)

  // Find current user's rank
  const currentUserRank = sortedLeaderboard.findIndex((user) => user.isCurrentUser) + 1

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade" duration={0.6}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Leaderboard</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant={timeFrame === "week" ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setTimeFrame("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeFrame === "month" ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setTimeFrame("month")}
                >
                  Month
                </Button>
                <Button
                  variant={timeFrame === "allTime" ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setTimeFrame("allTime")}
                >
                  All Time
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="w-6 h-6 rounded-full mr-3" />
                      <Skeleton className="w-8 h-8 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
              </div>
            ) : (
              <AnimatedList staggerDelay={0.1}>
                {sortedLeaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center py-2 px-2 rounded-md",
                      user.isCurrentUser && "bg-teal-50 dark:bg-teal-900/20",
                    )}
                  >
                    <div className="w-6 text-center font-medium mr-3">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Trophy className="h-5 w-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="text-gray-500">{index + 1}</span>
                      )}
                    </div>
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate flex items-center">
                        {user.name}
                        {user.isCurrentUser && (
                          <UIBadge variant="outline" className="ml-2 text-xs">
                            You
                          </UIBadge>
                        )}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Award className="h-3 w-3 mr-1" />
                        <span>{user.badges} badges</span>
                        <span className="mx-1">•</span>
                        <Flame className="h-3 w-3 mr-1" />
                        <span>{user.streak} days</span>
                      </div>
                    </div>
                    <div className="font-bold text-teal-600 dark:text-teal-400">{user.points}</div>
                  </div>
                ))}
              </AnimatedList>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-3 px-4 border-t">
            <div className="w-full flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Your Rank: #{currentUserRank}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-600 dark:text-teal-400 p-0 h-auto hover:bg-transparent"
                onClick={() => {
                  toast({
                    title: "Friends Invited",
                    description: "Invitation sent to join your leaderboard!",
                  })
                }}
              >
                Invite Friends
              </Button>
            </div>
          </CardFooter>
        </Card>
      </AnimatedSection>

      {/* Leaderboard Stats */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <h3 className="text-xs text-gray-500 dark:text-gray-400">Your Points</h3>
              <div className="text-xl font-bold mt-1 text-teal-600 dark:text-teal-400">1,250</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-green-500">+150</span> this week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <h3 className="text-xs text-gray-500 dark:text-gray-400">To Next Rank</h3>
              <div className="text-xl font-bold mt-1">200</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">points needed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <h3 className="text-xs text-gray-500 dark:text-gray-400">Weekly Best</h3>
              <div className="text-xl font-bold mt-1 text-yellow-500">1,450</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">by Jamie S.</div>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Challenges */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Award className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
              <span>Weekly Challenges</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <AnimatedList staggerDelay={0.1}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <Focus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Focus Champion</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Complete 5 focus sessions this week</p>
                    </div>
                  </div>
                  <UIBadge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    +200 pts
                  </UIBadge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Weekend Warrior</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Stay under limits all weekend</p>
                    </div>
                  </div>
                  <UIBadge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    +150 pts
                  </UIBadge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                      <Flame className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Streak Master</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Maintain a 7-day streak</p>
                    </div>
                  </div>
                  <UIBadge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  >
                    +300 pts
                  </UIBadge>
                </div>
              </div>
            </AnimatedList>
          </CardContent>
          <CardFooter className="pt-0 pb-3 px-4 border-t">
            <Button variant="ghost" className="w-full text-sm text-teal-600 dark:text-teal-400">
              View All Challenges
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  )
}
