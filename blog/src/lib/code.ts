// Detection helpers for Portable Text code blocks. Kept outside "use client"
// modules so server components can call them.

const MERMAID_KEYWORDS = [
  "flowchart",
  "sequenceDiagram",
  "graph",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "mindmap",
  "timeline",
  "gitGraph",
]

/**
 * A block is a diagram when its language says so. Only when the editor left the
 * language empty do we sniff the source, and then the keyword must be followed by
 * whitespace or the end of the line, so code such as `pieces = []` or
 * `graph = build()` stays code.
 */
export function isMermaidCode(language?: string, code?: string): boolean {
  const lang = language?.trim().toLowerCase()
  if (lang === "mermaid") return true
  if (lang && lang !== "text" && lang !== "plaintext") return false
  const firstLine = code?.trim().split("\n")[0]?.trim() ?? ""
  return MERMAID_KEYWORDS.some((kw) => new RegExp(`^${kw}(\\s|$)`).test(firstLine))
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
