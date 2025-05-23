"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Bell, Lock, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"
import { initializeServices, safeLocalStorage } from "@/lib/client-services"

type Permission = {
  id: string
  name: string
  description: string
  required: boolean
  granted: boolean
  icon: React.ReactNode
  requestFunction: () => Promise<boolean>
}

export function Onboarding() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "usage_access",
      name: "Usage Access",
      description: "Track how much time you spend on social media apps",
      required: true,
      granted: false,
      icon: <Shield className="h-5 w-5 text-teal-600" />,
      requestFunction: async () => false, // Will be initialized later
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Send alerts when you're approaching your time limits",
      required: true,
      granted: false,
      icon: <Bell className="h-5 w-5 text-teal-600" />,
      requestFunction: async () => false, // Will be initialized later
    },
    {
      id: "app_blocking",
      name: "App Blocking",
      description: "Block apps when you've reached your time limits",
      required: true,
      granted: false,
      icon: <Lock className="h-5 w-5 text-teal-600" />,
      requestFunction: async () => false, // Will be initialized later
    },
  ])

  // Initialize services
  useEffect(() => {
    const initialize = async () => {
      try {
        const services = initializeServices()

        // Update permission request functions
        setPermissions((prev) =>
          prev.map((permission) => {
            if (permission.id === "usage_access") {
              return {
                ...permission,
                requestFunction: () => services.appUsageTracker.requestPermissions(),
              }
            } else if (permission.id === "notifications") {
              return {
                ...permission,
                requestFunction: () => services.notificationService.requestPermission(),
              }
            } else if (permission.id === "app_blocking") {
              return {
                ...permission,
                requestFunction: () => services.appBlocker.requestPermissions(),
              }
            }
            return permission
          }),
        )

        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize services:", error)
      }
    }

    initialize()
  }, [])

  // Check if this is the first launch
  useEffect(() => {
    if (!isInitialized) return

    const checkFirstLaunch = () => {
      const hasLaunched = safeLocalStorage.getItem("hasLaunchedBefore")
      if (hasLaunched === "true") {
        // Not first launch, skip onboarding
        setOnboardingComplete(true)
        router.push("/")
      } else {
        // First launch, show onboarding
        safeLocalStorage.setItem("hasLaunchedBefore", "true")
      }
    }

    checkFirstLaunch()
  }, [router, isInitialized])

  // Check initial permission status
  useEffect(() => {
    if (!isInitialized) return

    const checkAllPermissions = async () => {
      try {
        const services = initializeServices()
        const updatedPermissions = [...permissions]

        for (let i = 0; i < permissions.length; i++) {
          let status = false

          if (permissions[i].id === "usage_access") {
            status = await services.appUsageTracker.checkPermissions()
          } else if (permissions[i].id === "notifications") {
            status = await services.notificationService.checkPermission()
          } else if (permissions[i].id === "app_blocking") {
            status = await services.appBlocker.checkPermissions()
          }

          updatedPermissions[i] = { ...updatedPermissions[i], granted: status }
        }

        setPermissions(updatedPermissions)
      } catch (error) {
        console.error("Error checking permissions:", error)
      }
    }

    checkAllPermissions()
  }, [permissions, isInitialized])

  const handleNextStep = async () => {
    if (!isInitialized) return

    const currentPermission = permissions[currentStep]

    if (!currentPermission.granted) {
      try {
        const granted = await currentPermission.requestFunction()
        if (granted) {
          setPermissions((prev) => prev.map((p) => (p.id === currentPermission.id ? { ...p, granted: true } : p)))
        } else if (currentPermission.required) {
          toast({
            title: "Permission Required",
            description: "This permission is required for the app to function properly.",
            variant: "destructive",
          })
          return // Don't proceed if a required permission is denied
        }
      } catch (error) {
        console.error(`Error requesting permission ${currentPermission.id}:`, error)
        toast({
          title: "Error",
          description: "There was an error requesting the permission.",
          variant: "destructive",
        })
      }
    }

    if (currentStep < permissions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All permissions have been handled
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    try {
      safeLocalStorage.setItem("onboardingComplete", true)
      setOnboardingComplete(true)
      router.push("/")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  const skipPermissions = () => {
    toast({
      title: "Permissions skipped",
      description: "You can grant permissions later in Settings.",
    })
    completeOnboarding()
  }

  if (onboardingComplete) {
    return null // Don't render anything if onboarding is complete
  }

  // If not initialized yet, show a loading placeholder
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-teal-200 mb-4"></div>
          <div className="h-4 w-32 mx-auto bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 mx-auto bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const currentPermission = permissions[currentStep]
  const steps = [
    { id: "welcome", title: "Welcome to Social Shield" },
    ...permissions.map((p) => ({ id: p.id, title: p.name })),
    { id: "complete", title: "You're all set!" },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
      <AnimatedSection animation="scale" duration={0.5} className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Shield className="mr-2 h-6 w-6 text-teal-600" />
              Social Shield Setup
            </CardTitle>
            <CardDescription>
              {currentStep === 0
                ? "Let's set up your digital wellbeing assistant"
                : "We need a few permissions to help you manage your screen time"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 ? (
              <div className="text-center space-y-4">
                <div className="bg-teal-50 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Shield className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-medium">Welcome to Social Shield</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your personal digital wellbeing assistant that helps you manage your screen time and build healthier
                  digital habits.
                </p>
              </div>
            ) : currentStep <= permissions.length ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">{currentPermission.icon}</div>
                  <div>
                    <h3 className="font-medium flex items-center">
                      {currentPermission.name}
                      {currentPermission.granted && <Check className="ml-2 h-4 w-4 text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currentPermission.description}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Step {currentStep} of {steps.length - 1}
                  </span>
                  <span>
                    {permissions.filter((p) => p.granted).length} of {permissions.length} granted
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium">You're all set!</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Social Shield is now ready to help you build healthier digital habits.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 0 && currentStep <= permissions.length ? (
              <Button variant="outline" onClick={skipPermissions}>
                Skip for now
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with justify-between
            )}
            <Button onClick={handleNextStep}>
              {currentStep < steps.length - 1 ? (
                <>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  )
}
