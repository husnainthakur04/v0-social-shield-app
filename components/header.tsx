"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
