import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { MermaidDiagram } from "./MermaidDiagram"
import { MarkdownTable } from "./MarkdownTable"
import { CopyButton } from "./CopyButton"
import { isMarkdownTable, isMermaidCode } from "@/lib/code"

interface CodeBlockProps {
  language?: string
  code: string
  filename?: string
}

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  tsx: "TSX",
  jsx: "JSX",
  python: "Python",
  bash: "Bash",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  go: "Go",
  rust: "Rust",
  java: "Java",
  cpp: "C++",
  yaml: "YAML",
  markdown: "Markdown",
  text: "Text",
}

/**
 * Server component: highlighting happens at render time, so readers download
 * plain coloured HTML and only the tiny copy button ships as JavaScript.
 */
export function CodeBlock({ language, code, filename }: CodeBlockProps) {
  if (isMermaidCode(language, code)) {
    return <MermaidDiagram chart={code} />
  }

  const lang = language?.toLowerCase()
  if ((lang === "markdown" || !lang) && isMarkdownTable(code)) {
    return <MarkdownTable code={code} />
  }

  const label = filename || (lang ? LANGUAGE_LABELS[lang] || lang : "Code")

  return (
    <div className="not-prose my-8 rounded-2xl overflow-hidden border border-gray-800 bg-[#141414] text-sm shadow-sm">
      <div className="flex items-center justify-between pl-4 pr-2 bg-[#1e1e1e] border-b border-gray-800 text-xs font-mono h-10">
        <span className="text-orange-400 font-medium tracking-wider text-[11px] truncate">{label}</span>
        <CopyButton text={code} label="Copy code" />
      </div>
      <div className="overflow-x-auto overscroll-x-contain text-[13px] md:text-sm">
        <SyntaxHighlighter
          language={lang || "text"}
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
