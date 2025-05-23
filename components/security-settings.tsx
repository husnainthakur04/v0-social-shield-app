"use client"

import { useState } from "react"
import { Lock, Fingerprint, Shield, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { PinLockScreen } from "@/components/pin-lock-screen"
import { useToast } from "@/components/ui/use-toast"

export function SecuritySettings() {
  const { security, updateSecuritySettings } = useAppStore()
  const { toast } = useToast()
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [showBiometricDialog, setShowBiometricDialog] = useState(false)

  const handleLockMethodChange = (method: "none" | "pin" | "biometric") => {
    if (method === "pin") {
      setShowPinSetup(true)
    } else if (method === "biometric") {
      setShowBiometricDialog(true)
    } else {
      updateSecuritySettings({ lockMethod: "none", appLockEnabled: false })
      toast({
        title: "App Lock Disabled",
        description: "Your app is no longer protected with a lock",
      })
    }
  }

  const handleLockAfterChange = (value: "immediate" | "1min" | "5min" | "15min" | "30min") => {
    updateSecuritySettings({ lockAfter: value })
    toast({
      title: "Lock Timing Updated",
      description: "Your lock timing preference has been saved",
    })
  }

  const handleRequireOnStartupChange = (checked: boolean) => {
    updateSecuritySettings({ requireOnStartup: checked })
  }

  const handlePinSetupComplete = () => {
    setShowPinSetup(false)
    toast({
      title: "PIN Setup Complete",
      description: "Your app is now protected with a PIN",
    })
  }

  const handleBiometricSetup = () => {
    // In a real app, this would integrate with the device's biometric API
    updateSecuritySettings({ lockMethod: "biometric", appLockEnabled: true })
    setShowBiometricDialog(false)
    toast({
      title: "Biometric Authentication Enabled",
      description: "Your app is now protected with biometric authentication",
    })
  }

  return (
    <>
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <Card>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-lg font-semibold">App Lock</h2>
                </div>
                <Switch
                  checked={security.appLockEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      if (security.lockMethod === "none") {
                        setShowPinSetup(true)
                      } else {
                        updateSecuritySettings({ appLockEnabled: true })
                      }
                    } else {
                      updateSecuritySettings({ appLockEnabled: false })
                    }
                  }}
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Protect your app data with a lock screen. Choose your preferred lock method below.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Lock Method</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={security.lockMethod === "none" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 p-2"
                      onClick={() => handleLockMethodChange("none")}
                    >
                      <Lock className="h-6 w-6 mb-1" />
                      <span className="text-xs">None</span>
                    </Button>
                    <Button
                      variant={security.lockMethod === "pin" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 p-2"
                      onClick={() => handleLockMethodChange("pin")}
                    >
                      <Lock className="h-6 w-6 mb-1" />
                      <span className="text-xs">PIN</span>
                    </Button>
                    <Button
                      variant={security.lockMethod === "biometric" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 p-2"
                      onClick={() => handleLockMethodChange("biometric")}
                    >
                      <Fingerprint className="h-6 w-6 mb-1" />
                      <span className="text-xs">Biometric</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <h3 className="font-medium">Auto-Lock After</h3>
              </div>
              <Select
                value={security.lockAfter}
                onValueChange={(value) =>
                  handleLockAfterChange(value as "immediate" | "1min" | "5min" | "15min" | "30min")
                }
                disabled={!security.appLockEnabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="1min">1 minute</SelectItem>
                  <SelectItem value="5min">5 minutes</SelectItem>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Require on Startup</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Always require authentication when app starts
                </p>
              </div>
              <Switch
                checked={security.requireOnStartup}
                onCheckedChange={handleRequireOnStartupChange}
                disabled={!security.appLockEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* PIN Setup Dialog */}
      {showPinSetup && <PinLockScreen mode="setup" onAuthenticated={handlePinSetupComplete} />}

      {/* Biometric Setup Dialog */}
      <Dialog open={showBiometricDialog} onOpenChange={setShowBiometricDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Biometric Authentication</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
              <Fingerprint className="h-8 w-8 text-teal-600 dark:text-teal-300" />
            </div>
            <p className="text-center mb-4">
              Use your fingerprint or face recognition to quickly and securely unlock Social Shield.
            </p>
            <Button onClick={handleBiometricSetup} className="w-full">
              Enable Biometric Authentication
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
