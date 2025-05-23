"use client"

import { useState } from "react"
import { Moon, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Sample sleep data
const SLEEP_DATA = [
  { date: "2023-06-01", quality: 85, socialBefore: false, screenTimeBeforeBed: 15 },
  { date: "2023-06-02", quality: 65, socialBefore: true, screenTimeBeforeBed: 45 },
  { date: "2023-06-03", quality: 60, socialBefore: true, screenTimeBeforeBed: 60 },
  { date: "2023-06-04", quality: 90, socialBefore: false, screenTimeBeforeBed: 5 },
  { date: "2023-06-05", quality: 75, socialBefore: true, screenTimeBeforeBed: 30 },
  { date: "2023-06-06", quality: 80, socialBefore: false, screenTimeBeforeBed: 20 },
  { date: "2023-06-07", quality: 70, socialBefore: true, screenTimeBeforeBed: 40 },
]

export function SleepTracker({ preview = false }: { preview?: boolean }) {
  const { toast } = useToast()
  const [sleepModeEnabled, setSleepModeEnabled] = useState(true)
  const [bedtime, setBedtime] = useState("22:30")
  const [wakeTime, setWakeTime] = useState("07:00")
  const [noScreensTime, setNoScreensTime] = useState(30) // minutes before bed

  // Calculate average sleep quality with and without social media
  const avgWithSocial =
    SLEEP_DATA.filter((d) => d.socialBefore).reduce((sum, d) => sum + d.quality, 0) /
    SLEEP_DATA.filter((d) => d.socialBefore).length

  const avgWithoutSocial =
    SLEEP_DATA.filter((d) => !d.socialBefore).reduce((sum, d) => sum + d.quality, 0) /
    SLEEP_DATA.filter((d) => !d.socialBefore).length

  const handleSleepModeToggle = (enabled: boolean) => {
    setSleepModeEnabled(enabled)
    toast({
      title: enabled ? "Sleep Mode Enabled" : "Sleep Mode Disabled",
      description: enabled
        ? "Your device will automatically limit social media before bedtime"
        : "Sleep mode has been turned off",
    })
  }

  // Time picker component
  const TimePickerInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    return (
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    )
  }

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">Sleep Mode</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Blocks social media before bedtime</p>
          </div>
          <Switch checked={sleepModeEnabled} onCheckedChange={handleSleepModeToggle} />
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
          <div className="flex items-center">
            <Moon className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium">Sleep Quality Impact</h4>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                Your sleep quality is {Math.round(avgWithoutSocial - avgWithSocial)}% better on nights without social
                media use
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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Sleep Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically block social media before bedtime
              </p>
            </div>
            <Switch checked={sleepModeEnabled} onCheckedChange={handleSleepModeToggle} />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedtime</label>
                <TimePickerInput value={bedtime} onChange={setBedtime} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wake Time</label>
                <TimePickerInput value={wakeTime} onChange={setWakeTime} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">No Screens Before Bed</label>
                <span className="text-sm">{noScreensTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setNoScreensTime(Math.max(15, noScreensTime - 15))}>
                  -
                </Button>
                <Progress value={(noScreensTime / 60) * 100} className="h-2 flex-1" />
                <Button variant="outline" size="sm" onClick={() => setNoScreensTime(Math.min(60, noScreensTime + 15))}>
                  +
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Sleep Quality Analysis</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">With Social Media Before Bed</span>
                <span className="text-sm font-medium">{Math.round(avgWithSocial)}% quality</span>
              </div>
              <Progress value={avgWithSocial} className="h-2 bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Without Social Media Before Bed</span>
                <span className="text-sm font-medium">{Math.round(avgWithoutSocial)}% quality</span>
              </div>
              <Progress value={avgWithoutSocial} className="h-2 bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
              <h4 className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                Sleep Impact Analysis
              </h4>
              <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                Your sleep quality is {Math.round(avgWithoutSocial - avgWithSocial)}% better on nights when you don't
                use social media before bed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Recent Sleep Data</h3>
          <div className="space-y-3">
            {SLEEP_DATA.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full ${entry.quality >= 80 ? "bg-green-100 dark:bg-green-900/30" : entry.quality >= 70 ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                  >
                    <Moon
                      className={`h-4 w-4 ${entry.quality >= 80 ? "text-green-500" : entry.quality >= 70 ? "text-yellow-500" : "text-red-500"}`}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{entry.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.screenTimeBeforeBed} min screen time before bed
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant={entry.socialBefore ? "destructive" : "outline"}>
                    {entry.socialBefore ? "Social Media Used" : "No Social Media"}
                  </Badge>
                  <span className="ml-2 text-sm font-medium">{entry.quality}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
