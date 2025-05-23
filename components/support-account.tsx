"use client"

import { useState } from "react"
import { HelpCircle, Mail, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"

export function SupportAccount() {
  const { resetApp } = useAppStore()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleContactSupport = () => {
    // In a real app, this would open an email client or support form
    window.open("mailto:support@socialshield.app?subject=Support%20Request", "_blank")
    toast({
      title: "Contact Support",
      description: "Opening your email client to contact support",
    })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === "delete") {
      setIsDeleting(true)

      // Simulate a delay for the deletion process
      setTimeout(() => {
        resetApp()
        setShowDeleteDialog(false)
        setIsDeleting(false)
        setDeleteConfirmText("")

        toast({
          title: "Account Deleted",
          description: "Your account and all data have been deleted",
          variant: "destructive",
        })
      }, 1500)
    } else {
      toast({
        title: "Confirmation Failed",
        description: "Please type 'delete' to confirm account deletion",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
        <Card>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <HelpCircle className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                <h2 className="text-lg font-semibold">Help & Support</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Get help with using Social Shield or report any issues you encounter.
              </p>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleContactSupport}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <Separator />

            <div className="p-4">
              <div className="flex items-center mb-2">
                <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                <h2 className="text-lg font-semibold text-red-500">Delete Account</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setShowDeleteDialog(open)
            if (!open) setDeleteConfirmText("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, including settings, limits, schedules, and progress will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm font-medium">Type "delete" to confirm:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background"
              placeholder="delete"
              disabled={isDeleting}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">Deleting</span>
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
