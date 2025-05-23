"use client"

import { useEffect, useState } from "react"
import { useScrollPosition } from "@/hooks/use-scroll-position"

export function ScrollProgress() {
  const [mounted, setMounted] = useState(false)
  const scrollPosition = useScrollPosition()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div
        className="h-full bg-teal-500 dark:bg-teal-400 transition-all duration-150 ease-out"
        style={{ width: `${scrollPosition}%` }}
      />
    </div>
  )
}
