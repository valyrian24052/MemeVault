"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Download, Copy, Database, Search, Sparkles, Edit3, Palette, ChevronDown } from "lucide-react"
import { MemeEditor } from "./components/meme-editor"
import { ThemeSelector } from "./components/theme-selector"

interface MemeTemplate {
  id: string
  name: string
  keywords: string[]
  imageUrl: string
  description: string
  category: string
}

const memeTemplates: MemeTemplate[] = [
  {
    id: "drake-pointing",
    name: "Drake Pointing",
    keywords: ["drake", "pointing", "preference", "choice", "this vs that"],
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    description: "Drake disapproving and approving meme template",
    category: "Choice",
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    keywords: ["distracted boyfriend", "looking back", "temptation", "choice"],
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    description: "Man looking back at another woman while walking with girlfriend",
    category: "Choice",
  },
  {
    id: "woman-yelling-cat",
    name: "Woman Yelling at Cat",
    keywords: ["woman yelling", "cat", "dinner table", "argument", "confused cat"],
    imageUrl: "https://i.imgflip.com/345v97.jpg",
    description: "Woman pointing and yelling, confused white cat at dinner table",
    category: "Reaction",
  },
  {
    id: "this-is-fine",
    name: "This is Fine",
    keywords: ["this is fine", "dog", "fire", "everything is fine", "chaos"],
    imageUrl: "https://i.imgflip.com/26am.jpg",
    description: 'Dog sitting in burning room saying "This is fine"',
    category: "Reaction",
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    keywords: ["expanding brain", "galaxy brain", "evolution", "levels", "intelligence"],
    imageUrl: "https://i.imgflip.com/1jwhww.jpg",
    description: "Four-panel brain evolution from small to galaxy brain",
    category: "Intelligence",
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    keywords: ["two buttons", "difficult choice", "sweating", "decision"],
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    description: "Person sweating over pressing one of two buttons",
    category: "Choice",
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    keywords: ["change my mind", "crowder", "debate", "opinion", "table"],
    imageUrl: "https://i.imgflip.com/24y43o.jpg",
    description: 'Person sitting at table with "Change My Mind" sign',
    category: "Opinion",
  },
  {
    id: "surprised-pikachu",
    name: "Surprised Pikachu",
    keywords: ["surprised pikachu", "shocked", "unexpected", "pokemon"],
    imageUrl: "https://i.imgflip.com/2kbn1e.jpg",
    description: "Pikachu with surprised expression",
    category: "Reaction",
  },
  {
    id: "stonks",
    name: "Stonks",
    keywords: ["stonks", "stocks", "investment", "profit", "meme man"],
    imageUrl: "https://i.imgflip.com/2ze47r.jpg",
    description: "Meme man in suit pointing at rising arrow graph",
    category: "Business",
  },
  {
    id: "wojak-crying",
    name: "Crying Wojak",
    keywords: ["wojak", "crying", "sad", "feels bad man", "depression"],
    imageUrl: "https://i.imgflip.com/2wifvo.jpg",
    description: "Crying wojak face expressing sadness",
    category: "Emotion",
  },
  {
    id: "mocking-spongebob",
    name: "Mocking SpongeBob",
    keywords: ["mocking spongebob", "sarcasm", "mocking", "alternating caps"],
    imageUrl: "https://i.imgflip.com/1otk96.jpg",
    description: "SpongeBob mocking with alternating uppercase and lowercase text",
    category: "Reaction",
  },
  {
    id: "batman-slapping-robin",
    name: "Batman Slapping Robin",
    keywords: ["batman slapping robin", "interruption", "shut up", "slap"],
    imageUrl: "https://i.imgflip.com/9ehk.jpg",
    description: "Batman slapping Robin for saying something inappropriate",
    category: "Reaction",
  },
]

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  meme?: MemeTemplate
  timestamp: Date
}

export type Theme = "light" | "dark" | "cyberpunk" | "forest" | "sunset" | "ocean" | "midnight" | "rose"

export default function MemeVault() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light")
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Welcome to MemeVault! 🚀 Your AI-powered meme template database with built-in editor. Search for any trending meme and I'll fetch the original template for you. Try 'drake', 'distracted boyfriend', or 'stonks' to get started! ⚡",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("meme-vault-theme") as Theme
    if (
      savedTheme &&
      ["light", "dark", "cyberpunk", "forest", "sunset", "ocean", "midnight", "rose"].includes(savedTheme)
    ) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("meme-vault-theme", currentTheme)
  }, [currentTheme])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    setIsThemeSelectorOpen(false)
  }

  const findMeme = (query: string): MemeTemplate | null => {
    const lowercaseQuery = query.toLowerCase()
    return (
      memeTemplates.find((meme) =>
        meme.keywords.some(
          (keyword) => keyword.toLowerCase().includes(lowercaseQuery) || lowercaseQuery.includes(keyword.toLowerCase()),
        ),
      ) || null
    )
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const foundMeme = findMeme(input)

      let botResponse: Message

      if (foundMeme) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `🎯 Template found! Here's "${foundMeme.name}" from the ${foundMeme.category} category. ${foundMeme.description} Click "Edit Meme" to add your own text!`,
          meme: foundMeme,
          timestamp: new Date(),
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `🔍 No matches for "${input}" in the database. Try these popular templates: drake, distracted boyfriend, woman yelling cat, this is fine, expanding brain, surprised pikachu, stonks, or mocking spongebob! 💡`,
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const openEditor = (meme: MemeTemplate) => {
    setSelectedMeme(meme)
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setSelectedMeme(null)
  }

  // Theme configurations
  const getThemeClasses = (theme: Theme) => {
    const themes = {
      light: {
        background: "bg-gray-50",
        text: "text-gray-900",
        header: "bg-white border-b border-gray-200 shadow-sm",
        logo: "from-blue-500 to-blue-600",
        logoAccent: "from-blue-400 to-blue-500",
        title: "text-gray-900",
        subtitle: "text-gray-600",
        statusBg: "bg-gray-100 border border-gray-200",
        statusText: "text-gray-700",
        userMessage: "bg-blue-500 text-white rounded-2xl rounded-br-md shadow-lg",
        botMessage: "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm",
        memeCard: "bg-white border border-gray-200 shadow-sm",
        memeTitle: "text-gray-900",
        categoryBadge: "bg-blue-50 text-blue-700 border border-blue-200",
        keywordBadge: "bg-gray-100 text-gray-600 border border-gray-200",
        buttonOutline: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
        buttonPrimary: "bg-blue-500 hover:bg-blue-600",
        typingBg: "bg-white border border-gray-200 text-gray-900 shadow-sm",
        typingText: "text-gray-500",
        inputBg: "bg-white border-t border-gray-200 shadow-sm",
        inputField:
          "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20",
        suggestionButton: "bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 text-gray-700",
        themeButton: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
        accent: "blue",
      },
      dark: {
        background: "bg-gradient-to-br from-gray-900 via-black to-gray-900",
        text: "text-white",
        header:
          "bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl border-b border-blue-500/20",
        logo: "from-blue-500 via-cyan-400 to-blue-600",
        logoAccent: "from-cyan-400 to-blue-400",
        title: "bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent",
        subtitle: "text-gray-400",
        statusBg: "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50",
        statusText: "text-gray-300",
        userMessage:
          "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-blue-500/25",
        botMessage:
          "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 text-gray-100 rounded-2xl rounded-bl-md shadow-xl",
        memeCard: "bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl",
        memeTitle: "text-white",
        categoryBadge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        keywordBadge: "bg-gray-700/50 text-gray-300 border border-gray-600/30",
        buttonOutline:
          "bg-gray-800/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/50 hover:border-blue-500/50 hover:text-blue-300",
        buttonPrimary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
        typingBg: "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 text-gray-100 shadow-xl",
        typingText: "text-gray-400",
        inputBg:
          "bg-gradient-to-r from-blue-900/30 via-gray-900/50 to-blue-900/30 backdrop-blur-xl border-t border-blue-500/20",
        inputField:
          "bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:bg-gray-800/70 focus:border-blue-500/70 focus:ring-blue-500/20",
        suggestionButton:
          "bg-gray-800/40 hover:bg-gray-700/60 border border-gray-600/40 hover:border-blue-500/50 text-gray-300 hover:text-blue-300",
        themeButton: "bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50",
        accent: "blue",
      },
      cyberpunk: {
        background: "bg-gradient-to-br from-purple-900 via-black to-pink-900",
        text: "text-cyan-100",
        header:
          "bg-gradient-to-r from-purple-900/40 via-black/60 to-pink-900/40 backdrop-blur-xl border-b border-cyan-500/30",
        logo: "from-cyan-400 via-purple-500 to-pink-500",
        logoAccent: "from-pink-400 to-cyan-400",
        title: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent",
        subtitle: "text-cyan-300/70",
        statusBg: "bg-purple-900/30 backdrop-blur-sm border border-cyan-500/30",
        statusText: "text-cyan-300",
        userMessage:
          "bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-purple-500/25",
        botMessage:
          "bg-black/60 backdrop-blur-xl border border-cyan-500/30 text-cyan-100 rounded-2xl rounded-bl-md shadow-xl shadow-cyan-500/10",
        memeCard: "bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20",
        memeTitle: "text-cyan-100",
        categoryBadge: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
        keywordBadge: "bg-cyan-900/30 text-cyan-300 border border-cyan-500/30",
        buttonOutline:
          "bg-black/50 border-cyan-500/50 text-cyan-300 hover:bg-purple-900/30 hover:border-purple-500/50 hover:text-purple-300",
        buttonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
        typingBg: "bg-black/60 backdrop-blur-xl border border-cyan-500/30 text-cyan-100 shadow-xl shadow-cyan-500/10",
        typingText: "text-cyan-400/70",
        inputBg:
          "bg-gradient-to-r from-purple-900/30 via-black/60 to-pink-900/30 backdrop-blur-xl border-t border-cyan-500/30",
        inputField:
          "bg-black/50 border-cyan-500/50 text-cyan-100 placeholder:text-cyan-400/70 focus:bg-black/70 focus:border-purple-500/70 focus:ring-purple-500/20",
        suggestionButton:
          "bg-black/40 hover:bg-purple-900/40 border border-cyan-500/40 hover:border-purple-500/50 text-cyan-300 hover:text-purple-300",
        themeButton: "bg-black/50 border-cyan-500/50 text-cyan-300 hover:bg-purple-900/30",
        accent: "purple",
      },
      forest: {
        background: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900",
        text: "text-green-50",
        header:
          "bg-gradient-to-r from-green-900/40 via-emerald-900/40 to-teal-900/40 backdrop-blur-xl border-b border-emerald-500/30",
        logo: "from-emerald-500 via-green-500 to-teal-500",
        logoAccent: "from-teal-400 to-emerald-400",
        title: "bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent",
        subtitle: "text-emerald-300/80",
        statusBg: "bg-green-900/30 backdrop-blur-sm border border-emerald-500/30",
        statusText: "text-emerald-300",
        userMessage:
          "bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-emerald-500/25",
        botMessage:
          "bg-green-900/60 backdrop-blur-xl border border-emerald-500/30 text-green-50 rounded-2xl rounded-bl-md shadow-xl shadow-emerald-500/10",
        memeCard: "bg-green-900/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20",
        memeTitle: "text-green-50",
        categoryBadge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
        keywordBadge: "bg-green-800/50 text-green-300 border border-green-500/30",
        buttonOutline:
          "bg-green-900/50 border-emerald-500/50 text-emerald-300 hover:bg-green-800/50 hover:border-teal-500/50 hover:text-teal-300",
        buttonPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
        typingBg:
          "bg-green-900/60 backdrop-blur-xl border border-emerald-500/30 text-green-50 shadow-xl shadow-emerald-500/10",
        typingText: "text-emerald-400/70",
        inputBg:
          "bg-gradient-to-r from-green-900/40 via-emerald-900/40 to-teal-900/40 backdrop-blur-xl border-t border-emerald-500/30",
        inputField:
          "bg-green-900/50 border-emerald-500/50 text-green-50 placeholder:text-emerald-400/70 focus:bg-green-900/70 focus:border-teal-500/70 focus:ring-teal-500/20",
        suggestionButton:
          "bg-green-900/40 hover:bg-green-800/40 border border-emerald-500/40 hover:border-teal-500/50 text-emerald-300 hover:text-teal-300",
        themeButton: "bg-green-900/50 border-emerald-500/50 text-emerald-300 hover:bg-green-800/50",
        accent: "emerald",
      },
      sunset: {
        background: "bg-gradient-to-br from-orange-900 via-red-900 to-pink-900",
        text: "text-orange-50",
        header:
          "bg-gradient-to-r from-orange-900/40 via-red-900/40 to-pink-900/40 backdrop-blur-xl border-b border-orange-500/30",
        logo: "from-orange-500 via-red-500 to-pink-500",
        logoAccent: "from-pink-400 to-orange-400",
        title: "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent",
        subtitle: "text-orange-300/80",
        statusBg: "bg-orange-900/30 backdrop-blur-sm border border-orange-500/30",
        statusText: "text-orange-300",
        userMessage:
          "bg-gradient-to-br from-orange-600 via-red-500 to-pink-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-orange-500/25",
        botMessage:
          "bg-red-900/60 backdrop-blur-xl border border-orange-500/30 text-orange-50 rounded-2xl rounded-bl-md shadow-xl shadow-orange-500/10",
        memeCard: "bg-red-900/80 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/20",
        memeTitle: "text-orange-50",
        categoryBadge: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
        keywordBadge: "bg-red-800/50 text-orange-300 border border-orange-500/30",
        buttonOutline:
          "bg-red-900/50 border-orange-500/50 text-orange-300 hover:bg-red-800/50 hover:border-pink-500/50 hover:text-pink-300",
        buttonPrimary: "bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700",
        typingBg:
          "bg-red-900/60 backdrop-blur-xl border border-orange-500/30 text-orange-50 shadow-xl shadow-orange-500/10",
        typingText: "text-orange-400/70",
        inputBg:
          "bg-gradient-to-r from-orange-900/40 via-red-900/40 to-pink-900/40 backdrop-blur-xl border-t border-orange-500/30",
        inputField:
          "bg-red-900/50 border-orange-500/50 text-orange-50 placeholder:text-orange-400/70 focus:bg-red-900/70 focus:border-pink-500/70 focus:ring-pink-500/20",
        suggestionButton:
          "bg-red-900/40 hover:bg-red-800/40 border border-orange-500/40 hover:border-pink-500/50 text-orange-300 hover:text-pink-300",
        themeButton: "bg-red-900/50 border-orange-500/50 text-orange-300 hover:bg-red-800/50",
        accent: "orange",
      },
      ocean: {
        background: "bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-900",
        text: "text-blue-50",
        header:
          "bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-teal-900/40 backdrop-blur-xl border-b border-blue-500/30",
        logo: "from-blue-500 via-indigo-500 to-teal-500",
        logoAccent: "from-teal-400 to-blue-400",
        title: "bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent",
        subtitle: "text-blue-300/80",
        statusBg: "bg-blue-900/30 backdrop-blur-sm border border-blue-500/30",
        statusText: "text-blue-300",
        userMessage:
          "bg-gradient-to-br from-blue-600 via-indigo-500 to-teal-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-blue-500/25",
        botMessage:
          "bg-indigo-900/60 backdrop-blur-xl border border-blue-500/30 text-blue-50 rounded-2xl rounded-bl-md shadow-xl shadow-blue-500/10",
        memeCard: "bg-indigo-900/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20",
        memeTitle: "text-blue-50",
        categoryBadge: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
        keywordBadge: "bg-indigo-800/50 text-blue-300 border border-blue-500/30",
        buttonOutline:
          "bg-indigo-900/50 border-blue-500/50 text-blue-300 hover:bg-indigo-800/50 hover:border-teal-500/50 hover:text-teal-300",
        buttonPrimary: "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700",
        typingBg:
          "bg-indigo-900/60 backdrop-blur-xl border border-blue-500/30 text-blue-50 shadow-xl shadow-blue-500/10",
        typingText: "text-blue-400/70",
        inputBg:
          "bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-teal-900/40 backdrop-blur-xl border-t border-blue-500/30",
        inputField:
          "bg-indigo-900/50 border-blue-500/50 text-blue-50 placeholder:text-blue-400/70 focus:bg-indigo-900/70 focus:border-teal-500/70 focus:ring-teal-500/20",
        suggestionButton:
          "bg-indigo-900/40 hover:bg-indigo-800/40 border border-blue-500/40 hover:border-teal-500/50 text-blue-300 hover:text-teal-300",
        themeButton: "bg-indigo-900/50 border-blue-500/50 text-blue-300 hover:bg-indigo-800/50",
        accent: "blue",
      },
      midnight: {
        background: "bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900",
        text: "text-slate-100",
        header:
          "bg-gradient-to-r from-slate-900/60 via-gray-900/60 to-zinc-900/60 backdrop-blur-xl border-b border-slate-700/50",
        logo: "from-slate-400 via-gray-400 to-zinc-400",
        logoAccent: "from-zinc-300 to-slate-300",
        title: "bg-gradient-to-r from-slate-300 via-gray-300 to-zinc-300 bg-clip-text text-transparent",
        subtitle: "text-slate-400",
        statusBg: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50",
        statusText: "text-slate-300",
        userMessage:
          "bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-slate-500/25",
        botMessage:
          "bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 text-slate-100 rounded-2xl rounded-bl-md shadow-xl shadow-slate-500/10",
        memeCard: "bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-slate-500/20",
        memeTitle: "text-slate-100",
        categoryBadge: "bg-slate-700/50 text-slate-300 border border-slate-600/50",
        keywordBadge: "bg-gray-800/50 text-slate-300 border border-slate-600/50",
        buttonOutline:
          "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-slate-200",
        buttonPrimary: "bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700",
        typingBg:
          "bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 text-slate-100 shadow-xl shadow-slate-500/10",
        typingText: "text-slate-400",
        inputBg:
          "bg-gradient-to-r from-slate-900/60 via-gray-900/60 to-zinc-900/60 backdrop-blur-xl border-t border-slate-700/50",
        inputField:
          "bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800/70 focus:border-slate-500/70 focus:ring-slate-500/20",
        suggestionButton:
          "bg-slate-800/40 hover:bg-slate-700/40 border border-slate-600/40 hover:border-slate-500/50 text-slate-300 hover:text-slate-200",
        themeButton: "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50",
        accent: "slate",
      },
      rose: {
        background: "bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900",
        text: "text-rose-50",
        header:
          "bg-gradient-to-r from-rose-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-xl border-b border-rose-500/30",
        logo: "from-rose-500 via-pink-500 to-purple-500",
        logoAccent: "from-purple-400 to-rose-400",
        title: "bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent",
        subtitle: "text-rose-300/80",
        statusBg: "bg-rose-900/30 backdrop-blur-sm border border-rose-500/30",
        statusText: "text-rose-300",
        userMessage:
          "bg-gradient-to-br from-rose-600 via-pink-500 to-purple-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-rose-500/25",
        botMessage:
          "bg-pink-900/60 backdrop-blur-xl border border-rose-500/30 text-rose-50 rounded-2xl rounded-bl-md shadow-xl shadow-rose-500/10",
        memeCard: "bg-pink-900/80 backdrop-blur-xl border border-rose-500/30 shadow-2xl shadow-rose-500/20",
        memeTitle: "text-rose-50",
        categoryBadge: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
        keywordBadge: "bg-pink-800/50 text-rose-300 border border-rose-500/30",
        buttonOutline:
          "bg-pink-900/50 border-rose-500/50 text-rose-300 hover:bg-pink-800/50 hover:border-purple-500/50 hover:text-purple-300",
        buttonPrimary: "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700",
        typingBg: "bg-pink-900/60 backdrop-blur-xl border border-rose-500/30 text-rose-50 shadow-xl shadow-rose-500/10",
        typingText: "text-rose-400/70",
        inputBg:
          "bg-gradient-to-r from-rose-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-xl border-t border-rose-500/30",
        inputField:
          "bg-pink-900/50 border-rose-500/50 text-rose-50 placeholder:text-rose-400/70 focus:bg-pink-900/70 focus:border-purple-500/70 focus:ring-purple-500/20",
        suggestionButton:
          "bg-pink-900/40 hover:bg-pink-800/40 border border-rose-500/40 hover:border-purple-500/50 text-rose-300 hover:text-purple-300",
        themeButton: "bg-pink-900/50 border-rose-500/50 text-rose-300 hover:bg-pink-800/50",
        accent: "rose",
      },
    }
    return themes[theme]
  }

  const themeClasses = getThemeClasses(currentTheme)

  return (
    <div
      className={`h-screen ${themeClasses.background} ${themeClasses.text} overflow-hidden flex flex-col transition-all duration-500`}
    >
      {/* Header */}
      <div className={`${themeClasses.header} p-4 md:p-6 transition-all duration-500`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${themeClasses.logo} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500`}
              >
                <Database className="w-7 h-7 text-white" />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r ${themeClasses.logoAccent} rounded-full flex items-center justify-center transition-all duration-500`}
              >
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${themeClasses.title} transition-all duration-500`}>
                MemeVault
              </h1>
              <p className={`text-sm font-medium ${themeClasses.subtitle} transition-all duration-500`}>
                AI Template Database + Editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
                className={`${themeClasses.themeButton} transition-all duration-200`}
              >
                <Palette className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Theme</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>

              {isThemeSelectorOpen && (
                <ThemeSelector
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeChange}
                  onClose={() => setIsThemeSelectorOpen(false)}
                />
              )}
            </div>

            {/* Status */}
            <div
              className={`hidden md:flex items-center gap-3 ${themeClasses.statusBg} rounded-lg px-4 py-2 transition-all duration-500`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${themeClasses.statusText} transition-all duration-500`}>
                {memeTemplates.length} templates online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg ${message.type === "user" ? themeClasses.userMessage : themeClasses.botMessage} px-5 py-4 transition-all duration-500`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.meme && (
                  <Card className={`mt-4 ${themeClasses.memeCard} overflow-hidden transition-all duration-500`}>
                    <div className="p-5 space-y-4">
                      <div className="relative group">
                        <img
                          src={message.meme.imageUrl || "/placeholder.svg"}
                          alt={message.meme.name}
                          className="w-full rounded-lg border border-current/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(message.meme!.name)}`
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-lg ${themeClasses.memeTitle} transition-all duration-500`}>
                            {message.meme.name}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${themeClasses.categoryBadge} transition-all duration-500`}
                          >
                            {message.meme.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {message.meme.keywords.slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className={`px-2 py-1 text-xs rounded-lg font-medium ${themeClasses.keywordBadge} transition-all duration-500`}
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`${themeClasses.buttonOutline} transition-all duration-200`}
                            onClick={() => copyToClipboard(message.meme!.imageUrl)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`${themeClasses.buttonOutline} transition-all duration-200`}
                            onClick={() =>
                              downloadImage(message.meme!.imageUrl, `${message.meme!.name.replace(/\s+/g, "-")}.jpg`)
                            }
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            className={`${themeClasses.buttonPrimary} text-white transition-all duration-200`}
                            onClick={() => openEditor(message.meme!)}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <p className="text-xs opacity-60 mt-3 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className={`${themeClasses.typingBg} px-5 py-4 rounded-2xl rounded-bl-md transition-all duration-500`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${themeClasses.typingText} transition-all duration-500`}>
                    MemeVault AI is searching...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`${themeClasses.inputBg} p-4 md:p-6 transition-all duration-500`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for any meme template... (drake, stonks, this is fine)"
                className={`w-full rounded-xl px-6 py-4 text-base transition-all duration-200 ${themeClasses.inputField}`}
                disabled={isTyping}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`${themeClasses.buttonPrimary} text-white rounded-xl px-6 py-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {["drake", "stonks", "this is fine", "surprised pikachu", "distracted boyfriend", "mocking spongebob"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${themeClasses.suggestionButton}`}
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Meme Editor Modal */}
      {isEditorOpen && selectedMeme && (
        <MemeEditor meme={selectedMeme} isOpen={isEditorOpen} onClose={closeEditor} currentTheme={currentTheme} />
      )}
    </div>
  )
}
