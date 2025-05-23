"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollPosition } from "@/hooks/use-scroll-position"

export function ScrollToTop() {
  const [mounted, setMounted] = useState(false)
  const scrollPosition = useScrollPosition()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (scrollPosition > 20) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [scrollPosition])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className={`fixed bottom-20 right-4 z-50 rounded-full shadow-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}
