"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

interface CopyButtonProps {
  text: string
  label: string
  className?: string
  /** "dark" for always-dark bars (code blocks), "auto" to follow the light/dark theme. */
  tone?: "dark" | "auto"
}

const TONES = {
  dark: "text-gray-400 hover:text-white hover:bg-white/10",
  auto: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-white/10",
}

export function CopyButton({ text, label, className = "", tone = "dark" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`relative w-8 h-8 flex items-center justify-center rounded-md ${TONES[tone]} active:scale-90 transition-[transform,color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-orange-500 cursor-pointer before:absolute before:-inset-1.5 before:content-[''] ${className}`}
      title={copied ? "Copied!" : label}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </button>
  )
}
