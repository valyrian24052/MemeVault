"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { Theme } from "../page"

interface ThemeSelectorProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  onClose: () => void
}

export function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  const themes = [
    {
      id: "light" as Theme,
      name: "Light",
      description: "Clean and minimal",
      preview: "bg-gradient-to-br from-gray-50 to-white",
      accent: "bg-blue-500",
    },
    {
      id: "dark" as Theme,
      name: "Dark",
      description: "Sleek and modern",
      preview: "bg-gradient-to-br from-gray-900 to-black",
      accent: "bg-blue-400",
    },
    {
      id: "cyberpunk" as Theme,
      name: "Cyberpunk",
      description: "Neon and futuristic",
      preview: "bg-gradient-to-br from-purple-900 via-black to-pink-900",
      accent: "bg-cyan-400",
    },
    {
      id: "forest" as Theme,
      name: "Forest",
      description: "Natural and calming",
      preview: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900",
      accent: "bg-emerald-400",
    },
    {
      id: "sunset" as Theme,
      name: "Sunset",
      description: "Warm and vibrant",
      preview: "bg-gradient-to-br from-orange-900 via-red-900 to-pink-900",
      accent: "bg-orange-400",
    },
    {
      id: "ocean" as Theme,
      name: "Ocean",
      description: "Deep and serene",
      preview: "bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-900",
      accent: "bg-blue-400",
    },
    {
      id: "midnight" as Theme,
      name: "Midnight",
      description: "Elegant and sophisticated",
      preview: "bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900",
      accent: "bg-slate-400",
    },
    {
      id: "rose" as Theme,
      name: "Rose",
      description: "Romantic and soft",
      preview: "bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900",
      accent: "bg-rose-400",
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Theme Selector */}
      <Card className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl z-50 max-h-96 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="outline"
                className={`relative h-20 p-3 flex flex-col items-start justify-between border-2 transition-all duration-200 ${
                  currentTheme === theme.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => onThemeChange(theme.id)}
              >
                {/* Theme Preview */}
                <div className={`w-full h-8 rounded-md ${theme.preview} relative overflow-hidden`}>
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${theme.accent}`} />
                </div>

                {/* Theme Info */}
                <div className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{theme.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</p>
                    </div>
                    {currentTheme === theme.id && <Check className="w-4 h-4 text-blue-500" />}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
