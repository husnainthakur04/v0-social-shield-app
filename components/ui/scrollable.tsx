import type React from "react"
import { cn } from "@/lib/utils"

interface ScrollableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxHeight?: string
  hideScrollbar?: boolean
}

export function Scrollable({
  children,
  className,
  maxHeight = "auto",
  hideScrollbar = false,
  ...props
}: ScrollableProps) {
  return (
    <div
      className={cn(
        "overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch",
        hideScrollbar && "scrollbar-hide",
        className,
      )}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </div>
  )
}
