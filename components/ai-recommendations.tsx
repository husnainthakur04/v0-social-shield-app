"use client"

import { useState } from "react"
import { Brain, Lightbulb, Clock, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedList } from "@/components/ui/animated-list"
import { useAppStore } from "@/lib/store"

// Sample AI-generated recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Optimal Social Media Time",
    description:
      "Based on your productivity patterns, the best time for you to check social media is between 12:30-1:00 PM during your lunch break.",
    type: "timing",
    impact: "high",
  },
  {
    id: 2,
    title: "Instagram Usage Pattern",
    description:
      "You tend to spend 15+ minutes on Instagram whenever you open it after 9 PM. Consider setting a stricter evening limit.",
    type: "insight",
    impact: "medium",
  },
  {
    id: 3,
    title: "Focus Session Recommendation",
    description: "Your productivity peaks between 9-11 AM. Schedule your most important tasks during this window.",
    type: "productivity",
    impact: "high",
  },
]

export function AiRecommendations({ full = false }: { full?: boolean }) {
  const { apps } = useAppStore()
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS)

  // Get icon based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "timing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "insight":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      case "productivity":
        return <Calendar className="h-5 w-5 text-green-500" />
      default:
        return <Brain className="h-5 w-5 text-purple-500" />
    }
  }

  // Get badge color based on impact
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">High Impact</Badge>
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Low Impact</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {!full && (
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Personalized recommendations based on your usage patterns
          </p>
        </div>
      )}

      <AnimatedList staggerDelay={0.1}>
        {(full ? recommendations : recommendations.slice(0, 1)).map((rec) => (
          <Card key={rec.id} className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-white dark:bg-gray-700 flex-shrink-0">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{rec.title}</h3>
                    {getImpactBadge(rec.impact)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{rec.description}</p>
                  {full && (
                    <Button variant="ghost" size="sm" className="mt-2 text-teal-600 dark:text-teal-400 p-0 h-auto">
                      Apply This Recommendation <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </AnimatedList>

      {!full && recommendations.length > 1 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          +{recommendations.length - 1} more recommendations available
        </p>
      )}
    </div>
  )
}
