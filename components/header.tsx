"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Settings, LogIn, UserPlus, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/AuthContext"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip" // Import Tooltip components

export function Header({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };

  // Determine the main title or link to homepage
  const MainTitle = () => (
    <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
      {title || "FileShareX"} {/* Fallback title */}
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center">
        {showBack && (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* If there's no back button, the title becomes the home link */}
        {!showBack ? <MainTitle /> : <h1 className="text-lg font-medium">{title}</h1>}
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        {/* Auth Links */}
        {loading && <span className="text-sm text-muted-foreground">Loading...</span>}
        {!loading && isAuthenticated && user && (
          <>
            {user.isAdmin && ( // Check if user is admin
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/dashboard")} className="flex items-center mr-2">
                 {/* Using ShieldCheck or similar for Admin might be nice, but LayoutDashboard is fine */}
                <LayoutDashboard className="h-4 w-4 mr-1" /> Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-1" /> Logout ({user.email.split('@')[0]})
            </Button>
          </>
        )}
        {!loading && !isAuthenticated && (
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")} className="flex items-center">
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Button>
            <Button variant="default" size="sm" onClick={() => router.push("/auth/register")} className="flex items-center">
              <UserPlus className="h-4 w-4 mr-1" /> Register
            </Button>
          </>
        )}
        {/* Settings button can be conditional or always present */}
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
