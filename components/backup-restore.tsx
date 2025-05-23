"use client"

import type React from "react"

import { useState } from "react"
import { Download, Upload, Check, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BackupRestore() {
  const { exportData, importData } = useAppStore()
  const { toast } = useToast()
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    try {
      const data = exportData()

      // Create a blob and download it
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `social-shield-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Backup Created",
        description: "Your data has been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error creating your backup",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)
    setImportSuccess(false)
    setIsImporting(true)

    const file = event.target.files?.[0]
    if (!file) {
      setIsImporting(false)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        const success = importData(data)

        if (success) {
          setImportSuccess(true)
          toast({
            title: "Data Restored",
            description: "Your data has been imported successfully",
          })
        } else {
          setImportError("Failed to import data. The file may be corrupted or invalid.")
          toast({
            title: "Import Failed",
            description: "The backup file appears to be invalid or corrupted",
            variant: "destructive",
          })
        }
      } catch (error) {
        setImportError("Failed to read the backup file. Please try again.")
        toast({
          title: "Import Failed",
          description: "There was an error reading your backup file",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
      }
    }

    reader.onerror = () => {
      setImportError("Failed to read the backup file. Please try again.")
      setIsImporting(false)
      toast({
        title: "Import Failed",
        description: "There was an error reading your backup file",
        variant: "destructive",
      })
    }

    reader.readAsText(file)

    // Reset the input value so the same file can be selected again
    event.target.value = ""
  }

  return (
    <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Backup & Restore</h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Export your data to create a backup or import a previous backup to restore your data.
          </p>

          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}

          {importSuccess && (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your data has been restored successfully.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <span className="animate-pulse">Exporting...</span>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => document.getElementById("import-file")?.click()}
              disabled={isImporting}
            >
              {isImporting ? (
                <span className="animate-pulse">Importing...</span>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </>
              )}
              <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Backup includes all your settings, limits, schedules, and progress</p>
            <p>• Restore will replace all your current data with the backup</p>
            <p>• Keep your backup files secure as they contain your personal data</p>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
