"use client"

import { Clock, Calendar, Award, Flame, BarChart3, Focus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"
import { useToast } from "@/components/ui/use-toast"

export function NotificationSettings() {
  const { notifications, updateNotificationSettings } = useAppStore()
  const { toast } = useToast()

  const notificationItems = [
    {
      id: "appLimits",
      icon: <Clock className="h-5 w-5" />,
      title: "App Limits",
      description: "Get notified when you're approaching your daily limits",
      checked: notifications.appLimits,
    },
    {
      id: "focusMode",
      icon: <Focus className="h-5 w-5" />,
      title: "Focus Mode",
      description: "Notifications about focus sessions",
      checked: notifications.focusMode,
    },
    {
      id: "detoxReminders",
      icon: <Calendar className="h-5 w-5" />,
      title: "Detox Reminders",
      description: "Reminders about upcoming detox schedules",
      checked: notifications.detoxReminders,
    },
    {
      id: "streakAlerts",
      icon: <Flame className="h-5 w-5" />,
      title: "Streak Alerts",
      description: "Alerts about your daily streaks",
      checked: notifications.streakAlerts,
    },
    {
      id: "achievements",
      icon: <Award className="h-5 w-5" />,
      title: "Achievements",
      description: "Notifications when you earn badges or achievements",
      checked: notifications.achievements,
    },
    {
      id: "dailyRecap",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Daily Recap",
      description: "Get a summary of your daily usage",
      checked: notifications.dailyRecap,
    },
  ]

  const handleToggle = (id: keyof typeof notifications) => {
    updateNotificationSettings({ [id]: !notifications[id] })

    toast({
      title: notifications[id] ? "Notification Disabled" : "Notification Enabled",
      description: `${notificationItems.find((item) => item.id === id)?.title} notifications have been ${notifications[id] ? "disabled" : "enabled"}.`,
    })
  }

  return (
    <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
      <Card>
        <CardContent className="p-0">
          <AnimatedList staggerDelay={0.05}>
            {notificationItems.map((item, index) => (
              <div key={item.id}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">{item.icon}</div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={item.checked}
                    onCheckedChange={() => handleToggle(item.id as keyof typeof notifications)}
                  />
                </div>
                {index < notificationItems.length - 1 && <Separator />}
              </div>
            ))}
          </AnimatedList>
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
