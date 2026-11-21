import type React from "react"
import { Table } from "lucide-react"
import { CopyButton } from "./CopyButton"
import { HScroll } from "./HScroll"

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

// Inline formatting: **bold**, *italic*, `code`, and $math$
function renderInlineText(text: string): React.ReactNode {
  if (!text) return null

  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$|→)/g
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
          className="text-orange-500 dark:text-orange-400 font-mono text-[11px] bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 rounded-md"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
      return (
        <span key={index} className="font-serif italic font-semibold text-orange-400">
          {part.slice(1, -1)}
        </span>
      )
    }
    if (part === "→") {
      return (
        <span key={index} className="text-gray-400 dark:text-gray-500 px-1 font-bold">
          →
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

// Renders cell with optional status pills for rating words (High, Low, Weak, etc.)
function renderCell(text: string, isFirstCol: boolean): React.ReactNode {
  if (!text) return null
  const trimmed = text.trim()

  if (!isFirstCol) {
    // Positive ratings: High, Strong, Excellent, Lowest latency
    if (/^(high|strong|excellent|lowest)(\s*\(.*?\))?$/i.test(trimmed)) {
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>{renderInlineText(text)}</span>
        </span>
      )
    }
    // Moderate ratings: Medium, Low, Low-Medium
    if (/^(medium|low|low[-–]medium)(\s*\(.*?\))?$/i.test(trimmed)) {
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{renderInlineText(text)}</span>
        </span>
      )
    }
    // Negative ratings: Weak, Poor, None
    if (/^(weak|poor|none)(\s*\(.*?\))?$/i.test(trimmed)) {
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-rose-500 dark:text-rose-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{renderInlineText(text)}</span>
        </span>
      )
    }
  }

  return renderInlineText(text)
}

const ALIGN_CLASS = { left: "text-left", center: "text-center", right: "text-right" } as const

/**
 * Renders a markdown pipe table from a code block. Server component: only the copy
 * button and the scroll-hint wrapper ship JavaScript.
 *
 * Layout notes:
 * - `not-prose` stops the typography plugin's table rules (zero first-cell padding,
 *   2em margins) from leaking in; that was what pushed the table flush-left with an
 *   empty band above the header.
 * - Backgrounds live on cells (not rows) so the sticky first column on narrow screens
 *   stays opaque and matches its row.
 */
export function MarkdownTable({ code }: MarkdownTableProps) {
  const parsed = parseMarkdownTable(code)
  if (!parsed) return null

  const columnCount = parsed.headers.length
  const lastRow = parsed.rows.length - 1

  return (
    <figure className="not-prose my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121213] shadow-sm">
      <figcaption className="flex items-center justify-between pl-4 pr-2 h-10 bg-gray-50 dark:bg-[#1b1b1c] border-b border-gray-200 dark:border-gray-800">
        <span className="flex items-center gap-2 text-orange-500 dark:text-orange-400 font-mono font-semibold tracking-wider text-[11px] uppercase">
          <Table className="w-3.5 h-3.5" aria-hidden="true" />
          Table
        </span>
        <CopyButton text={code} label="Copy table as Markdown" tone="auto" />
      </figcaption>

      <HScroll label="Table, scroll sideways to see more columns">
        <table className="w-full border-separate border-spacing-0 text-left text-[13px] md:text-sm">
          <thead>
            <tr>
              {parsed.headers.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3 align-bottom font-semibold text-[11px] md:text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 bg-gray-50/80 dark:bg-[#17171a] border-b border-gray-200 dark:border-gray-800 ${
                    ALIGN_CLASS[parsed.alignments[idx] || "left"]
                  } ${idx < columnCount - 1 ? "border-r border-r-gray-100 dark:border-r-gray-800/60" : ""} ${
                    idx === 0 ? "max-md:sticky max-md:left-0 max-md:z-10 max-md:bg-gray-50 max-md:dark:bg-[#17171a]" : "min-w-[10rem] md:min-w-[8rem]"
                  }`}
                >
                  {renderInlineText(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsed.rows.map((row, rowIdx) => {
              const zebra = rowIdx % 2 === 1
              const rowBg = zebra ? "bg-gray-50/70 dark:bg-[#151517]" : "bg-white dark:bg-[#121213]"
              return (
                <tr key={rowIdx} className="group/row">
                  {Array.from({ length: columnCount }, (_, colIdx) => {
                    const cell = row[colIdx] ?? ""
                    const isFirstCol = colIdx === 0
                    const CellTag = isFirstCol ? "th" : "td"
                    return (
                      <CellTag
                        key={colIdx}
                        scope={isFirstCol ? "row" : undefined}
                        className={`px-4 py-3 align-top leading-relaxed transition-colors duration-150 ${rowBg} group-hover/row:bg-orange-50 dark:group-hover/row:bg-[#1a1613] ${
                          rowIdx < lastRow ? "border-b border-gray-100 dark:border-gray-800/60" : ""
                        } ${colIdx < columnCount - 1 ? "border-r border-r-gray-100 dark:border-r-gray-800/40" : ""} ${
                          ALIGN_CLASS[parsed.alignments[colIdx] || "left"]
                        } ${
                          isFirstCol
                            ? "font-semibold text-gray-900 dark:text-white min-w-[8.5rem] max-md:max-w-[10rem] md:whitespace-nowrap max-md:sticky max-md:left-0 max-md:z-10 max-md:shadow-[1px_0_0_0_rgb(229_231_235)] max-md:dark:shadow-[1px_0_0_0_rgb(31_41_55)]"
                            : "text-gray-700 dark:text-gray-300 min-w-[10rem] md:min-w-[8rem]"
                        }`}
                      >
                        {renderCell(cell, isFirstCol)}
                      </CellTag>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </HScroll>
    </figure>
  )
}
