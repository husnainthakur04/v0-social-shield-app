import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Define types
export type App = {
  id: number
  name: string
  icon: string
  limit: number
  usedTime: number
  enabled: boolean
  color: string
  bgColor: string
}

export type DetoxSchedule = {
  id: number
  name: string
  days: string[]
  startTime: string
  endTime: string
  enabled: boolean
  apps: number[]
}

export type FocusSession = {
  startTime: number
  endTime: number | null
  duration: number
  completed: boolean
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: number
  progress?: number
  maxProgress?: number
}

export type Achievement = {
  id: string
  name: string
  description: string
  completed: boolean
  date?: number
}

export type NotificationSettings = {
  appLimits: boolean
  focusMode: boolean
  detoxReminders: boolean
  streakAlerts: boolean
  achievements: boolean
  dailyRecap: boolean
}

export type SecuritySettings = {
  appLockEnabled: boolean
  lockMethod: "none" | "pin" | "biometric"
  pinCode?: string
  lockAfter: "immediate" | "1min" | "5min" | "15min" | "30min"
  requireOnStartup: boolean
}

interface AppState {
  // App tracking
  apps: App[]
  updateApp: (id: number, data: Partial<App>) => void
  incrementAppUsage: (id: number, minutes: number) => void

  // Focus mode
  focusActive: boolean
  focusDuration: number
  focusStartTime: number | null
  focusEndTime: number | null
  focusSessions: FocusSession[]
  setFocusActive: (active: boolean) => void
  setFocusDuration: (minutes: number) => void
  startFocusSession: () => void
  endFocusSession: () => void

  // Detox schedules
  detoxSchedules: DetoxSchedule[]
  updateDetoxSchedule: (id: number, data: Partial<DetoxSchedule>) => void
  addDetoxSchedule: (schedule: DetoxSchedule) => void
  removeDetoxSchedule: (id: number) => void

  // Stats & Rewards
  streakCount: number
  totalSavedTime: number
  dailyGoalMet: boolean
  incrementStreak: () => void
  resetStreak: () => void
  updateSavedTime: (minutes: number) => void

  // Gamification
  points: number
  level: number
  badges: Badge[]
  achievements: Achievement[]
  detoxStreak: number
  focusStreak: number
  bestDetoxStreak: number
  bestFocusStreak: number
  lastCheckInDate: string | null
  addPoints: (amount: number, reason?: string) => void
  incrementDetoxStreak: () => void
  resetDetoxStreak: () => void
  incrementFocusStreak: () => void
  resetFocusStreak: () => void
  earnBadge: (id: string) => void
  updateBadgeProgress: (id: string, progress: number) => void
  completeAchievement: (id: string) => void
  checkDailyStreak: () => void

  // Settings
  darkMode: boolean
  setDarkMode: (enabled: boolean) => void
  language: string
  setLanguage: (lang: string) => void
  notifications: NotificationSettings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  security: SecuritySettings
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void
  isAuthenticated: boolean
  setAuthenticated: (authenticated: boolean) => void
  resetApp: () => void
  exportData: () => string
  importData: (data: string) => boolean

  permissionsGranted: boolean
  setPermissionsGranted: (granted: boolean) => void
}

// Create a safe storage that works in both browser and server environments
const createSafeStorage = () => {
  // Return a no-op storage for SSR
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }
  }

  // Return the actual localStorage for client-side
  return createJSONStorage(() => localStorage)
}

// Default data
const defaultApps: App[] = [
  {
    id: 1,
    name: "Instagram",
    icon: "Instagram",
    limit: 45,
    usedTime: 25,
    enabled: true,
    color: "bg-pink-500",
    bgColor: "bg-pink-100",
  },
  {
    id: 2,
    name: "Facebook",
    icon: "Facebook",
    limit: 30,
    usedTime: 15,
    enabled: true,
    color: "bg-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    name: "YouTube",
    icon: "Youtube",
    limit: 60,
    usedTime: 40,
    enabled: true,
    color: "bg-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: 4,
    name: "Twitter",
    icon: "Twitter",
    limit: 20,
    usedTime: 10,
    enabled: true,
    color: "bg-sky-500",
    bgColor: "bg-sky-100",
  },
  {
    id: 5,
    name: "TikTok",
    icon: "TikTok",
    limit: 30,
    usedTime: 20,
    enabled: false,
    color: "bg-black",
    bgColor: "bg-gray-100",
  },
  {
    id: 6,
    name: "LinkedIn",
    icon: "Linkedin",
    limit: 15,
    usedTime: 5,
    enabled: false,
    color: "bg-blue-800",
    bgColor: "bg-blue-50",
  },
]

const defaultDetoxSchedules: DetoxSchedule[] = [
  {
    id: 1,
    name: "No Social Media Sunday",
    days: ["Sunday"],
    startTime: "00:00",
    endTime: "23:59",
    enabled: true,
    apps: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    name: "Bedtime Mode",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    startTime: "22:00",
    endTime: "07:00",
    enabled: true,
    apps: [1, 2, 4, 5],
  },
  {
    id: 3,
    name: "Work Hours",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "09:00",
    endTime: "17:00",
    enabled: false,
    apps: [1, 2, 3, 4, 5, 6],
  },
]

const defaultBadges: Badge[] = [
  {
    id: "first-focus",
    name: "Focus Initiate",
    description: "Complete your first focus session",
    icon: "Focus",
    earned: false,
  },
  {
    id: "focus-master",
    name: "Focus Master",
    description: "Complete 10 focus sessions",
    icon: "Focus",
    earned: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "detox-day",
    name: "Digital Detox Day",
    description: "Complete a full day of digital detox",
    icon: "Calendar",
    earned: false,
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Maintain your goals for 3 days in a row",
    icon: "Flame",
    earned: false,
  },
  {
    id: "streak-7",
    name: "Weekly Warrior",
    description: "Maintain your goals for 7 days in a row",
    icon: "Flame",
    earned: false,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintain your goals for 30 days in a row",
    icon: "Flame",
    earned: false,
  },
  {
    id: "time-saver",
    name: "Time Saver",
    description: "Save 5 hours of screen time",
    icon: "Clock",
    earned: false,
    progress: 0,
    maxProgress: 300,
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "No social media before 10 AM for 5 days",
    icon: "Sunrise",
    earned: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "night-owl",
    name: "Night Owl Tamer",
    description: "No social media after 10 PM for 5 days",
    icon: "Moon",
    earned: false,
    progress: 0,
    maxProgress: 5,
  },
]

const defaultAchievements: Achievement[] = [
  {
    id: "first-week",
    name: "First Week Complete",
    description: "Use Social Shield for a full week",
    completed: false,
  },
  {
    id: "under-limit",
    name: "Under the Limit",
    description: "Stay under your app limits for all apps in a day",
    completed: false,
  },
  {
    id: "schedule-master",
    name: "Schedule Master",
    description: "Create and follow 3 different detox schedules",
    completed: false,
  },
]

const defaultNotificationSettings: NotificationSettings = {
  appLimits: true,
  focusMode: true,
  detoxReminders: true,
  streakAlerts: true,
  achievements: true,
  dailyRecap: true,
}

const defaultSecuritySettings: SecuritySettings = {
  appLockEnabled: false,
  lockMethod: "none",
  lockAfter: "immediate",
  requireOnStartup: true,
}

// Get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(
    2,
    "0",
  )}`
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // App tracking
      apps: defaultApps,
      updateApp: (id, data) =>
        set((state) => ({
          apps: state.apps.map((app) => (app.id === id ? { ...app, ...data } : app)),
        })),
      incrementAppUsage: (id, minutes) =>
        set((state) => ({
          apps: state.apps.map((app) => (app.id === id ? { ...app, usedTime: app.usedTime + minutes } : app)),
        })),

      // Focus mode
      focusActive: false,
      focusDuration: 30,
      focusStartTime: null,
      focusEndTime: null,
      focusSessions: [],
      setFocusActive: (active) => set({ focusActive: active }),
      setFocusDuration: (minutes) => set({ focusDuration: minutes }),
      startFocusSession: () => {
        const now = Date.now()
        set((state) => ({
          focusActive: true,
          focusStartTime: now,
          focusEndTime: now + state.focusDuration * 60 * 1000,
        }))
      },
      endFocusSession: () => {
        const now = Date.now()
        set((state) => {
          const startTime = state.focusStartTime || now
          const sessionDuration = Math.floor((now - startTime) / (60 * 1000))
          const newSession = {
            startTime,
            endTime: now,
            duration: sessionDuration,
            completed: (state.focusEndTime || 0) <= now,
          }

          // Check if this is the first completed session
          if (newSession.completed && state.focusSessions.length === 0) {
            // Award the "Focus Initiate" badge
            get().earnBadge("first-focus")
            get().addPoints(50, "First focus session completed")
          }

          // Update progress for "Focus Master" badge
          if (newSession.completed) {
            const completedSessions = state.focusSessions.filter((s) => s.completed).length + 1
            get().updateBadgeProgress("focus-master", completedSessions)
            get().addPoints(25, "Focus session completed")

            // Increment focus streak
            get().incrementFocusStreak()
          }

          return {
            focusActive: false,
            focusStartTime: null,
            focusEndTime: null,
            focusSessions: [...state.focusSessions, newSession],
            totalSavedTime: state.totalSavedTime + sessionDuration,
          }
        })
      },

      // Detox schedules
      detoxSchedules: defaultDetoxSchedules,
      updateDetoxSchedule: (id, data) =>
        set((state) => ({
          detoxSchedules: state.detoxSchedules.map((schedule) =>
            schedule.id === id ? { ...schedule, ...data } : schedule,
          ),
        })),
      addDetoxSchedule: (schedule) =>
        set((state) => ({
          detoxSchedules: [...state.detoxSchedules, schedule],
        })),
      removeDetoxSchedule: (id) =>
        set((state) => ({
          detoxSchedules: state.detoxSchedules.filter((schedule) => schedule.id !== id),
        })),

      // Stats & Rewards
      streakCount: 3,
      totalSavedTime: 210, // in minutes
      dailyGoalMet: true,
      incrementStreak: () => {
        set((state) => {
          const newStreakCount = state.streakCount + 1

          // Check for streak badges
          if (newStreakCount === 3) {
            get().earnBadge("streak-3")
            get().addPoints(100, "3-day streak achieved")
          } else if (newStreakCount === 7) {
            get().earnBadge("streak-7")
            get().addPoints(250, "7-day streak achieved")
          } else if (newStreakCount === 30) {
            get().earnBadge("streak-30")
            get().addPoints(1000, "30-day streak achieved")
          }

          return { streakCount: newStreakCount }
        })
      },
      resetStreak: () => set({ streakCount: 0 }),
      updateSavedTime: (minutes) =>
        set((state) => {
          const newTotalSavedTime = state.totalSavedTime + minutes

          // Update progress for "Time Saver" badge
          get().updateBadgeProgress("time-saver", Math.min(newTotalSavedTime, 300))

          // Add points for saved time
          get().addPoints(Math.floor(minutes / 5), "Time saved")

          return {
            totalSavedTime: newTotalSavedTime,
          }
        }),

      // Gamification
      points: 0,
      level: 1,
      badges: defaultBadges,
      achievements: defaultAchievements,
      detoxStreak: 0,
      focusStreak: 0,
      bestDetoxStreak: 0,
      bestFocusStreak: 0,
      lastCheckInDate: null,

      addPoints: (amount, reason) => {
        set((state) => {
          const newPoints = state.points + amount
          const newLevel = Math.floor(newPoints / 500) + 1

          // If level increased, add bonus points
          let bonusPoints = 0
          if (newLevel > state.level) {
            bonusPoints = 100 * (newLevel - state.level)
            // Could trigger level up notification here
          }

          return {
            points: newPoints + bonusPoints,
            level: newLevel,
          }
        })
      },

      incrementDetoxStreak: () => {
        set((state) => {
          const newDetoxStreak = state.detoxStreak + 1
          const newBestDetoxStreak = Math.max(state.bestDetoxStreak, newDetoxStreak)

          // Award points for continuing the streak
          get().addPoints(10 * newDetoxStreak, "Detox streak continued")

          // Check for detox day badge
          if (newDetoxStreak === 1) {
            get().earnBadge("detox-day")
          }

          return {
            detoxStreak: newDetoxStreak,
            bestDetoxStreak: newBestDetoxStreak,
          }
        })
      },

      resetDetoxStreak: () => set({ detoxStreak: 0 }),

      incrementFocusStreak: () => {
        set((state) => {
          const newFocusStreak = state.focusStreak + 1
          const newBestFocusStreak = Math.max(state.bestFocusStreak, newFocusStreak)

          // Award points for continuing the streak
          get().addPoints(15 * newFocusStreak, "Focus streak continued")

          return {
            focusStreak: newFocusStreak,
            bestFocusStreak: newBestFocusStreak,
          }
        })
      },

      resetFocusStreak: () => set({ focusStreak: 0 }),

      earnBadge: (id) => {
        set((state) => ({
          badges: state.badges.map((badge) =>
            badge.id === id ? { ...badge, earned: true, earnedDate: Date.now() } : badge,
          ),
        }))

        // Add points for earning a badge
        get().addPoints(100, `Badge earned: ${id}`)
      },

      updateBadgeProgress: (id, progress) => {
        set((state) => {
          const updatedBadges = state.badges.map((badge) => {
            if (badge.id === id) {
              const updatedBadge = { ...badge, progress }

              // Check if badge should be earned
              if (badge.maxProgress && progress >= badge.maxProgress && !badge.earned) {
                updatedBadge.earned = true
                updatedBadge.earnedDate = Date.now()

                // Add points for earning the badge
                get().addPoints(100, `Badge earned: ${id}`)
              }

              return updatedBadge
            }
            return badge
          })

          return { badges: updatedBadges }
        })
      },

      completeAchievement: (id) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id ? { ...achievement, completed: true, date: Date.now() } : achievement,
          ),
        }))

        // Add points for completing an achievement
        get().addPoints(200, `Achievement completed: ${id}`)
      },

      checkDailyStreak: () => {
        const today = getTodayDateString()

        set((state) => {
          // If this is the first check-in, just set the date
          if (!state.lastCheckInDate) {
            return { lastCheckInDate: today }
          }

          // If already checked in today, do nothing
          if (state.lastCheckInDate === today) {
            return {}
          }

          // Check if the last check-in was yesterday
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayString = getTodayDateString()

          if (state.lastCheckInDate === yesterdayString) {
            // Increment streak
            get().incrementStreak()
            return { lastCheckInDate: today }
          } else {
            // Streak broken
            get().resetStreak()
            return { lastCheckInDate: today }
          }
        })
      },

      // Settings
      darkMode: false,
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
      notifications: defaultNotificationSettings,
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),
      security: defaultSecuritySettings,
      updateSecuritySettings: (settings) =>
        set((state) => ({
          security: { ...state.security, ...settings },
        })),
      isAuthenticated: true, // Default to true for development
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      resetApp: () =>
        set({
          apps: defaultApps,
          detoxSchedules: defaultDetoxSchedules,
          focusActive: false,
          focusDuration: 30,
          focusStartTime: null,
          focusEndTime: null,
          focusSessions: [],
          streakCount: 0,
          totalSavedTime: 0,
          dailyGoalMet: false,
          points: 0,
          level: 1,
          badges: defaultBadges,
          achievements: defaultAchievements,
          detoxStreak: 0,
          focusStreak: 0,
          bestDetoxStreak: 0,
          bestFocusStreak: 0,
          lastCheckInDate: null,
          notifications: defaultNotificationSettings,
          security: defaultSecuritySettings,
          isAuthenticated: true,
        }),

      exportData: () => {
        const state = get()
        const exportData = {
          apps: state.apps,
          detoxSchedules: state.detoxSchedules,
          focusSessions: state.focusSessions,
          streakCount: state.streakCount,
          totalSavedTime: state.totalSavedTime,
          dailyGoalMet: state.dailyGoalMet,
          points: state.points,
          level: state.level,
          badges: state.badges,
          achievements: state.achievements,
          detoxStreak: state.detoxStreak,
          focusStreak: state.focusStreak,
          bestDetoxStreak: state.bestDetoxStreak,
          bestFocusStreak: state.bestFocusStreak,
          lastCheckInDate: state.lastCheckInDate,
          language: state.language,
          darkMode: state.darkMode,
          notifications: state.notifications,
        }
        return JSON.stringify(exportData)
      },

      importData: (data) => {
        try {
          const importedData = JSON.parse(data)
          set({
            apps: importedData.apps || defaultApps,
            detoxSchedules: importedData.detoxSchedules || defaultDetoxSchedules,
            focusSessions: importedData.focusSessions || [],
            streakCount: importedData.streakCount || 0,
            totalSavedTime: importedData.totalSavedTime || 0,
            dailyGoalMet: importedData.dailyGoalMet || false,
            points: importedData.points || 0,
            level: importedData.level || 1,
            badges: importedData.badges || defaultBadges,
            achievements: importedData.achievements || defaultAchievements,
            detoxStreak: importedData.detoxStreak || 0,
            focusStreak: importedData.focusStreak || 0,
            bestDetoxStreak: importedData.bestDetoxStreak || 0,
            bestFocusStreak: importedData.bestFocusStreak || 0,
            lastCheckInDate: importedData.lastCheckInDate || null,
            language: importedData.language || "en",
            darkMode: importedData.darkMode || false,
            notifications: importedData.notifications || defaultNotificationSettings,
          })
          return true
        } catch (error) {
          console.error("Failed to import data:", error)
          return false
        }
      },
      permissionsGranted: false,
      setPermissionsGranted: (granted) => set({ permissionsGranted: granted }),
    }),
    {
      name: "social-shield-storage",
      storage: createSafeStorage(),
      partialize: (state) => ({
        apps: state.apps,
        detoxSchedules: state.detoxSchedules,
        focusSessions: state.focusSessions,
        streakCount: state.streakCount,
        totalSavedTime: state.totalSavedTime,
        dailyGoalMet: state.dailyGoalMet,
        darkMode: state.darkMode,
        points: state.points,
        level: state.level,
        badges: state.badges,
        achievements: state.achievements,
        detoxStreak: state.detoxStreak,
        focusStreak: state.focusStreak,
        bestDetoxStreak: state.bestDetoxStreak,
        bestFocusStreak: state.bestFocusStreak,
        lastCheckInDate: state.lastCheckInDate,
        language: state.language,
        notifications: state.notifications,
        security: state.security,
        isAuthenticated: state.isAuthenticated,
        permissionsGranted: state.permissionsGranted,
      }),
    },
  ),
)

// Motivational quotes
export const motivationalQuotes = [
  {
    quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
  },
  {
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    quote: "Technology should improve your life, not become your life.",
    author: "Billy Cox",
  },
  {
    quote: "The real wealth of life is how well we spend our time.",
    author: "Anonymous",
  },
  {
    quote: "Offline is the new luxury.",
    author: "Anonymous",
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
  },
  {
    quote: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson",
  },
]

// Available languages
export const availableLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
]
