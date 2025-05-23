import { DashboardWrapper } from "@/components/dashboard-wrapper"
import { MobileLayout } from "@/components/mobile-layout"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <DashboardWrapper />
      </MobileLayout>
    </div>
  )
}
