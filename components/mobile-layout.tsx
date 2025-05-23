"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, BarChart2, Settings, Award, ChevronLeft, Timer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

// Optimized Header component
export function Header({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const router = useRouter()

  return (
    <header className="safe-top fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2 h-9 w-9 rounded-full"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
      <div className="flex items-center space-x-1">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/settings")}
          className="h-9 w-9 rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    // Set page title and back button based on pathname
    if (pathname === "/") {
      setPageTitle("Dashboard")
      setShowBack(false)
    } else if (pathname === "/focus-mode") {
      setPageTitle("Focus Mode")
      setShowBack(true)
    } else if (pathname === "/rewards") {
      setPageTitle("Rewards")
      setShowBack(true)
    } else if (pathname === "/analytics") {
      setPageTitle("Analytics")
      setShowBack(true)
    } else if (pathname === "/settings") {
      setPageTitle("Settings")
      setShowBack(true)
    } else if (pathname === "/time-limits") {
      setPageTitle("Time Limits")
      setShowBack(true)
    } else if (pathname.startsWith("/onboarding")) {
      setPageTitle("Onboarding")
      setShowBack(false)
    } else {
      setPageTitle("Dashboard")
      setShowBack(true)
    }
  }, [pathname])

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Focus", icon: Timer, path: "/focus-mode" },
    { name: "Rewards", icon: Award, path: "/rewards" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
  ]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100%",
        backgroundColor: "var(--background)",
        overflow: "hidden",
      }}
    >
      <Header title={pageTitle} showBack={showBack} />

      {/* Main content with proper spacing */}
      <main className="flex-1 overflow-x-hidden px-4 pb-24 pt-16">{children}</main>

      {/* Fixed bottom navigation that sticks perfectly to the bottom */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "64px",
          backgroundColor: "var(--background)",
          borderTop: "1px solid var(--border)",
          zIndex: 9999,
          display: "flex",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.name}
              href={item.path}
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                textDecoration: "none",
              }}
            >
              <item.icon style={{ width: "24px", height: "24px", marginBottom: "4px" }} />
              <span style={{ fontSize: "12px", fontWeight: isActive ? 500 : 400 }}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
