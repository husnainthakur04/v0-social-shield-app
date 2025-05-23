import { MobileLayout } from "@/components/mobile-layout"
import { DigitalDetox } from "@/components/digital-detox"

export default function DetoxPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-950">
      <MobileLayout>
        <DigitalDetox />
      </MobileLayout>
    </div>
  )
}
