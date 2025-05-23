"use client"

import { Award, Users, Star, Trophy, Gift } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgesShowcase } from "@/components/badges-showcase"
import { MotivationTracker } from "@/components/motivation-tracker"
import { PointsHistory } from "@/components/points-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

export function Rewards() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-60 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header with Light/Dark Toggle */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Award className="mr-2 text-teal-600 dark:text-teal-400" />
            Rewards & Motivation
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress and earn rewards</p>
      </AnimatedSection>

      {/* Daily Streak Card */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white dark:from-teal-700 dark:to-teal-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Current Streak</h3>
                <p className="text-sm opacity-90">Keep it going!</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 rounded-full p-3">
                  <Star className="h-6 w-6 text-yellow-300" />
                </div>
                <span className="text-3xl font-bold">7</span>
                <span className="text-lg">days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Main Content */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
        </TabsList>

        <TabsContent value="motivation" className="mt-4 space-y-6">
          <MotivationTracker />
        </TabsContent>

        <TabsContent value="badges" className="mt-4 space-y-6">
          <BadgesShowcase />
        </TabsContent>

        <TabsContent value="points" className="mt-4 space-y-6">
          <PointsHistory />
        </TabsContent>
      </Tabs>

      {/* Achievements Section */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full mr-3">
                    <Star className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium">Early Bird</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Used the app before 8 AM for 5 days</p>
                  </div>
                </div>
                <span className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded-full">
                  +50 pts
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                    <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Focus Master</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed 10 focus sessions</p>
                  </div>
                </div>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                  +100 pts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Friends Section */}
      <AnimatedSection animation="slide-up" delay={0.4} duration={0.6}>
        <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-white dark:text-teal-300" />
                <div>
                  <h3 className="font-medium">Invite Friends</h3>
                  <p className="text-sm opacity-90">Compete together for better results</p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-teal-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={() => {
                  toast({
                    title: "Invitation Sent",
                    description: "Your friends will receive an invitation to join Social Shield.",
                  })
                }}
              >
                Invite Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}
