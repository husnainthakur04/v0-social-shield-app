import { MobileLayout } from "@/components/mobile-layout"
import { AnalyticsWrapper } from "@/components/analytics-wrapper"

export default function AnalyticsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <AnalyticsWrapper />
      </MobileLayout>
    </div>
  )
}
