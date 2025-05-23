"use client"

import { useState, useEffect } from "react"
import { Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

interface PinLockScreenProps {
  onAuthenticated?: () => void
  mode?: "verify" | "setup"
}

export function PinLockScreen({ onAuthenticated, mode = "verify" }: PinLockScreenProps) {
  const { security, updateSecuritySettings, setAuthenticated } = useAppStore()
  const { toast } = useToast()
  const [pin, setPin] = useState<string[]>([])
  const [confirmPin, setConfirmPin] = useState<string[]>([])
  const [step, setStep] = useState<"enter" | "confirm">(mode === "setup" ? "enter" : "confirm")
  const [error, setError] = useState("")

  // Clear error when pin changes
  useEffect(() => {
    setError("")
  }, [pin])

  const handleNumberPress = (num: number) => {
    if (step === "enter" && pin.length < 4) {
      setPin([...pin, num.toString()])
    } else if (step === "confirm" && confirmPin.length < 4) {
      setConfirmPin([...confirmPin, num.toString()])
    }
  }

  const handleDelete = () => {
    if (step === "enter" && pin.length > 0) {
      setPin(pin.slice(0, -1))
    } else if (step === "confirm" && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1))
    }
  }

  const handleContinue = () => {
    if (step === "enter" && pin.length === 4) {
      if (mode === "setup") {
        setStep("confirm")
      } else {
        // Verify PIN
        if (pin.join("") === security.pinCode) {
          setAuthenticated(true)
          toast({
            title: "Authenticated",
            description: "Welcome back to Social Shield",
          })
          if (onAuthenticated) {
            onAuthenticated()
          }
        } else {
          setError("Incorrect PIN. Please try again.")
          setPin([])
        }
      }
    } else if (step === "confirm" && confirmPin.length === 4) {
      if (mode === "setup") {
        // Setup new PIN
        if (pin.join("") === confirmPin.join("")) {
          updateSecuritySettings({
            pinCode: pin.join(""),
            appLockEnabled: true,
            lockMethod: "pin",
          })
          setAuthenticated(true)
          toast({
            title: "PIN Setup Complete",
            description: "Your app is now protected with a PIN",
          })
          if (onAuthenticated) {
            onAuthenticated()
          }
        } else {
          setError("PINs don't match. Please try again.")
          setPin([])
          setConfirmPin([])
          setStep("enter")
        }
      }
    }
  }

  // Check if we should proceed to the next step
  useEffect(() => {
    if (step === "enter" && pin.length === 4) {
      if (mode === "setup") {
        setStep("confirm")
      }
    }
  }, [pin, step, mode])

  // Check if PIN is verified
  useEffect(() => {
    if (step === "confirm" && confirmPin.length === 4) {
      if (mode === "setup") {
        // Check if PINs match
        if (pin.join("") === confirmPin.join("")) {
          handleContinue()
        } else {
          setError("PINs don't match. Please try again.")
          setPin([])
          setConfirmPin([])
          setStep("enter")
        }
      } else {
        handleContinue()
      }
    }
  }, [confirmPin, mode, pin, step])

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <Shield className="h-8 w-8 text-teal-600 dark:text-teal-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "setup" ? (step === "enter" ? "Create PIN" : "Confirm PIN") : "Enter PIN"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {mode === "setup"
              ? step === "enter"
                ? "Create a 4-digit PIN to secure your app"
                : "Re-enter your PIN to confirm"
              : "Enter your PIN to unlock Social Shield"}
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex space-x-4">
          {[0, 1, 2, 3].map((i) => {
            const currentPin = step === "enter" ? pin : confirmPin
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  i < currentPin.length
                    ? "border-teal-500 bg-teal-100 dark:bg-teal-900 dark:border-teal-400"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                {i < currentPin.length && <div className="w-4 h-4 rounded-full bg-teal-500 dark:bg-teal-400"></div>}
              </div>
            )
          })}
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="w-16 h-16 text-2xl rounded-full"
              onClick={() => handleNumberPress(num)}
            >
              {num}
            </Button>
          ))}
          <Button variant="ghost" className="w-16 h-16 text-2xl rounded-full" disabled>
            {/* Empty button for layout */}
          </Button>
          <Button variant="outline" className="w-16 h-16 text-2xl rounded-full" onClick={() => handleNumberPress(0)}>
            0
          </Button>
          <Button
            variant="ghost"
            className="w-16 h-16 rounded-full flex items-center justify-center"
            onClick={handleDelete}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Continue button - only show when PIN is complete */}
        {((step === "enter" && pin.length === 4) || (step === "confirm" && confirmPin.length === 4)) && (
          <Button className="w-full mt-4" onClick={handleContinue}>
            {mode === "setup" ? (step === "enter" ? "Continue" : "Set PIN") : "Unlock"}
          </Button>
        )}
      </div>
    </div>
  )
}
