"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, Download, Type, Palette, RotateCcw } from "lucide-react"

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
}

export function MemeEditor({ meme, isOpen, onClose }: MemeEditorProps) {
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Meme Editor</h2>
              <p className="text-gray-400 text-sm">Editing: {meme.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Canvas Area */}
          <div className="flex-1 p-6 bg-gray-800/50 flex items-center justify-center overflow-auto">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border border-gray-600 rounded-lg shadow-lg"
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
          <div className="w-full lg:w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Text Inputs */}
              <Card className="bg-gray-800/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text Content
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Top Text</label>
                    <Input
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="Enter top text..."
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Bottom Text</label>
                    <Input
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="Enter bottom text..."
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </Card>

              {/* Font Settings */}
              <Card className="bg-gray-800/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Font Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Font Size: {fontSize[0]}px</label>
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
                    <label className="text-gray-300 text-sm font-medium block mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 bg-gray-700"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Stroke Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 bg-gray-700"
                      />
                      <Input
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">
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
              <Card className="bg-gray-800/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-4">Quick Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTextColor("#FFFFFF")
                      setStrokeColor("#000000")
                    }}
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
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
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
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
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
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
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    Matrix
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={downloadMeme}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Meme
                </Button>
                <Button
                  onClick={resetEditor}
                  variant="outline"
                  className="w-full bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
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
