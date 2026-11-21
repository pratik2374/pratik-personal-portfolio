"use client"

import React, { useState } from "react"
import { Table, Copy, Check } from "lucide-react"

interface MarkdownTableProps {
  code: string
}

interface ParsedTable {
  headers: string[]
  alignments: ("left" | "center" | "right")[]
  rows: string[][]
}

function parseMarkdownTable(raw: string): ParsedTable | null {
  const lines = raw
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length < 2) return null

  // Ensure header line has columns
  if (!lines[0].includes("|")) return null

  // Ensure line 1 is separator row (e.g. |:---|:---:|---:|)
  const sepLine = lines[1]
  if (!/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(sepLine)) return null

  const splitRow = (line: string): string[] => {
    let clean = line
    if (clean.startsWith("|")) clean = clean.slice(1)
    if (clean.endsWith("|")) clean = clean.slice(0, -1)
    return clean.split("|").map((c) => c.trim())
  }

  const parseAlignments = (line: string): ("left" | "center" | "right")[] => {
    return splitRow(line).map((cell) => {
      const left = cell.startsWith(":")
      const right = cell.endsWith(":")
      if (left && right) return "center"
      if (right) return "right"
      return "left"
    })
  }

  const headers = splitRow(lines[0])
  const alignments = parseAlignments(lines[1])
  const rows = lines.slice(2).map(splitRow)

  if (headers.length === 0 || rows.length === 0) return null

  return { headers, alignments, rows }
}

export function isMarkdownTable(raw: string): boolean {
  if (!raw || typeof raw !== "string") return false
  const lines = raw
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return false
  if (!lines[0].includes("|")) return false
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(lines[1])
}

// Parses simple inline formatting: **bold**, *italic*, `code`, and $math$
function renderFormattedCell(text: string): React.ReactNode {
  if (!text) return null

  // Tokenize regex matching **bold**, *italic*, `code`, $math$
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="text-orange-500 dark:text-orange-400 font-mono text-xs bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 rounded-md"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
      return (
        <span key={index} className="font-mono text-xs text-orange-400 font-medium">
          {part.slice(1, -1)}
        </span>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-gray-800 dark:text-gray-200">
          {part.slice(1, -1)}
        </em>
      )
    }
    return part
  })
}

export function MarkdownTable({ code }: MarkdownTableProps) {
  const [copied, setCopied] = useState(false)
  const parsed = parseMarkdownTable(code)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy table: ", err)
    }
  }

  if (!parsed) return null

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414] shadow-md group">
      {/* Sleek compact header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-gray-100/90 dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 text-xs font-mono h-8">
        <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-medium tracking-wider text-[11px] uppercase">
          <Table className="w-3.5 h-3.5" />
          <span>TABLE</span>
        </div>
        <button
          onClick={handleCopy}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
          title={copied ? "Copied!" : "Copy table markdown"}
          aria-label={copied ? "Copied!" : "Copy table markdown"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Styled Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#18181a] border-b border-gray-200 dark:border-gray-800">
              {parsed.headers.map((header, idx) => {
                const align = parsed.alignments[idx] || "left"
                return (
                  <th
                    key={idx}
                    className={`px-4 py-3 font-semibold text-gray-900 dark:text-white text-xs uppercase tracking-wider ${
                      align === "center"
                        ? "text-center"
                        : align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {renderFormattedCell(header)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {parsed.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
              >
                {row.map((cell, colIdx) => {
                  const align = parsed.alignments[colIdx] || "left"
                  return (
                    <td
                      key={colIdx}
                      className={`px-4 py-3 text-gray-700 dark:text-gray-300 leading-relaxed align-top ${
                        align === "center"
                          ? "text-center"
                          : align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {renderFormattedCell(cell)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
