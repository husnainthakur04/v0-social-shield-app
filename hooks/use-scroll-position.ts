"use client"

import { useState, useEffect } from "react"

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      if (typeof window === "undefined") return

      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const position = window.scrollY
      const scrolled = (position / height) * 100
      setScrollPosition(scrolled)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", updatePosition)
      updatePosition()
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", updatePosition)
      }
    }
  }, [])

  return scrollPosition
}
