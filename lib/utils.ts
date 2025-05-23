import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Chrome,
  Globe,
  Smartphone,
  type LucideIcon,
  InstagramIcon as TiktokIcon,
  SnailIcon as Snapchat,
  Slack,
  Twitch,
  RssIcon as Reddit,
  DiscIcon as Discord,
  PhoneIcon as Whatsapp,
  TextIcon as Telegram,
  PinIcon as Pinterest,
  Music,
  Video,
  ShoppingBag,
  GamepadIcon,
  BookOpen,
} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }

  return `${mins}m`
}

export function calculateTotalUsage(apps: any[]): number {
  if (!apps || !Array.isArray(apps)) return 0
  return apps.reduce((total, app) => total + (app.usedTime || 0), 0)
}

export function calculateTotalLimit(apps: any[]): number {
  if (!apps || !Array.isArray(apps)) return 0
  return apps.reduce((total, app) => total + (app.limit || 0), 0)
}

export function calculateSavedTime(apps: any[]): number {
  if (!apps || !Array.isArray(apps)) return 0
  return apps.reduce((total, app) => {
    if (app.enabled && app.usedTime < app.limit) {
      return total + (app.limit - app.usedTime)
    }
    return total
  }, 0)
}

// Map app names to Lucide icons
export function getAppIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    // Social media
    Instagram,
    Facebook,
    YouTube: Youtube,
    Twitter,
    LinkedIn: Linkedin,
    TikTok: TiktokIcon || Globe, // Fallback to Globe if TiktokIcon is not available
    Snapchat: Snapchat || Globe,
    WhatsApp: Whatsapp,
    Telegram,
    Discord,
    Reddit,
    Pinterest,
    Slack,
    Twitch,

    // Communication
    Messages: MessageCircle,
    Email: Mail,

    // Browsers
    Chrome,
    Safari: Globe,
    Firefox: Globe,
    Edge: Globe,

    // Generic
    Browser: Globe,
    App: Smartphone,
    Game: GamepadIcon,
    Music,
    Video,
    Shopping: ShoppingBag,
    Reading: BookOpen,

    // Default
    Default: Globe,
  }

  // Return the icon if it exists, otherwise return the Default icon
  return iconMap[iconName] || iconMap.Default
}

export const getDailyData = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days.map((day, index) => ({
    day,
    minutes: Math.floor(Math.random() * 120), // Simulate random usage
  }))
}

export const getAppData = (apps: any[]) => {
  return apps.map((app) => ({
    name: app.name,
    value: app.usedTime,
  }))
}

export const isDetoxActive = (detoxSchedules: any[]) => {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
  const currentTime = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })

  return detoxSchedules.some((schedule) => {
    if (!schedule.enabled) return false

    const scheduleDays = schedule.days || []
    if (!scheduleDays.includes(currentDay)) return false

    const startTime = schedule.startTime || "00:00"
    const endTime = schedule.endTime || "23:59"

    return currentTime >= startTime && currentTime <= endTime
  })
}

export const formatTimeRemaining = (endTime: number): string => {
  const now = Date.now()
  const remaining = Math.max(0, endTime - now)
  const minutes = Math.floor(remaining / (60 * 1000))
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
