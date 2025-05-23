"use client"

import { useState } from "react"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DigitalDetox() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: "No Social Media Sunday",
      days: ["Sunday"],
      startTime: "00:00",
      endTime: "23:59",
      enabled: true,
    },
    {
      id: 2,
      name: "Bedtime Mode",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      startTime: "22:00",
      endTime: "07:00",
      enabled: true,
    },
    {
      id: 3,
      name: "Work Hours",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
      enabled: false,
    },
  ])

  const toggleSchedule = (id: number) => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule)),
    )
  }

  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day"
    if (days.length === 5 && !days.includes("Saturday") && !days.includes("Sunday")) return "Weekdays"
    if (days.length === 2 && days.includes("Saturday") && days.includes("Sunday")) return "Weekends"
    return days.join(", ")
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 text-teal-600 dark:text-teal-400" />
          Digital Detox
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Schedule regular breaks from social media</p>
      </div>

      {/* Schedules */}
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className={schedule.enabled ? "" : "opacity-70"}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{schedule.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDays(schedule.days)}</p>
                </div>
                <Switch checked={schedule.enabled} onCheckedChange={() => toggleSchedule(schedule.id)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Schedule */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Schedule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Detox Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Schedule Name</Label>
              <Input id="name" placeholder="e.g., Morning Focus Time" />
            </div>

            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <Badge key={day} variant="outline" className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input id="end" type="time" defaultValue="17:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apps">Apps to Block</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All social apps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All social apps</SelectItem>
                  <SelectItem value="custom">Custom selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Create Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tips */}
      <Card className="bg-gray-50 dark:bg-gray-800 border-teal-200 dark:border-teal-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-teal-700 dark:text-teal-300">Digital Detox Tips</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Start with small detox periods and gradually increase</li>
            <li>• Schedule detox during your most productive hours</li>
            <li>• Create a bedtime detox to improve sleep quality</li>
            <li>• Try a full day detox on weekends to reconnect with real life</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
