"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Check, Copy } from "lucide-react"
import { MermaidDiagram, isMermaidCode } from "./MermaidDiagram"
import { MarkdownTable, isMarkdownTable } from "./MarkdownTable"

interface CodeBlockProps {
  language?: string
  code: string
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  // 1. Mermaid Diagram rendering
  if (isMermaidCode(language, code)) {
    return <MermaidDiagram chart={code} />
  }

  // 2. Markdown Table rendering
  if ((language?.toLowerCase() === "markdown" || !language) && isMarkdownTable(code)) {
    return <MarkdownTable code={code} />
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code: ", err)
    }
  }

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-gray-800 bg-[#141414] text-sm shadow-md group">
      {/* Sleek compact header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1e1e1e] border-b border-gray-800 text-xs font-mono h-8">
        <span className="text-orange-400 font-medium uppercase tracking-wider text-[11px]">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 focus:outline-hidden cursor-pointer"
          title={copied ? "Copied!" : "Copy code"}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Syntax highlighted code body */}
      <div className="overflow-x-auto text-[13px] md:text-sm">
        <SyntaxHighlighter
          language={language || "javascript"}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1.5rem",
            background: "#141414",
            fontSize: "inherit",
            lineHeight: "1.6",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
