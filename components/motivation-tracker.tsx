"use client"

import { useState, useEffect } from "react"
import { Flame, Award, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAppStore, motivationalQuotes } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"

export function MotivationTracker() {
  const { streakCount, detoxStreak, focusStreak, bestDetoxStreak, bestFocusStreak, points, level, checkDailyStreak } =
    useAppStore()

  const [quote, setQuote] = useState(motivationalQuotes[0])

  // Check daily streak on component mount
  useEffect(() => {
    checkDailyStreak()

    // Set a random quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuote(motivationalQuotes[randomIndex])

    // Change quote every 24 hours
    const interval = setInterval(
      () => {
        const newIndex = Math.floor(Math.random() * motivationalQuotes.length)
        setQuote(motivationalQuotes[newIndex])
      },
      24 * 60 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [checkDailyStreak])

  // Calculate level progress
  const nextLevel = level + 1
  const pointsForNextLevel = nextLevel * 500
  const pointsInCurrentLevel = points - (level - 1) * 500
  const progressToNextLevel = (pointsInCurrentLevel / 500) * 100

  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <AnimatedSection animation="fade" duration={0.6}>
        <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Quote className="h-6 w-6 mr-2 flex-shrink-0 mt-1 opacity-70" />
              <div>
                <p className="text-sm font-medium italic">"{quote.quote}"</p>
                <p className="text-xs mt-1 opacity-80">— {quote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Streak Tracker */}
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            Your Streaks
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{streakCount}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-500">{detoxStreak}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Detox Streak</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-purple-500">{focusStreak}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Focus Streak</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Best Detox: {bestDetoxStreak} days</span>
            <span>Best Focus: {bestFocusStreak} days</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Points & Level */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Level {level}
            </h2>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100">
              {points} points
            </Badge>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {nextLevel}</span>
                  <span>{pointsInCurrentLevel} / 500</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Earn points by completing focus sessions, maintaining streaks, and staying under your app limits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  )
}
