import { MobileLayout } from "@/components/mobile-layout"
import FocusModeClient from "@/components/focus-mode-client"

export default function FocusModePage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <FocusModeClient />
      </MobileLayout>
    </div>
  )
}
