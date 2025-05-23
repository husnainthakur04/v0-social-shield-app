"use client"

import { useState } from "react"
import { Smile, Meh, Frown, BarChart3, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

// Sample mood data
const MOOD_DATA = [
  { date: "2023-06-01", mood: "happy", socialMediaMinutes: 45 },
  { date: "2023-06-02", mood: "neutral", socialMediaMinutes: 65 },
  { date: "2023-06-03", mood: "sad", socialMediaMinutes: 120 },
  { date: "2023-06-04", mood: "happy", socialMediaMinutes: 30 },
  { date: "2023-06-05", mood: "neutral", socialMediaMinutes: 75 },
  { date: "2023-06-06", mood: "happy", socialMediaMinutes: 40 },
  { date: "2023-06-07", mood: "sad", socialMediaMinutes: 110 },
]

export function MoodTracker({ preview = false }: { preview?: boolean }) {
  const { toast } = useToast()
  const [currentMood, setCurrentMood] = useState<"happy" | "neutral" | "sad" | null>(null)

  // Calculate correlation between mood and social media usage
  const happyAvg =
    MOOD_DATA.filter((d) => d.mood === "happy").reduce((sum, d) => sum + d.socialMediaMinutes, 0) /
    MOOD_DATA.filter((d) => d.mood === "happy").length

  const sadAvg =
    MOOD_DATA.filter((d) => d.mood === "sad").reduce((sum, d) => sum + d.socialMediaMinutes, 0) /
    MOOD_DATA.filter((d) => d.mood === "sad").length

  const correlation =
    sadAvg > happyAvg * 1.5 ? "strong negative" : sadAvg > happyAvg * 1.2 ? "moderate negative" : "weak"

  const handleMoodSelection = (mood: "happy" | "neutral" | "sad") => {
    setCurrentMood(mood)
    toast({
      title: "Mood Recorded",
      description: "Thanks for sharing how you're feeling today.",
    })
  }

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Today's Mood</h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Meh className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Frown className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium">Social Media Impact</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {correlation === "strong negative"
                  ? "High social media use strongly correlates with lower mood"
                  : "Moderate correlation between social media use and mood"}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">How are you feeling today?</h3>
          <div className="flex justify-center space-x-8">
            <Button
              variant={currentMood === "happy" ? "default" : "ghost"}
              className="flex flex-col items-center"
              onClick={() => handleMoodSelection("happy")}
            >
              <div
                className={`p-3 rounded-full ${currentMood === "happy" ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"} mb-2`}
              >
                <Smile
                  className={`h-6 w-6 ${currentMood === "happy" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}
                />
              </div>
              <span>Happy</span>
            </Button>
            <Button
              variant={currentMood === "neutral" ? "default" : "ghost"}
              className="flex flex-col items-center"
              onClick={() => handleMoodSelection("neutral")}
            >
              <div
                className={`p-3 rounded-full ${currentMood === "neutral" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"} mb-2`}
              >
                <Meh
                  className={`h-6 w-6 ${currentMood === "neutral" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                />
              </div>
              <span>Neutral</span>
            </Button>
            <Button
              variant={currentMood === "sad" ? "default" : "ghost"}
              className="flex flex-col items-center"
              onClick={() => handleMoodSelection("sad")}
            >
              <div
                className={`p-3 rounded-full ${currentMood === "sad" ? "bg-amber-100 dark:bg-amber-900" : "bg-gray-100 dark:bg-gray-800"} mb-2`}
              >
                <Frown
                  className={`h-6 w-6 ${currentMood === "sad" ? "text-amber-600 dark:text-amber-400" : "text-gray-500"}`}
                />
              </div>
              <span>Stressed</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Social Media & Mood Correlation</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Happy Days Avg. Usage</span>
                <span className="text-sm font-medium">{Math.round(happyAvg)} min/day</span>
              </div>
              <Progress value={(happyAvg / 120) * 100} className="h-2 bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Stressed Days Avg. Usage</span>
                <span className="text-sm font-medium">{Math.round(sadAvg)} min/day</span>
              </div>
              <Progress value={(sadAvg / 120) * 100} className="h-2 bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
              <h4 className="text-sm font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-amber-500" />
                Analysis
              </h4>
              <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                {correlation === "strong negative"
                  ? "You tend to feel more stressed on days with high social media usage (over 100 minutes)."
                  : "There appears to be a moderate correlation between higher social media usage and stress levels."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Mood Tracking History</h3>
          <div className="space-y-3">
            {MOOD_DATA.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                    {entry.mood === "happy" ? (
                      <Smile className="h-4 w-4 text-green-500" />
                    ) : entry.mood === "neutral" ? (
                      <Meh className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Frown className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{entry.socialMediaMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
