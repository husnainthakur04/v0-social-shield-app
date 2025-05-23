"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  SettingsIcon,
  Bell,
  Lock,
  User,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Download,
  ShieldAlert,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NotificationSettings } from "@/components/notification-settings"
import { LanguageSettings } from "@/components/language-settings"
import { SecuritySettings } from "@/components/security-settings"
import { BackupRestore } from "@/components/backup-restore"
import { SupportAccount } from "@/components/support-account"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"
import { appUsageTracker } from "@/services/app-usage-tracker"
import { notificationService } from "@/services/notification-service"
import { appBlocker } from "@/services/app-blocker"
import { useRealTimeStore } from "@/lib/real-time-store"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)

  // User profile state
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  // Form state for profile editing
  const [editedProfile, setEditedProfile] = useState({ ...profile })

  // Emergency unlock state
  const [unlocks, setUnlocks] = useState(3)

  const { permissionsGranted, setPermissionsGranted } = useRealTimeStore()
  const [permissionsStatus, setPermissionsStatus] = useState({
    usageAccess: false,
    notifications: false,
    appBlocking: false,
  })

  // Check permissions on component mount
  useEffect(() => {
    const checkAllPermissions = async () => {
      try {
        const usageAccess = await appUsageTracker.checkPermissions()
        const notifications = await notificationService.checkPermission()
        const appBlocking = await appBlocker.checkPermissions()

        setPermissionsStatus({
          usageAccess,
          notifications,
          appBlocking,
        })

        setPermissionsGranted(usageAccess)
      } catch (error) {
        console.error("Error checking permissions:", error)
      }
    }

    checkAllPermissions()
  }, [setPermissionsGranted])

  const requestPermission = async (type: "usageAccess" | "notifications" | "appBlocking") => {
    let granted = false

    try {
      switch (type) {
        case "usageAccess":
          granted = await appUsageTracker.requestPermissions()
          if (granted) {
            setPermissionsStatus((prev) => ({ ...prev, usageAccess: true }))
            setPermissionsGranted(true)
          }
          break
        case "notifications":
          granted = await notificationService.requestPermission()
          if (granted) {
            setPermissionsStatus((prev) => ({ ...prev, notifications: true }))
          }
          break
        case "appBlocking":
          granted = await appBlocker.requestPermissions()
          if (granted) {
            setPermissionsStatus((prev) => ({ ...prev, appBlocking: true }))
          }
          break
      }
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error)
    }

    return granted
  }

  const handleProfileSave = () => {
    setProfile({ ...editedProfile })
    setShowProfileEdit(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleEmergencyUnlock = () => {
    if (unlocks > 0) {
      setUnlocks(unlocks - 1)
      setShowEmergencyDialog(false)
      toast({
        title: "Emergency Unlock Used",
        description: `All restrictions temporarily lifted. ${unlocks - 1} unlocks remaining today.`,
        variant: "default",
      })
    } else {
      toast({
        title: "No Unlocks Remaining",
        description: "You've used all your emergency unlocks for today.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <SettingsIcon className="mr-2 text-teal-600 dark:text-white" />
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your Social Shield experience</p>
        </div>
      </AnimatedSection>

      {/* Profile */}
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-teal-600 dark:text-white" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{profile.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowProfileEdit(true)}>
            Edit
          </Button>
        </div>
      </AnimatedSection>

      {/* Emergency Unlock */}
      <AnimatedSection animation="slide-up" delay={0.15} duration={0.6}>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldAlert className="h-5 w-5 mr-3 text-amber-500" />
                <div>
                  <h3 className="font-medium text-amber-700 dark:text-amber-400">Emergency Unlock</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{unlocks} unlocks remaining today</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-amber-500 text-amber-700 dark:text-amber-400"
                onClick={() => setShowEmergencyDialog(true)}
                disabled={unlocks <= 0}
              >
                Use Unlock
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Settings Tabs */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="backup">
              <Download className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Backup</span>
            </TabsTrigger>
            <TabsTrigger value="support">
              <HelpCircle className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Theme Toggle */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle light/dark theme</p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light")
                    toast({
                      title: `${checked ? "Dark" : "Light"} Mode Enabled`,
                      description: `Theme has been changed to ${checked ? "dark" : "light"} mode.`,
                    })
                  }}
                />
              </div>
            </div>

            {/* Language Settings */}
            <LanguageSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <BackupRestore />
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SupportAccount />
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      {/* Sign Out Button */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
        <Button
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 justify-start"
          onClick={() => {
            toast({
              title: "Signed Out",
              description: "You have been signed out of your account.",
            })
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </AnimatedSection>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Social Shield v1.0.0</p>
        <p>© 2025 Social Shield. All rights reserved.</p>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="h-20 w-20 rounded-full bg-teal-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
                {editedProfile.avatar ? (
                  <img
                    src={editedProfile.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-teal-600 dark:text-white" />
                )}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Unlock Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-600 dark:text-amber-400">Use Emergency Unlock</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Are you sure you want to use an emergency unlock? This will temporarily disable all app restrictions for
              30 minutes.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You have {unlocks} unlocks remaining today.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleEmergencyUnlock}
            >
              Confirm Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 mt-6">
        <div>
          <h3 className="text-lg font-medium">App Permissions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            These permissions are required for Social Shield to function properly
          </p>

          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Usage Access</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Required to track app usage time</p>
                  </div>
                  <Button
                    variant={permissionsStatus.usageAccess ? "outline" : "default"}
                    size="sm"
                    onClick={() => requestPermission("usageAccess")}
                    disabled={permissionsStatus.usageAccess}
                  >
                    {permissionsStatus.usageAccess ? "Granted" : "Grant"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Required for time limit alerts</p>
                  </div>
                  <Button
                    variant={permissionsStatus.notifications ? "outline" : "default"}
                    size="sm"
                    onClick={() => requestPermission("notifications")}
                    disabled={permissionsStatus.notifications}
                  >
                    {permissionsStatus.notifications ? "Granted" : "Grant"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">App Blocking</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Required to block apps that exceed limits
                    </p>
                  </div>
                  <Button
                    variant={permissionsStatus.appBlocking ? "outline" : "default"}
                    size="sm"
                    onClick={() => requestPermission("appBlocking")}
                    disabled={permissionsStatus.appBlocking}
                  >
                    {permissionsStatus.appBlocking ? "Granted" : "Grant"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
