"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  language?: string
  code: string
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

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
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-gray-800 text-xs font-mono">
        <span className="text-orange-400 font-medium uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700 transition-colors focus:outline-hidden"
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
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
