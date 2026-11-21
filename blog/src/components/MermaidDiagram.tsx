"use client"

import React, { useEffect, useState, useRef } from "react"
import { GitFork, Copy, Check } from "lucide-react"

interface MermaidDiagramProps {
  chart: string
}

export function isMermaidCode(language?: string, code?: string): boolean {
  if (language?.toLowerCase() === "mermaid") return true
  if (!code) return false
  const trimmed = code.trim()
  return (
    trimmed.startsWith("flowchart") ||
    trimmed.startsWith("sequenceDiagram") ||
    trimmed.startsWith("graph") ||
    trimmed.startsWith("classDiagram") ||
    trimmed.startsWith("stateDiagram") ||
    trimmed.startsWith("erDiagram") ||
    trimmed.startsWith("journey") ||
    trimmed.startsWith("gantt") ||
    trimmed.startsWith("pie") ||
    trimmed.startsWith("mindmap")
  )
}

declare global {
  interface Window {
    mermaid?: any
  }
}

let mermaidScriptPromise: Promise<void> | null = null

function loadMermaidScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject()
  if (window.mermaid) return Promise.resolve()
  if (mermaidScriptPromise) return mermaidScriptPromise

  mermaidScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "/vendor/mermaid.min.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      // Fallback to CDN if local vendor script fails
      const fallbackScript = document.createElement("script")
      fallbackScript.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"
      fallbackScript.async = true
      fallbackScript.onload = () => resolve()
      fallbackScript.onerror = (e) => reject(e)
      document.head.appendChild(fallbackScript)
    }
    document.head.appendChild(script)
  })

  return mermaidScriptPromise
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svgContent, setSvgContent] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    async function renderChart() {
      try {
        await loadMermaidScript()
        if (!isMounted || !window.mermaid) return

        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches

        window.mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: isDark
            ? {
                primaryColor: "#ea580c",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#f97316",
                lineColor: "#f97316",
                secondaryColor: "#1e1e1e",
                tertiaryColor: "#141414",
                mainBkg: "#18181b",
                nodeBorder: "#3f3f46",
                nodeTextColor: "#fafafa",
              }
            : {
                primaryColor: "#f97316",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#ea580c",
                lineColor: "#ea580c",
                secondaryColor: "#f4f4f5",
                tertiaryColor: "#ffffff",
              },
        })

        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`
        const { svg } = await window.mermaid.render(uniqueId, chart.trim())
        if (isMounted) {
          setSvgContent(svg)
          setError(null)
        }
      } catch (err: any) {
        console.warn("Failed to render Mermaid diagram:", err)
        if (isMounted) {
          setError(err?.message || "Diagram render error")
        }
      }
    }

    renderChart()

    // Re-render when theme changes (light/dark switch)
    const observer = new MutationObserver(() => {
      renderChart()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      isMounted = false
      observer.disconnect()
    }
  }, [chart])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy diagram code: ", err)
    }
  }

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414] shadow-md group">
      {/* Sleek compact header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-gray-100/90 dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 text-xs font-mono h-8">
        <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-medium tracking-wider text-[11px] uppercase">
          <GitFork className="w-3.5 h-3.5" />
          <span>DIAGRAM</span>
        </div>
        <button
          onClick={handleCopy}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
          title={copied ? "Copied!" : "Copy diagram source"}
          aria-label={copied ? "Copied!" : "Copy diagram source"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Rendered SVG Container */}
      <div
        ref={containerRef}
        className="p-6 md:p-8 overflow-x-auto flex justify-center items-center min-h-[160px] bg-white dark:bg-[#121213]"
      >
        {svgContent ? (
          <div
            className="w-full max-w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto transition-opacity duration-300"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : error ? (
          <div className="w-full font-mono text-xs text-red-400 p-4 bg-red-500/10 rounded-lg">
            <p className="mb-2 font-semibold">Diagram rendering failed:</p>
            <pre className="overflow-x-auto">{chart}</pre>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono py-8 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Rendering diagram...</span>
          </div>
        )}
      </div>
    </div>
  )
}
