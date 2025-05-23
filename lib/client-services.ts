// lib/client-services.ts

// Safe browser check
const isBrowser = typeof window !== "undefined"

// Safe localStorage implementation
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null) => {
    if (!isBrowser) return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  setItem: (key: string, value: any) => {
    if (!isBrowser) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
    }
  },
  removeItem: (key: string) => {
    if (!isBrowser) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
    }
  },
}

// App Usage Tracker Service
export class AppUsageTracker {
  private usageData: Record<string, number> = {}
  private permissionsGranted = false
  private isTracking = false
  private updateCallback: ((appId: number, timeUsed: number) => void) | null = null

  constructor() {
    // Initialize with some sample data
    this.usageData = {
      Instagram: 25,
      Facebook: 15,
      YouTube: 40,
      Twitter: 10,
      TikTok: 20,
      LinkedIn: 5,
    }

    // Check if permissions were previously granted
    if (isBrowser) {
      this.permissionsGranted = safeLocalStorage.getItem("usageAccessPermission", false)
    }
  }

  // Add the missing checkPermissions method
  async checkPermissions(): Promise<boolean> {
    return Promise.resolve(this.permissionsGranted)
  }

  // Add the missing requestPermissions method
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate permission request
      setTimeout(() => {
        this.permissionsGranted = true
        safeLocalStorage.setItem("usageAccessPermission", true)
        resolve(true)
      }, 1000)
    })
  }

  // Add the missing registerUpdateCallback method
  registerUpdateCallback(callback: (appId: number, timeUsed: number) => void): void {
    this.updateCallback = callback
  }

  // Add the missing startTracking method
  startTracking(): boolean {
    if (!isBrowser) return false
    if (this.isTracking) return true
    if (!this.permissionsGranted) return false

    console.log("Starting app usage tracking")
    this.isTracking = true
    return true
  }

  // Add the missing stopTracking method
  stopTracking(): void {
    if (!isBrowser) return
    this.isTracking = false
    console.log("Stopping app usage tracking")
  }

  // Add the missing getAppUsage method
  getAppUsage(appId: number): number {
    // Convert appId to app name for our simple implementation
    const appNames = Object.keys(this.usageData)
    const appName = appNames[appId % appNames.length] || "Unknown"
    return this.usageData[appName] || 0
  }

  getUsage(appName: string): number {
    return this.usageData[appName] || 0
  }

  getAllUsage(): Record<string, number> {
    return { ...this.usageData }
  }

  trackUsage(appName: string, minutes: number): void {
    this.usageData[appName] = (this.usageData[appName] || 0) + minutes
  }

  resetUsage(appName: string): void {
    this.usageData[appName] = 0
  }

  resetAllUsage(): void {
    Object.keys(this.usageData).forEach((key) => {
      this.usageData[key] = 0
    })
  }
}

// App Blocker Service
export class AppBlocker {
  private enabled = true
  private blockedApps: any[] = []
  private permissionsGranted = false

  constructor() {
    // Initialize with some sample data
    this.blockedApps = [
      {
        name: "Instagram",
        icon: "Instagram",
        color: "bg-pink-500",
        bgColor: "bg-pink-100",
        blockedUntil: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
      {
        name: "TikTok",
        icon: "TikTok",
        color: "bg-black",
        bgColor: "bg-gray-100",
        blockedUntil: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      },
    ]

    // Check if permissions were previously granted
    if (isBrowser) {
      this.permissionsGranted = safeLocalStorage.getItem("appBlockerPermission", false)
    }
  }

  // Add checkPermissions method
  checkPermissions(): Promise<boolean> {
    return Promise.resolve(this.permissionsGranted)
  }

  // Add requestPermissions method
  requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate permission request
      setTimeout(() => {
        this.permissionsGranted = true
        safeLocalStorage.setItem("appBlockerPermission", true)
        resolve(true)
      }, 1000)
    })
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  getBlockedApps(): any[] {
    return this.blockedApps
  }

  blockApp(app: any): void {
    if (!this.blockedApps.some((a) => a.name === app.name)) {
      this.blockedApps.push({
        ...app,
        blockedUntil: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      })
    }
  }

  unblockApp(appName: string): void {
    this.blockedApps = this.blockedApps.filter((app) => app.name !== appName)
  }

  isAppBlocked(appName: string): boolean {
    return this.blockedApps.some((app) => app.name === appName)
  }

  // Add startBlocking method
  startBlocking(apps: any[]): boolean {
    if (!isBrowser) return false

    // Filter apps that should be blocked
    const appsToBlock = apps.filter((app) => (app.enabled && app.usedTime >= app.limit) || !app.enabled)

    // Add apps to blocked list
    appsToBlock.forEach((app) => {
      this.blockApp(app)
    })

    return true
  }

  // Add stopBlocking method
  stopBlocking(): void {
    this.blockedApps = []
  }
}

// Notification Service
export class NotificationService {
  private enabled = true
  private permissionGranted = false

  constructor() {
    // Check if the browser supports notifications
    if (isBrowser && "Notification" in window) {
      this.permissionGranted = Notification.permission === "granted"
    }
  }

  // Add checkPermission method
  async checkPermission(): Promise<boolean> {
    if (!isBrowser || !("Notification" in window)) {
      return false
    }
    return Notification.permission === "granted"
  }

  // Add requestPermission method
  async requestPermission(): Promise<boolean> {
    if (!isBrowser || !("Notification" in window)) {
      return false
    }

    const permission = await Notification.requestPermission()
    this.permissionGranted = permission === "granted"
    return this.permissionGranted
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  // Add sendNotification method
  sendNotification(options: {
    title: string
    body: string
    icon?: string
    actions?: Array<{ action: string; title: string }>
  }): boolean {
    if (!isBrowser || !this.permissionGranted) {
      return false
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        actions: options.actions,
      })

      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        notification.close()
      }

      return true
    } catch (error) {
      console.error("Error sending notification:", error)
      return false
    }
  }

  showNotification(title: string, options: NotificationOptions = {}): void {
    if (!isBrowser || !this.enabled) return

    try {
      if (Notification && Notification.permission === "granted") {
        new Notification(title, options)
      }
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }
}

// Create service instances only in browser environment
let appBlockerInstance: AppBlocker | null = null
let appUsageTrackerInstance: AppUsageTracker | null = null
let notificationServiceInstance: NotificationService | null = null

if (isBrowser) {
  appBlockerInstance = new AppBlocker()
  appUsageTrackerInstance = new AppUsageTracker()
  notificationServiceInstance = new NotificationService()
}

// Export service instances
export const appBlocker = appBlockerInstance
export const appUsageTracker = appUsageTrackerInstance
export const notificationService = notificationServiceInstance

// Initialize services
export function initializeServices() {
  // Return the service instances (they'll be null on the server)
  return {
    appBlocker: appBlockerInstance,
    appUsageTracker: appUsageTrackerInstance,
    notificationService: notificationServiceInstance,
  }
}
