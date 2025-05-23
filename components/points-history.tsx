"use client"

import { useState } from "react"
import { ChevronRight, TrendingUp, Award, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"

// Mock data for points history
// In a real app, this would come from the store
const mockPointsHistory = [
  {
    id: 1,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    points: 25,
    reason: "Focus session completed",
    icon: "Focus",
  },
  {
    id: 2,
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    points: 50,
    reason: "Daily streak maintained",
    icon: "Flame",
  },
  {
    id: 3,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    points: 100,
    reason: "Badge earned: 3-Day Streak",
    icon: "Award",
  },
  {
    id: 4,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    points: 30,
    reason: "Under app limit for Instagram",
    icon: "Clock",
  },
  {
    id: 5,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    points: 75,
    reason: "Completed digital detox",
    icon: "Calendar",
  },
]

export function PointsHistory() {
  const { points, level } = useAppStore()
  const [expanded, setExpanded] = useState(false)

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="h-4 w-4" />
      case "Calendar":
        return <Calendar className="h-4 w-4" />
      case "Clock":
        return <Clock className="h-4 w-4" />
      case "Focus":
        return <Clock className="h-4 w-4" />
      case "Flame":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return `${diffDays}d ago`
    }
  }

  return (
    <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            <span>Points History</span>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100">
              Level {level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AnimatedList staggerDelay={0.05}>
            {mockPointsHistory.slice(0, expanded ? undefined : 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-3">
                    <div className="text-teal-600 dark:text-teal-300">{getIconComponent(item.icon)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.reason}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.date)}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                >
                  +{item.points}
                </Badge>
              </div>
            ))}
          </AnimatedList>

          {mockPointsHistory.length > 3 && (
            <Button
              variant="ghost"
              className="w-full mt-2 text-sm text-teal-600 dark:text-teal-400"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Show More"}
              <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
