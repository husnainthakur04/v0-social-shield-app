"use client"

// Safe browser-only implementation
class NotificationService {
  private isClient: boolean

  constructor() {
    this.isClient = typeof window !== "undefined"
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isClient) return false

    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications")
        return false
      }

      const permission = await Notification.requestPermission()
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  async checkPermission(): Promise<boolean> {
    if (!this.isClient) return false

    try {
      if (!("Notification" in window)) {
        return false
      }
      return Notification.permission === "granted"
    } catch (error) {
      return false
    }
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isClient) return

    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications")
        return
      }

      if (Notification.permission === "granted") {
        new Notification(title, options)
      }
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }
}

// Create a singleton instance
export const notificationService = new NotificationService()
