"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  TrendingDown,
  Award,
  Calendar,
  Clock,
  Download,
  ChevronRight,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Timer,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts"
import { useAppStore } from "@/lib/store"
import {
  getDailyData,
  getAppData,
  isDetoxActive,
  formatTime,
  calculateTotalUsage,
  calculateTotalLimit,
  calculateSavedTime,
} from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Custom vibrant colors for the pie chart
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
]

// Time period options
const TIME_PERIODS = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
]

export function Analytics() {
  const router = useRouter()
  const { toast } = useToast()
  const { apps, detoxSchedules, focusSessions, totalSavedTime, updateDetoxSchedule } = useAppStore()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timePeriod, setTimePeriod] = useState("week")
  const [dailyData, setDailyData] = useState(getDailyData())
  const [appData, setAppData] = useState(getAppData(apps))
  const [detoxActive, setDetoxActive] = useState(false)
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)
  const [showInsightDetails, setShowInsightDetails] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null)
  const [showTimeLimitDetails, setShowTimeLimitDetails] = useState(false)

  // Calculate stats
  const dailyAverage = Math.round(dailyData.reduce((sum, day) => sum + day.minutes, 0) / 7)
  const savedHours = (totalSavedTime / 60).toFixed(1)
  const mostUsedApp = [...apps].sort((a, b) => b.usedTime - a.usedTime)[0]?.name || "None"
  const bestDay = [...dailyData].sort((a, b) => a.minutes - b.minutes)[0]?.day || "None"

  // Calculate trends
  const weeklyChange = -15 // Simulated data: 15% decrease
  const totalUsageMinutes = dailyData.reduce((sum, day) => sum + day.minutes, 0)
  const previousWeekMinutes = Math.round(totalUsageMinutes / (1 - weeklyChange / 100))
  const minutesSaved = previousWeekMinutes - totalUsageMinutes

  // Calculate time limits stats
  const totalUsage = calculateTotalUsage(apps)
  const totalLimit = calculateTotalLimit(apps)
  const savedTime = calculateSavedTime(apps)
  const usagePercentage = Math.min(100, Math.round((totalUsage / totalLimit) * 100)) || 0

  // Apps over limit
  const appsOverLimit = apps.filter((app) => app.enabled && app.usedTime > app.limit)
  const appsNearLimit = apps.filter(
    (app) => app.enabled && app.usedTime <= app.limit && app.usedTime >= app.limit * 0.8,
  )
  const appsUnderLimit = apps.filter((app) => app.enabled && app.usedTime < app.limit * 0.8)

  // Insights data
  const insights = useMemo(
    () => [
      {
        id: 1,
        badge: "-15%",
        text: "Your social media usage has decreased by 15% compared to last week.",
        trend: "decrease",
        details: "You spent 120 minutes less on social media this week compared to last week. Keep up the good work!",
        chart: dailyData,
      },
      {
        id: 2,
        badge: `+${savedHours}h`,
        text: `You've saved ${savedHours} hours this week by limiting app usage.`,
        trend: "increase",
        details: `That's equivalent to watching 2 movies or reading 100 pages of a book. You stayed under your limits for 5 out of 7 days.`,
        chart: null,
      },
      {
        id: 3,
        badge: <Award className="h-3 w-3" />,
        text: `${bestDay} was your best day with only ${dailyData.find((d) => d.day === bestDay)?.minutes || 0} minutes of social media use.`,
        trend: "achievement",
        details: `On ${bestDay}, you used 70% less social media than your daily average. This is your best day in the last 2 weeks.`,
        chart: null,
      },
    ],
    [bestDay, dailyData, savedHours],
  )

  // Simulated weekly report data
  const weeklyReportData = {
    totalUsage: totalUsageMinutes,
    previousWeek: previousWeekMinutes,
    percentChange: weeklyChange,
    mostUsedApp,
    mostUsedAppTime: apps.find((app) => app.name === mostUsedApp)?.usedTime || 0,
    bestDay,
    bestDayUsage: dailyData.find((d) => d.day === bestDay)?.minutes || 0,
    worstDay: [...dailyData].sort((a, b) => b.minutes - a.minutes)[0]?.day || "None",
    worstDayUsage: [...dailyData].sort((a, b) => b.minutes - a.minutes)[0]?.minutes || 0,
    focusSessions: focusSessions.length,
    focusSessionsTime: focusSessions.reduce((sum, session) => sum + (session.duration || 0), 0),
    savedTime: totalSavedTime,
  }

  // Check if detox is active
  useEffect(() => {
    const checkDetoxStatus = () => {
      setDetoxActive(isDetoxActive(detoxSchedules))
    }

    checkDetoxStatus()
    const interval = setInterval(checkDetoxStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [detoxSchedules])

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Update chart data when time period changes
  useEffect(() => {
    setAppData(getAppData(apps))
  }, [apps, timePeriod])

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      setDailyData(getDailyData())
      setAppData(getAppData(apps))
      setIsRefreshing(false)

      toast({
        title: "Data Refreshed",
        description: "Your analytics data has been updated.",
      })
    }, 1500)
  }

  const toggleDetoxSchedule = (id: number) => {
    const schedule = detoxSchedules.find((s) => s.id === id)
    if (schedule) {
      updateDetoxSchedule(id, { enabled: !schedule.enabled })
      toast({
        title: schedule.enabled ? "Detox schedule disabled" : "Detox schedule enabled",
        description: `${schedule.name} is now ${schedule.enabled ? "inactive" : "active"}.`,
      })
    }
  }

  const handleInsightClick = (id: number) => {
    setSelectedInsight(id)
    setShowInsightDetails(true)
  }

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">{`${payload[0].value} minutes`}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = appData.reduce((sum, app) => sum + app.value, 0)
      const percentage = Math.round((payload[0].value / totalValue) * 100)

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
            {`${payload[0].value} minutes (${percentage}%)`}
          </p>
        </div>
      )
    }
    return null
  }

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.1
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label for segments that are at least 8% of the total
    if (percent < 0.08) return null

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header with time period selector */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <BarChart3 className="mr-2 text-teal-600 dark:text-white" />
              Usage Analytics
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your digital habits</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="text-gray-500 hover:text-teal-600"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Summary Cards */}
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <div className="grid grid-cols-2 gap-3 w-full">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="w-full">
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="w-full">
                <CardContent className="p-3 text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Average</h3>
                  <div className="text-2xl font-bold mt-1">{dailyAverage} min</div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-3 text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Saved</h3>
                  <div className="text-2xl font-bold mt-1 text-teal-600 dark:text-white">{savedHours} hrs</div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-3 text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used App</h3>
                  <div className="text-xl font-bold mt-1 truncate">{mostUsedApp}</div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-3 text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Day</h3>
                  <div className="text-xl font-bold mt-1">{bestDay}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AnimatedSection>

      {/* Time Limits Section */}
      <AnimatedSection animation="slide-up" delay={0.15} duration={0.6} className="w-full">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Timer className="mr-2 h-5 w-5 text-teal-600 dark:text-white" />
              Time Limits
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-white"
              onClick={() => router.push("/time-limits")}
            >
              Manage Limits
            </Button>
          </div>

          <Card className="w-full">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Total Usage</h3>
                      <p className="text-sm text-gray-500">
                        {formatTime(totalUsage)} of {formatTime(totalLimit)}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        usagePercentage < 70
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : usagePercentage < 90
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {usagePercentage}%
                    </Badge>
                  </div>

                  <Progress
                    value={usagePercentage}
                    className={`h-2 ${
                      usagePercentage < 70
                        ? "bg-green-100 dark:bg-green-900"
                        : usagePercentage < 90
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-red-100 dark:bg-red-900"
                    }`}
                  />

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="flex justify-center mb-1">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="text-xs font-medium">Over Limit</p>
                      <p className="text-lg font-bold">{appsOverLimit.length}</p>
                    </div>

                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <div className="flex justify-center mb-1">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <p className="text-xs font-medium">Near Limit</p>
                      <p className="text-lg font-bold">{appsNearLimit.length}</p>
                    </div>

                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <div className="flex justify-center mb-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs font-medium">Under Limit</p>
                      <p className="text-lg font-bold">{appsUnderLimit.length}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => setShowTimeLimitDetails(true)}>
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Charts */}
      <AnimatedSection animation="scale" delay={0.2} duration={0.6} className="w-full">
        <Tabs defaultValue="apps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Usage</TabsTrigger>
            <TabsTrigger value="apps">App Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4 w-full">
            <Card className="w-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>This Week's Usage</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">About This Chart</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This chart shows your daily social media usage for the past week. Lower bars indicate better
                          digital wellbeing.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="h-[250px] w-full flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" vertical={false} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "rgba(156,163,175,0.2)" }}
                          dy={10}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}m`}
                          dx={-10}
                        />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(156,163,175,0.1)" }} />
                        <Bar
                          dataKey="minutes"
                          fill="#14b8a6"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-3 px-4">
                <div className="w-full flex justify-between items-center text-xs text-gray-500">
                  <span>Total: {totalUsageMinutes} minutes</span>
                  <span className="flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1 text-green-500" />
                    {Math.abs(weeklyChange)}% from last week
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="apps" className="mt-4 w-full">
            <Card className="w-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>App Usage Breakdown</span>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="space-y-2">
                          <h4 className="font-medium">Filter Options</h4>
                          <div className="space-y-1">
                            <label className="flex items-center space-x-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Show all apps</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Show percentages</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Show labels</span>
                            </label>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">About This Chart</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This chart shows the breakdown of your time spent on different apps. Hover over segments for
                            more details.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[280px] w-full flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-full" />
                  </div>
                ) : (
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={renderCustomizedLabel}
                          strokeWidth={1}
                          stroke="rgba(255,255,255,0.2)"
                          animationDuration={1500}
                          animationBegin={300}
                        >
                          {appData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="hover:opacity-80 transition-opacity"
                            />
                          ))}
                          <LabelList
                            dataKey="name"
                            position="inside"
                            style={{ fontSize: "12px", fill: "white", fontWeight: "bold" }}
                            className="pointer-events-none"
                          />
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          iconSize={10}
                          iconType="circle"
                          formatter={(value, entry: any, index) => (
                            <span
                              style={{ color: COLORS[index % COLORS.length], fontSize: "12px", marginRight: "10px" }}
                            >
                              {value}
                            </span>
                          )}
                          wrapperStyle={{ paddingTop: "15px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-3 px-4">
                <div className="w-full flex justify-between items-center text-xs text-gray-500">
                  <span>Total apps: {appData.length}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-teal-600 p-0 h-auto hover:bg-transparent hover:text-teal-700"
                    onClick={() => router.push("/time-limits")}
                  >
                    Manage app limits
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      {/* Digital Detox Section */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6} className="w-full">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-teal-600 dark:text-white" />
              Digital Detox
              {detoxActive && <Badge className="ml-2 bg-green-500 dark:bg-green-600">Active Now</Badge>}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 dark:text-white"
              onClick={() => router.push("/detox")}
            >
              View All
            </Button>
          </div>

          <Card className="w-full">
            <CardContent className="p-4 space-y-3">
              {isLoading ? (
                <AnimatedList staggerDelay={0.1}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </AnimatedList>
              ) : (
                <AnimatedList staggerDelay={0.1}>
                  {detoxSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between w-full">
                      <div className="min-w-0 flex-1 mr-2">
                        <h3 className="font-medium truncate">{schedule.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {schedule.days.length === 7
                            ? "Every day"
                            : schedule.days.length === 5 &&
                                !schedule.days.includes("Saturday") &&
                                !schedule.days.includes("Sunday")
                              ? "Weekdays"
                              : schedule.days.length === 2 &&
                                  schedule.days.includes("Saturday") &&
                                  schedule.days.includes("Sunday")
                                ? "Weekends"
                                : schedule.days.join(", ")}
                          {" · "}
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                      <Badge
                        variant={schedule.enabled ? "default" : "outline"}
                        className={`cursor-pointer flex-shrink-0 ${schedule.enabled ? "bg-teal-600 dark:bg-white dark:text-black" : ""}`}
                        onClick={() => toggleDetoxSchedule(schedule.id)}
                      >
                        {schedule.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </AnimatedList>
              )}

              <Button variant="outline" className="w-full mt-2" onClick={() => router.push("/detox")}>
                <Clock className="mr-2 h-4 w-4" />
                Schedule New Detox
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Insights */}
      <AnimatedSection animation="slide-up" delay={0.4} duration={0.6} className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-teal-600 dark:text-white" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <AnimatedList staggerDelay={0.1}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-6 w-12 flex-shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </AnimatedList>
            ) : (
              <AnimatedList staggerDelay={0.1}>
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                    onClick={() => handleInsightClick(insight.id)}
                  >
                    <Badge
                      variant="outline"
                      className={`mt-1 flex-shrink-0 ${
                        insight.trend === "decrease"
                          ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : insight.trend === "increase"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {insight.badge}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{insight.text}</p>
                      <div className="flex items-center mt-1 text-xs text-teal-600 dark:text-teal-400">
                        <span>View details</span>
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Weekly Report */}
      <AnimatedSection animation="fade" delay={0.5} duration={0.6} className="w-full">
        <Card className="bg-gradient-to-r from-gray-700 to-gray-900 text-white w-full">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="min-w-0 flex-1 mr-2">
              <h3 className="font-medium truncate">Weekly Report</h3>
              <p className="text-sm opacity-90 truncate">Your detailed usage analysis</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-black hover:bg-gray-200 flex-shrink-0"
              onClick={() => setShowWeeklyReport(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Time Limits Details Dialog */}
      <Dialog open={showTimeLimitDetails} onOpenChange={setShowTimeLimitDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Time Limits Details</DialogTitle>
            <DialogDescription>Current status of your app time limits</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Overall Usage</h3>
              <Badge
                className={`${
                  usagePercentage < 70 ? "bg-green-500" : usagePercentage < 90 ? "bg-yellow-500" : "bg-red-500"
                }`}
              >
                {usagePercentage}%
              </Badge>
            </div>

            <Progress value={usagePercentage} className="h-2" />

            <div className="text-sm text-gray-500 flex justify-between">
              <span>{formatTime(totalUsage)}</span>
              <span>{formatTime(totalLimit)}</span>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Apps Over Limit</h3>
              {appsOverLimit.length === 0 ? (
                <p className="text-sm text-gray-500">No apps over limit. Great job!</p>
              ) : (
                <div className="space-y-2">
                  {appsOverLimit.map((app) => (
                    <div key={app.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${app.color} mr-2`}></div>
                        <span>{app.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-red-500 font-medium">{formatTime(app.usedTime)}</span>
                        <span className="text-gray-500"> / {formatTime(app.limit)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Apps Near Limit</h3>
              {appsNearLimit.length === 0 ? (
                <p className="text-sm text-gray-500">No apps approaching their limit.</p>
              ) : (
                <div className="space-y-2">
                  {appsNearLimit.map((app) => (
                    <div key={app.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${app.color} mr-2`}></div>
                        <span>{app.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-yellow-500 font-medium">{formatTime(app.usedTime)}</span>
                        <span className="text-gray-500"> / {formatTime(app.limit)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Time Saved</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatTime(savedTime)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've saved this much time by staying under your limits
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => router.push("/time-limits")}>Manage Time Limits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weekly Report Dialog */}
      <Dialog open={showWeeklyReport} onOpenChange={setShowWeeklyReport}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Weekly Usage Report</DialogTitle>
            <DialogDescription>A detailed analysis of your social media usage for the past week</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Summary Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Usage</p>
                        <p className="text-2xl font-bold">{formatTime(weeklyReportData.totalUsage)}</p>
                      </div>
                      <div
                        className={`flex items-center ${weeklyReportData.percentChange < 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {weeklyReportData.percentChange < 0 ? (
                          <ArrowDownRight className="h-5 w-5 mr-1" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 mr-1" />
                        )}
                        <span className="font-medium">{Math.abs(weeklyReportData.percentChange)}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Compared to {formatTime(weeklyReportData.previousWeek)} last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div>
                      <p className="text-sm text-gray-500">Time Saved</p>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {formatTime(weeklyReportData.savedTime)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">By staying under your app limits</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* App Usage Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">App Usage</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Most Used App</p>
                        <p className="text-sm text-gray-500">{weeklyReportData.mostUsedApp}</p>
                      </div>
                      <Badge variant="outline" className="text-teal-600">
                        {formatTime(weeklyReportData.mostUsedAppTime)}
                      </Badge>
                    </div>

                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={appData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label
                          >
                            {appData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Daily Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div>
                      <p className="font-medium">Best Day</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg font-bold">{weeklyReportData.bestDay}</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {formatTime(weeklyReportData.bestDayUsage)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div>
                      <p className="font-medium">Most Active Day</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg font-bold">{weeklyReportData.worstDay}</p>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          {formatTime(weeklyReportData.worstDayUsage)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Focus Sessions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Focus Sessions</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{weeklyReportData.focusSessions}</p>
                      <p className="text-sm text-gray-500">Sessions completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-right">{formatTime(weeklyReportData.focusSessionsTime)}</p>
                      <p className="text-sm text-gray-500 text-right">Total focus time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWeeklyReport(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Report Downloaded",
                  description: "Your weekly report has been downloaded as a PDF.",
                })
                setShowWeeklyReport(false)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insight Details Dialog */}
      <Dialog open={showInsightDetails} onOpenChange={setShowInsightDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insight Details</DialogTitle>
          </DialogHeader>

          {selectedInsight && (
            <div className="py-4 space-y-4">
              <div className="flex items-start space-x-3">
                <Badge
                  variant="outline"
                  className={`mt-1 flex-shrink-0 ${
                    insights.find((i) => i.id === selectedInsight)?.trend === "decrease"
                      ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : insights.find((i) => i.id === selectedInsight)?.trend === "increase"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {insights.find((i) => i.id === selectedInsight)?.badge}
                </Badge>
                <p>{insights.find((i) => i.id === selectedInsight)?.text}</p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {insights.find((i) => i.id === selectedInsight)?.details}
              </p>

              {insights.find((i) => i.id === selectedInsight)?.chart && (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={insights.find((i) => i.id === selectedInsight)?.chart}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}m`}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="minutes" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowInsightDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
