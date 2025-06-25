"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, Download, Type, Palette, RotateCcw } from "lucide-react"
import type { Theme } from "../page"

interface MemeTemplate {
  id: string
  name: string
  keywords: string[]
  imageUrl: string
  description: string
  category: string
}

interface MemeEditorProps {
  meme: MemeTemplate
  isOpen: boolean
  onClose: () => void
  currentTheme: Theme
}

export function MemeEditor({ meme, isOpen, onClose, currentTheme }: MemeEditorProps) {
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [fontSize, setFontSize] = useState([40])
  const [textColor, setTextColor] = useState("#FFFFFF")
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState([3])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isOpen) {
      drawMeme()
    }
  }, [isOpen, topText, bottomText, fontSize, textColor, strokeColor, strokeWidth])

  const drawMeme = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Wait for image to load
    if (!image.complete) {
      image.onload = () => drawMeme()
      return
    }

    // Set canvas size to match image
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(image, 0, 0)

    // Set text properties
    const fontSizeValue = fontSize[0]
    ctx.font = `bold ${fontSizeValue}px Impact, Arial Black, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = textColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth[0]

    // Function to draw text with word wrapping
    const drawText = (text: string, x: number, y: number, maxWidth: number) => {
      if (!text.trim()) return

      const words = text.toUpperCase().split(" ")
      const lines: string[] = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = ctx.measureText(currentLine + " " + word).width
        if (width < maxWidth) {
          currentLine += " " + word
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      }
      lines.push(currentLine)

      // Draw each line
      const lineHeight = fontSizeValue * 1.2
      const startY = y - ((lines.length - 1) * lineHeight) / 2

      lines.forEach((line, index) => {
        const lineY = startY + index * lineHeight
        ctx.strokeText(line, x, lineY)
        ctx.fillText(line, x, lineY)
      })
    }

    // Draw top text
    if (topText) {
      drawText(topText, canvas.width / 2, fontSizeValue + 20, canvas.width - 40)
    }

    // Draw bottom text
    if (bottomText) {
      drawText(bottomText, canvas.width / 2, canvas.height - fontSizeValue - 20, canvas.width - 40)
    }
  }

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create download link
    const link = document.createElement("a")
    link.download = `${meme.name.replace(/\s+/g, "-")}-meme.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const resetEditor = () => {
    setTopText("")
    setBottomText("")
    setFontSize([40])
    setTextColor("#FFFFFF")
    setStrokeColor("#000000")
    setStrokeWidth([3])
  }

  if (!isOpen) return null

  // Get theme-specific classes
  const getThemeClasses = (theme: Theme) => {
    const isDark = theme !== "light"

    const baseClasses = {
      overlay: isDark ? "bg-black/80" : "bg-black/50",
      modal: isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
      header: isDark ? "bg-gray-800/50 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200",
      headerText: isDark ? "text-white" : "text-gray-900",
      headerSubtext: isDark ? "text-gray-400" : "text-gray-600",
      canvasArea: isDark ? "bg-gray-800/30" : "bg-gray-50",
      canvasBorder: isDark ? "border-gray-600" : "border-gray-300",
      controlsPanel: isDark ? "bg-gray-900 border-l border-gray-700" : "bg-white border-l border-gray-200",
      cardBg: isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200",
      cardTitle: isDark ? "text-white" : "text-gray-900",
      label: isDark ? "text-gray-300" : "text-gray-700",
      input: isDark
        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500",
      colorInput: isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white",
      buttonOutline: isDark
        ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
      buttonPrimary: "bg-blue-500 hover:bg-blue-600",
      closeButton: isDark
        ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
    }

    // Theme-specific overrides
    const themeOverrides = {
      cyberpunk: {
        modal: "bg-black/90 border-purple-500/30",
        header: "bg-purple-900/30 border-b border-cyan-500/30",
        canvasArea: "bg-black/50",
        controlsPanel: "bg-black/90 border-l border-purple-500/30",
        cardBg: "bg-purple-900/20 border-cyan-500/30",
        buttonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      },
      forest: {
        modal: "bg-green-900/90 border-emerald-500/30",
        header: "bg-green-800/50 border-b border-emerald-500/30",
        canvasArea: "bg-green-900/30",
        controlsPanel: "bg-green-900/90 border-l border-emerald-500/30",
        cardBg: "bg-green-800/30 border-emerald-500/30",
        buttonPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
      },
      sunset: {
        modal: "bg-red-900/90 border-orange-500/30",
        header: "bg-red-800/50 border-b border-orange-500/30",
        canvasArea: "bg-red-900/30",
        controlsPanel: "bg-red-900/90 border-l border-orange-500/30",
        cardBg: "bg-red-800/30 border-orange-500/30",
        buttonPrimary: "bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700",
      },
      ocean: {
        modal: "bg-indigo-900/90 border-blue-500/30",
        header: "bg-indigo-800/50 border-b border-blue-500/30",
        canvasArea: "bg-indigo-900/30",
        controlsPanel: "bg-indigo-900/90 border-l border-blue-500/30",
        cardBg: "bg-indigo-800/30 border-blue-500/30",
        buttonPrimary: "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700",
      },
      midnight: {
        modal: "bg-slate-900/90 border-slate-600/50",
        header: "bg-slate-800/50 border-b border-slate-600/50",
        canvasArea: "bg-slate-900/30",
        controlsPanel: "bg-slate-900/90 border-l border-slate-600/50",
        cardBg: "bg-slate-800/30 border-slate-600/50",
        buttonPrimary: "bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700",
      },
      rose: {
        modal: "bg-pink-900/90 border-rose-500/30",
        header: "bg-pink-800/50 border-b border-rose-500/30",
        canvasArea: "bg-pink-900/30",
        controlsPanel: "bg-pink-900/90 border-l border-rose-500/30",
        cardBg: "bg-pink-800/30 border-rose-500/30",
        buttonPrimary: "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700",
      },
    }

    return { ...baseClasses, ...(themeOverrides[theme] || {}) }
  }

  const themeClasses = getThemeClasses(currentTheme)

  return (
    <div
      className={`fixed inset-0 ${themeClasses.overlay} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-500`}
    >
      <div
        className={`${themeClasses.modal} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transition-all duration-500`}
      >
        {/* Header */}
        <div className={`${themeClasses.header} p-6 flex items-center justify-between transition-all duration-500`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.headerText} transition-all duration-500`}>
                Meme Editor
              </h2>
              <p className={`text-sm ${themeClasses.headerSubtext} transition-all duration-500`}>
                Editing: {meme.name}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className={`${themeClasses.closeButton} transition-all duration-200`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Canvas Area */}
          <div
            className={`flex-1 p-6 ${themeClasses.canvasArea} flex items-center justify-center overflow-auto transition-all duration-500`}
          >
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`max-w-full max-h-full border ${themeClasses.canvasBorder} rounded-lg shadow-lg transition-all duration-500`}
                style={{ maxWidth: "500px", maxHeight: "500px" }}
              />
              <img
                ref={imageRef}
                src={meme.imageUrl || "/placeholder.svg"}
                alt={meme.name}
                className="hidden"
                crossOrigin="anonymous"
                onLoad={drawMeme}
              />
            </div>
          </div>

          {/* Controls Panel */}
          <div
            className={`w-full lg:w-80 ${themeClasses.controlsPanel} p-6 overflow-y-auto transition-all duration-500`}
          >
            <div className="space-y-6">
              {/* Text Inputs */}
              <Card className={`${themeClasses.cardBg} p-4 transition-all duration-500`}>
                <h3
                  className={`${themeClasses.cardTitle} font-semibold mb-4 flex items-center gap-2 transition-all duration-500`}
                >
                  <Type className="w-4 h-4" />
                  Text Content
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Top Text
                    </label>
                    <Input
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="Enter top text..."
                      className={`${themeClasses.input} transition-all duration-200`}
                    />
                  </div>
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Bottom Text
                    </label>
                    <Input
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="Enter bottom text..."
                      className={`${themeClasses.input} transition-all duration-200`}
                    />
                  </div>
                </div>
              </Card>

              {/* Font Settings */}
              <Card className={`${themeClasses.cardBg} p-4 transition-all duration-500`}>
                <h3
                  className={`${themeClasses.cardTitle} font-semibold mb-4 flex items-center gap-2 transition-all duration-500`}
                >
                  <Palette className="w-4 h-4" />
                  Font Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Font Size: {fontSize[0]}px
                    </label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={80}
                      min={20}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className={`w-12 h-10 rounded border ${themeClasses.colorInput} transition-all duration-200`}
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className={`${themeClasses.input} flex-1 transition-all duration-200`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Stroke Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className={`w-12 h-10 rounded border ${themeClasses.colorInput} transition-all duration-200`}
                      />
                      <Input
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className={`${themeClasses.input} flex-1 transition-all duration-200`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`${themeClasses.label} text-sm font-medium block mb-2 transition-all duration-500`}
                    >
                      Stroke Width: {strokeWidth[0]}px
                    </label>
                    <Slider
                      value={strokeWidth}
                      onValueChange={setStrokeWidth}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>

              {/* Quick Presets */}
              <Card className={`${themeClasses.cardBg} p-4 transition-all duration-500`}>
                <h3 className={`${themeClasses.cardTitle} font-semibold mb-4 transition-all duration-500`}>
                  Quick Presets
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTextColor("#FFFFFF")
                      setStrokeColor("#000000")
                    }}
                    className={`${themeClasses.buttonOutline} transition-all duration-200`}
                  >
                    Classic
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTextColor("#FFD700")
                      setStrokeColor("#8B4513")
                    }}
                    className={`${themeClasses.buttonOutline} transition-all duration-200`}
                  >
                    Gold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTextColor("#FF0000")
                      setStrokeColor("#FFFFFF")
                    }}
                    className={`${themeClasses.buttonOutline} transition-all duration-200`}
                  >
                    Red Alert
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTextColor("#00FF00")
                      setStrokeColor("#000000")
                    }}
                    className={`${themeClasses.buttonOutline} transition-all duration-200`}
                  >
                    Matrix
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={downloadMeme}
                  className={`w-full ${themeClasses.buttonPrimary} text-white transition-all duration-200`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Meme
                </Button>
                <Button
                  onClick={resetEditor}
                  variant="outline"
                  className={`w-full ${themeClasses.buttonOutline} transition-all duration-200`}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
