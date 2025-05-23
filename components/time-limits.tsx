"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Clock,
  Plus,
  Search,
  Trash2,
  Edit2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Settings,
  List,
  LayoutGrid,
  Upload,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedList } from "@/components/ui/animated-list"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { AppBlocker } from "@/components/app-blocker"
import { getAppIcon } from "@/lib/utils"

// Define app categories
const APP_CATEGORIES = [
  { id: "social", name: "Social Media" },
  { id: "entertainment", name: "Entertainment" },
  { id: "productivity", name: "Productivity" },
  { id: "games", name: "Games" },
  { id: "shopping", name: "Shopping" },
  { id: "other", name: "Other" },
]

// Define popular apps by category
const POPULAR_APPS = {
  social: [
    { name: "WhatsApp", icon: "WhatsApp", color: "bg-green-500", bgColor: "bg-green-100" },
    { name: "Snapchat", icon: "Snapchat", color: "bg-yellow-500", bgColor: "bg-yellow-100" },
    { name: "Pinterest", icon: "Pinterest", color: "bg-red-500", bgColor: "bg-red-100" },
    { name: "Discord", icon: "Discord", color: "bg-indigo-500", bgColor: "bg-indigo-100" },
    { name: "Telegram", icon: "Telegram", color: "bg-blue-500", bgColor: "bg-blue-100" },
  ],
  entertainment: [
    { name: "Netflix", icon: "Netflix", color: "bg-red-600", bgColor: "bg-red-100" },
    { name: "Disney+", icon: "Disney", color: "bg-blue-700", bgColor: "bg-blue-100" },
    { name: "Spotify", icon: "Spotify", color: "bg-green-600", bgColor: "bg-green-100" },
    { name: "TikTok", icon: "TikTok", color: "bg-black", bgColor: "bg-gray-100" },
    { name: "Twitch", icon: "Twitch", color: "bg-purple-600", bgColor: "bg-purple-100" },
  ],
  productivity: [
    { name: "Gmail", icon: "Gmail", color: "bg-red-500", bgColor: "bg-red-100" },
    { name: "Slack", icon: "Slack", color: "bg-purple-500", bgColor: "bg-purple-100" },
    { name: "Zoom", icon: "Zoom", color: "bg-blue-500", bgColor: "bg-blue-100" },
    { name: "Notion", icon: "Notion", color: "bg-gray-800", bgColor: "bg-gray-100" },
    { name: "Trello", icon: "Trello", color: "bg-blue-400", bgColor: "bg-blue-100" },
  ],
  games: [
    { name: "Candy Crush", icon: "Candy Crush", color: "bg-pink-500", bgColor: "bg-pink-100" },
    { name: "Minecraft", icon: "Minecraft", color: "bg-green-700", bgColor: "bg-green-100" },
    { name: "Roblox", icon: "Roblox", color: "bg-red-500", bgColor: "bg-red-100" },
    { name: "Fortnite", icon: "Fortnite", color: "bg-blue-500", bgColor: "bg-blue-100" },
    { name: "Among Us", icon: "Among Us", color: "bg-purple-500", bgColor: "bg-purple-100" },
  ],
  shopping: [
    { name: "Amazon", icon: "Amazon", color: "bg-orange-500", bgColor: "bg-orange-100" },
    { name: "eBay", icon: "eBay", color: "bg-red-500", bgColor: "bg-red-100" },
    { name: "Etsy", icon: "Etsy", color: "bg-orange-600", bgColor: "bg-orange-100" },
    { name: "Shopify", icon: "Shopify", color: "bg-green-600", bgColor: "bg-green-100" },
    { name: "Walmart", icon: "Walmart", color: "bg-blue-600", bgColor: "bg-blue-100" },
  ],
  other: [
    { name: "Chrome", icon: "Chrome", color: "bg-blue-500", bgColor: "bg-blue-100" },
    { name: "Safari", icon: "Safari", color: "bg-blue-400", bgColor: "bg-blue-100" },
    { name: "Maps", icon: "Maps", color: "bg-green-600", bgColor: "bg-green-100" },
    { name: "Weather", icon: "Weather", color: "bg-sky-500", bgColor: "bg-sky-100" },
    { name: "Calendar", icon: "Calendar", color: "bg-red-500", bgColor: "bg-red-100" },
  ],
}

export function TimeLimits() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [showAddAppDialog, setShowAddAppDialog] = useState(false)
  const [showEditAppDialog, setShowEditAppDialog] = useState(false)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [showCustomAppDialog, setShowCustomAppDialog] = useState(false)
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("social")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "usage" | "limit">("usage")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [customAppName, setCustomAppName] = useState("")
  const [customAppIcon, setCustomAppIcon] = useState("Smartphone")
  const [customAppColor, setCustomAppColor] = useState("#10b981")
  const [customAppLimit, setCustomAppLimit] = useState(30)
  const [editAppName, setEditAppName] = useState("")
  const [editAppLimit, setEditAppLimit] = useState(30)
  const [editAppColor, setEditAppColor] = useState("")
  const [editAppEnabled, setEditAppEnabled] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [bulkAction, setBulkAction] = useState<"enable" | "disable" | "delete" | "">("")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const [apps, setApps] = useState([
    {
      id: 1,
      name: "Instagram",
      icon: "Instagram",
      limit: 45,
      usedTime: 25,
      enabled: true,
      color: "bg-pink-500",
      bgColor: "bg-pink-100",
      category: "social",
      lastUsed: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Facebook",
      icon: "Facebook",
      limit: 30,
      usedTime: 15,
      enabled: true,
      color: "bg-blue-600",
      bgColor: "bg-blue-100",
      category: "social",
      lastUsed: new Date().toISOString(),
    },
    {
      id: 3,
      name: "YouTube",
      icon: "Youtube",
      limit: 60,
      usedTime: 40,
      enabled: true,
      color: "bg-red-600",
      bgColor: "bg-red-100",
      category: "entertainment",
      lastUsed: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Twitter",
      icon: "Twitter",
      limit: 20,
      usedTime: 10,
      enabled: true,
      color: "bg-sky-500",
      bgColor: "bg-sky-100",
      category: "social",
      lastUsed: new Date().toISOString(),
    },
    {
      id: 5,
      name: "TikTok",
      icon: "TikTok",
      limit: 30,
      usedTime: 20,
      enabled: false,
      color: "bg-black",
      bgColor: "bg-gray-100",
      category: "entertainment",
      lastUsed: new Date().toISOString(),
    },
    {
      id: 6,
      name: "LinkedIn",
      icon: "Linkedin",
      limit: 15,
      usedTime: 5,
      enabled: false,
      color: "bg-blue-800",
      bgColor: "bg-blue-50",
      category: "social",
      lastUsed: new Date().toISOString(),
    },
  ])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort apps
  const filteredApps = apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "usage") {
      return sortOrder === "asc" ? a.usedTime - b.usedTime : b.usedTime - a.usedTime
    } else {
      return sortOrder === "asc" ? a.limit - b.limit : b.limit - a.limit
    }
  })

  // Update app limit
  const updateLimit = (id: number, newLimit: number) => {
    setApps(apps.map((app) => (app.id === id ? { ...app, limit: newLimit } : app)))
  }

  // Toggle app enabled state
  const toggleApp = (id: number) => {
    setApps(
      apps.map((app) => {
        if (app.id === id) {
          const newState = !app.enabled
          toast({
            title: `${app.name} ${newState ? "Enabled" : "Disabled"}`,
            description: newState
              ? `Time limits for ${app.name} are now active.`
              : `Time limits for ${app.name} are now disabled.`,
          })
          return { ...app, enabled: newState }
        }
        return app
      }),
    )
  }

  // Add new app
  const addNewApp = (app: any) => {
    const newId = Math.max(...apps.map((a) => a.id), 0) + 1
    const newApp = {
      id: newId,
      name: app.name,
      icon: app.icon || "Smartphone",
      limit: app.limit || 30,
      usedTime: 0,
      enabled: true,
      color: app.color || "bg-teal-500",
      bgColor: app.bgColor || "bg-teal-100",
      category: app.category || "other",
      lastUsed: new Date().toISOString(),
    }

    setApps([...apps, newApp])

    toast({
      title: "App Added",
      description: `${app.name} has been added with a ${app.limit} minute daily limit.`,
    })

    setShowAddAppDialog(false)
    setShowCustomAppDialog(false)
  }

  // Edit app
  const editApp = () => {
    if (!selectedApp) return

    setApps(
      apps.map((app) =>
        app.id === selectedApp.id
          ? {
              ...app,
              name: editAppName,
              limit: editAppLimit,
              color: editAppColor,
              enabled: editAppEnabled,
            }
          : app,
      ),
    )

    toast({
      title: "App Updated",
      description: `${editAppName} settings have been updated.`,
    })

    setShowEditAppDialog(false)
  }

  // Delete app
  const deleteApp = () => {
    if (!selectedApp) return

    setApps(apps.filter((app) => app.id !== selectedApp.id))

    toast({
      title: "App Removed",
      description: `${selectedApp.name} has been removed from your time limits.`,
    })

    setShowDeleteConfirmDialog(false)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedApps.length === 0) return

    if (bulkAction === "delete") {
      setApps(apps.filter((app) => !selectedApps.includes(app.id)))
      toast({
        title: "Apps Removed",
        description: `${selectedApps.length} apps have been removed from your time limits.`,
      })
    } else if (bulkAction === "enable" || bulkAction === "disable") {
      setApps(apps.map((app) => (selectedApps.includes(app.id) ? { ...app, enabled: bulkAction === "enable" } : app)))
      toast({
        title: `Apps ${bulkAction === "enable" ? "Enabled" : "Disabled"}`,
        description: `${selectedApps.length} apps have been ${bulkAction === "enable" ? "enabled" : "disabled"}.`,
      })
    }

    setSelectedApps([])
    setBulkAction("")
  }

  // Toggle app selection for bulk actions
  const toggleAppSelection = (id: number) => {
    setSelectedApps(selectedApps.includes(id) ? selectedApps.filter((appId) => appId !== id) : [...selectedApps, id])
  }

  // Select/deselect all apps
  const toggleSelectAll = () => {
    if (selectedApps.length === filteredApps.length) {
      setSelectedApps([])
    } else {
      setSelectedApps(filteredApps.map((app) => app.id))
    }
  }

  // Handle file upload for custom app icon
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll just simulate it
      toast({
        title: "Icon Uploaded",
        description: "Your custom app icon has been uploaded.",
      })
    }
  }

  // Import apps from device
  const importAppsFromDevice = () => {
    // In a real app, this would scan the device for installed apps
    // For now, we'll just simulate it with a delay
    toast({
      title: "Scanning Device",
      description: "Looking for apps on your device...",
    })

    setTimeout(() => {
      const newApps = [
        {
          name: "WhatsApp",
          icon: "WhatsApp",
          color: "bg-green-500",
          bgColor: "bg-green-100",
          limit: 30,
          category: "social",
        },
        {
          name: "Spotify",
          icon: "Spotify",
          color: "bg-green-600",
          bgColor: "bg-green-100",
          limit: 45,
          category: "entertainment",
        },
        {
          name: "Gmail",
          icon: "Gmail",
          color: "bg-red-500",
          bgColor: "bg-red-100",
          limit: 20,
          category: "productivity",
        },
      ]

      newApps.forEach((app) => addNewApp(app))

      setShowBulkImportDialog(false)
    }, 2000)
  }

  // Open edit dialog
  const openEditDialog = (app: any) => {
    setSelectedApp(app)
    setEditAppName(app.name)
    setEditAppLimit(app.limit)
    setEditAppColor(app.color)
    setEditAppEnabled(app.enabled)
    setShowEditAppDialog(true)
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (app: any) => {
    setSelectedApp(app)
    setShowDeleteConfirmDialog(true)
  }

  // Render app icon
  const renderAppIcon = (iconName: string, className = "h-5 w-5") => {
    const IconComponent = getAppIcon(iconName)
    return <IconComponent className={className} />
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <AnimatedSection animation="fade" duration={0.6}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 text-teal-600 dark:text-white" />
              Time Limits
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set daily usage limits for each app</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
            {showAdvancedSettings ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </AnimatedSection>

      {/* Advanced Settings Panel */}
      {showAdvancedSettings && (
        <AnimatedSection animation="slide-up" delay={0.1} duration={0.4}>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Advanced Settings</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">App Name</SelectItem>
                      <SelectItem value="usage">Usage Time</SelectItem>
                      <SelectItem value="limit">Time Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                    <SelectTrigger id="sort-order">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedApps.length > 0 && selectedApps.length === filteredApps.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    {selectedApps.length > 0
                      ? `${selectedApps.length} app${selectedApps.length > 1 ? "s" : ""} selected`
                      : "Select all"}
                  </Label>
                </div>

                {selectedApps.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Select value={bulkAction} onValueChange={(value: any) => setBulkAction(value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Bulk actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enable">Enable</SelectItem>
                        <SelectItem value="disable">Disable</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" disabled={!bulkAction} onClick={handleBulkAction}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Search and Filter */}
      <AnimatedSection animation="slide-up" delay={0.15} duration={0.6}>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="default" onClick={() => setShowAddAppDialog(true)} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add App
          </Button>
        </div>
      </AnimatedSection>

      {/* App Blocker */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <AppBlocker />
      </AnimatedSection>

      {/* App Limits */}
      <AnimatedSection animation="slide-up" delay={0.2} duration={0.6}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-6 w-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : sortedApps.length > 0 ? (
            viewMode === "list" ? (
              <AnimatedList staggerDelay={0.05}>
                {sortedApps.map((app) => (
                  <Card
                    key={app.id}
                    className={cn(
                      app.enabled ? "" : "opacity-60",
                      selectedApps.includes(app.id) ? "border-teal-500 dark:border-teal-400" : "",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <Checkbox
                              checked={selectedApps.includes(app.id)}
                              onCheckedChange={() => toggleAppSelection(app.id)}
                              className="mr-2"
                            />
                            <div className={`p-2 rounded-full ${app.bgColor} dark:bg-white mr-3`}>
                              {renderAppIcon(app.icon, `h-5 w-5 ${app.color.replace("bg-", "text-")}`)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium">{app.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {app.usedTime} / {app.limit} minutes per day
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(app)}>
                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(app)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Switch checked={app.enabled} onCheckedChange={() => toggleApp(app.id)} />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">15m</span>
                        <Slider
                          disabled={!app.enabled}
                          value={[app.limit]}
                          min={5}
                          max={120}
                          step={5}
                          onValueChange={(value) => updateLimit(app.id, value[0])}
                          className={app.enabled ? "" : "opacity-50"}
                        />
                        <span className="text-sm">2h</span>
                      </div>

                      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Used: {app.usedTime} minutes</span>
                        <span>Remaining: {Math.max(0, app.limit - app.usedTime)} minutes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </AnimatedList>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {sortedApps.map((app) => (
                  <Card
                    key={app.id}
                    className={cn(
                      app.enabled ? "" : "opacity-60",
                      selectedApps.includes(app.id) ? "border-teal-500 dark:border-teal-400" : "",
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedApps.includes(app.id)}
                            onCheckedChange={() => toggleAppSelection(app.id)}
                            className="mr-2"
                          />
                          <div className={`p-2 rounded-full ${app.bgColor} dark:bg-white mr-2`}>
                            {renderAppIcon(app.icon, `h-4 w-4 ${app.color.replace("bg-", "text-")}`)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Switch
                            checked={app.enabled}
                            onCheckedChange={() => toggleApp(app.id)}
                            size="sm"
                            className="scale-75"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => openEditDialog(app)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm truncate">{app.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {app.usedTime}/{app.limit}m
                      </p>

                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                          className={`${app.color} h-1.5 rounded-full`}
                          style={{ width: `${Math.min(100, (app.usedTime / app.limit) * 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium">No apps found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? `No apps match "${searchQuery}"` : "Add apps to start setting time limits"}
                  </p>
                  <Button onClick={() => setShowAddAppDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add App
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AnimatedSection>

      {/* Tips */}
      <AnimatedSection animation="slide-up" delay={0.3} duration={0.6}>
        <Card className="bg-gray-50 dark:bg-gray-800 border-teal-200 dark:border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-medium text-teal-700 dark:text-white mb-2">Tips</h3>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Start with realistic limits and gradually reduce them</li>
              <li>• Consider setting stricter limits for most distracting apps</li>
              <li>• Adjust limits based on weekdays vs weekends</li>
              <li>• Use Focus Mode for complete distraction-free time</li>
            </ul>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Add New App Dialog */}
      <Dialog open={showAddAppDialog} onOpenChange={setShowAddAppDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New App</DialogTitle>
            <DialogDescription>Choose from popular apps or add a custom app</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="device">From Device</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {POPULAR_APPS[selectedCategory as keyof typeof POPULAR_APPS].map((app, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-20 p-2"
                    onClick={() => addNewApp(app)}
                  >
                    <div className={`p-2 rounded-full ${app.bgColor} mb-1`}>
                      {renderAppIcon(app.icon, `h-4 w-4 ${app.color.replace("bg-", "text-")}`)}
                    </div>
                    <span className="text-xs truncate w-full text-center">{app.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input
                  id="app-name"
                  placeholder="e.g., Twitter, Instagram"
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>App Icon</Label>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                    {renderAppIcon(customAppIcon, "h-5 w-5 text-gray-500")}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload Icon
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recommended: 512x512px PNG</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-color">App Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="app-color"
                    value={customAppColor}
                    onChange={(e) => setCustomAppColor(e.target.value)}
                    className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 p-1"
                  />
                  <div className="flex-1">
                    <Input
                      value={customAppColor}
                      onChange={(e) => setCustomAppColor(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-limit">Time Limit (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="app-limit"
                    type="number"
                    min={5}
                    max={240}
                    value={customAppLimit}
                    onChange={(e) => setCustomAppLimit(Number.parseInt(e.target.value) || 30)}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes/day</span>
                </div>
              </div>

              <Button
                className="w-full mt-2"
                disabled={!customAppName.trim()}
                onClick={() =>
                  addNewApp({
                    name: customAppName,
                    icon: customAppIcon,
                    limit: customAppLimit,
                    color: `bg-teal-500`, // In a real app, would convert hex to tailwind class
                    bgColor: `bg-teal-100`,
                  })
                }
              >
                Add Custom App
              </Button>
            </TabsContent>

            <TabsContent value="device" className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center p-4 space-y-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Smartphone className="h-8 w-8 text-gray-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">Import Apps from Your Device</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    We'll scan your device for installed apps and let you choose which ones to add
                  </p>
                </div>
                <Button onClick={() => setShowBulkImportDialog(true)}>
                  <Smartphone className="mr-2 h-4 w-4" /> Scan for Apps
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddAppDialog(false)}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={() => setShowCustomAppDialog(true)}>
              Create Custom App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit App Dialog */}
      <Dialog open={showEditAppDialog} onOpenChange={setShowEditAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-app-name">App Name</Label>
              <Input id="edit-app-name" value={editAppName} onChange={(e) => setEditAppName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-app-limit">Time Limit (minutes)</Label>
              <Input
                id="edit-app-limit"
                type="number"
                min={5}
                max={240}
                value={editAppLimit}
                onChange={(e) => setEditAppLimit(Number.parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-app-enabled">Enable Time Limit</Label>
              <Switch id="edit-app-enabled" checked={editAppEnabled} onCheckedChange={setEditAppEnabled} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditAppDialog(false)}>
              Cancel
            </Button>
            <Button onClick={editApp}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p>
                Are you sure you want to delete <strong>{selectedApp?.name}</strong>?
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will remove all time limits and usage data for this app. This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteApp}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImportDialog} onOpenChange={setShowBulkImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Apps from Device</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We'll scan your device for installed apps and let you choose which ones to add to Social Shield.
            </p>

            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="font-medium">Ready to scan</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This will require permission to access your installed apps
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={importAppsFromDevice}>Start Scan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
