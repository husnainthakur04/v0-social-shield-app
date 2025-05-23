"use client"

import { useEffect, useState, useCallback } from "react"

// Custom hook for handling window resize events
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

// Custom hook for handling interval timers with cleanup
export function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(callback, delay)
    return () => clearInterval(id)
  }, [callback, delay])
}

// Custom hook for handling document visibility changes
export function useDocumentVisibility(callback: (isVisible: boolean) => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      callback(document.visibilityState === "visible")
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [callback])
}

// Custom hook for handling app focus/blur events
export function useAppFocus() {
  const [isAppFocused, setIsAppFocused] = useState(true)

  const handleFocus = useCallback(() => {
    setIsAppFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsAppFocused(false)
  }, [])

  useEffect(() => {
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [handleFocus, handleBlur])

  return isAppFocused
}
