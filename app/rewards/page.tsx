import { MobileLayout } from "@/components/mobile-layout"
import { RewardsWrapper } from "@/components/rewards-wrapper"

export default function RewardsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <RewardsWrapper />
      </MobileLayout>
    </div>
  )
}
