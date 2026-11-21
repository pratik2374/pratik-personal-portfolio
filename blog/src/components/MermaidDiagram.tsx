"use client"

import React, { useEffect, useState, useRef } from "react"
import { GitFork } from "lucide-react"
import { CopyButton } from "./CopyButton"

interface MermaidDiagramProps {
  chart: string
}

interface MermaidApi {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string }>
}

declare global {
  interface Window {
    mermaid?: MermaidApi
  }
}

// Must match the bundled public/vendor/mermaid.min.js so the fallback behaves the same.
const MERMAID_CDN_FALLBACK = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.min.js"

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
      fallbackScript.src = MERMAID_CDN_FALLBACK
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
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    async function renderChart() {
      try {
        await loadMermaidScript()
        if (!isMounted || !window.mermaid) return

        // next-themes puts the resolved theme on <html> as a class, so the class is
        // the single source of truth (the OS setting may disagree with the user's pick).
        const isDark = document.documentElement.classList.contains("dark")

        window.mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "strict",
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
      } catch (err: unknown) {
        console.warn("Failed to render Mermaid diagram:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Diagram render error")
        }
      }
    }

    // Mermaid is ~3.5 MB, so only fetch and render once the diagram is about to scroll into view.
    let renderedDark: boolean | null = null
    const renderIfNeeded = () => {
      const isDark = document.documentElement.classList.contains("dark")
      if (renderedDark === isDark) return
      renderedDark = isDark
      renderChart()
    }

    const visibility = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          visibility.disconnect()
          renderIfNeeded()
        }
      },
      { rootMargin: "600px 0px" }
    )
    if (containerRef.current) visibility.observe(containerRef.current)

    // Re-render only when light/dark actually flips, not on every class change on <html>.
    const themeObserver = new MutationObserver(() => {
      if (renderedDark !== null) renderIfNeeded()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      isMounted = false
      visibility.disconnect()
      themeObserver.disconnect()
    }
  }, [chart])

  return (
    <div className="not-prose my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414] shadow-sm">
      {/* Sleek compact header bar */}
      <div className="flex items-center justify-between pl-4 pr-2 bg-gray-50 dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 text-xs font-mono h-10">
        <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-medium tracking-wider text-[11px] uppercase">
          <GitFork className="w-3.5 h-3.5" />
          <span>DIAGRAM</span>
        </div>
        <CopyButton text={chart} label="Copy diagram source" tone="auto" />
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
