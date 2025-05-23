import type React from "react"
import { cn } from "@/lib/utils"

interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ContentContainer({ children, className, ...props }: ContentContainerProps) {
  return (
    <div className={cn("w-full max-w-full overflow-x-hidden px-4", className)} {...props}>
      {children}
    </div>
  )
}
