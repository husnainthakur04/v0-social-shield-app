"use client"

import { create } from "zustand"
import { safeLocalStorage } from "./client-services"

interface RealTimeState {
  isTracking: boolean
  permissionsGranted: boolean
  blockedApps: number[]
  startTracking: () => void
  stopTracking: () => void
  setPermissionsGranted: (granted: boolean) => void
  blockApp: (appId: number) => void
  unblockApp: (appId: number) => void
  isAppBlocked: (appId: number) => boolean
}

export const useRealTimeStore = create<RealTimeState>((set, get) => ({
  isTracking: false,
  permissionsGranted: safeLocalStorage.getItem("usageAccessPermission", false),
  blockedApps: [],

  startTracking: () => {
    console.log("Starting real-time tracking")
    set({ isTracking: true })
  },

  stopTracking: () => {
    console.log("Stopping real-time tracking")
    set({ isTracking: false })
  },

  setPermissionsGranted: (granted: boolean) => {
    set({ permissionsGranted: granted })
    safeLocalStorage.setItem("usageAccessPermission", granted)
  },

  blockApp: (appId: number) => {
    const { blockedApps } = get()
    if (!blockedApps.includes(appId)) {
      set({ blockedApps: [...blockedApps, appId] })
    }
  },

  unblockApp: (appId: number) => {
    const { blockedApps } = get()
    set({ blockedApps: blockedApps.filter((id) => id !== appId) })
  },

  isAppBlocked: (appId: number) => {
    return get().blockedApps.includes(appId)
  },
}))
