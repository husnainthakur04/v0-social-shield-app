"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppStore, availableLanguages } from "@/lib/store"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useToast } from "@/components/ui/use-toast"

export function LanguageSettings() {
  const { language, setLanguage } = useAppStore()
  const { toast } = useToast()
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
  }

  const handleSave = () => {
    setLanguage(selectedLanguage)
    toast({
      title: "Language Updated",
      description: `Language has been changed to ${availableLanguages.find((lang) => lang.code === selectedLanguage)?.name}`,
    })
  }

  return (
    <AnimatedSection animation="slide-up" delay={0.1} duration={0.6}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-semibold">Language</h2>
          </div>

          <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange} className="space-y-2">
            {availableLanguages.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                <Label htmlFor={`lang-${lang.code}`} className="flex-1 cursor-pointer">
                  {lang.name}
                </Label>
                {selectedLanguage === lang.code && <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
              </div>
            ))}
          </RadioGroup>

          <Button className="w-full mt-4" onClick={handleSave} disabled={selectedLanguage === language}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
