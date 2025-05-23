import { MobileLayout } from "@/components/mobile-layout"
import { SettingsWrapper } from "@/components/settings-wrapper"

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <SettingsWrapper />
      </MobileLayout>
    </div>
  )
}
