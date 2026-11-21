"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { Search, FileText, Hash, CornerDownLeft, ArrowUp, ArrowDown, X, Home, User, Mail, Rss } from "lucide-react"
import type { SearchIndex } from "@/app/api/search/route"

// ─── Index loading (once per page session, shared by every palette instance) ───

let indexPromise: Promise<SearchIndex> | null = null

export function loadSearchIndex(): Promise<SearchIndex> {
  if (!indexPromise) {
    indexPromise = fetch("/api/search")
      .then((r) => {
        if (!r.ok) throw new Error(`Search index failed: ${r.status}`)
        return r.json() as Promise<SearchIndex>
      })
      .catch((err) => {
        indexPromise = null // allow a retry on next open
        throw err
      })
  }
  return indexPromise
}

// ─── Ranking ───────────────────────────────────────────────────────────────

interface Item {
  id: string
  kind: "post" | "topic" | "page"
  title: string
  subtitle?: string
  href: string
  external?: boolean
  icon: ReactNode
  score: number
}

const QUICK_LINKS: Omit<Item, "score">[] = [
  { id: "page-home", kind: "page", title: "Home", subtitle: "All articles", href: "/", icon: <Home className="w-4 h-4" /> },
  { id: "page-about", kind: "page", title: "About", subtitle: "Who writes this blog", href: "/about", icon: <User className="w-4 h-4" /> },
  { id: "page-contact", kind: "page", title: "Contact", subtitle: "Get in touch", href: "/contact", icon: <Mail className="w-4 h-4" /> },
  { id: "page-rss", kind: "page", title: "RSS feed", subtitle: "Subscribe in your reader", href: "/feed.xml", external: true, icon: <Rss className="w-4 h-4" /> },
]

const norm = (s = "") => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")

/** Title prefix > title word > tag > topic > summary; every query word must match somewhere. */
function scoreText(tokens: string[], fields: { title: string; tags?: string[]; topic?: string; summary?: string }): number {
  const title = norm(fields.title)
  const titleWords = title.split(/[^\p{L}\p{N}]+/u)
  const tags = (fields.tags || []).map(norm)
  const topic = norm(fields.topic)
  const summary = norm(fields.summary)
  const full = tokens.join(" ")

  let score = title.startsWith(full) ? 120 : title.includes(full) ? 60 : 0
  for (const t of tokens) {
    let best = 0
    if (titleWords.some((w) => w.startsWith(t))) best = 40
    else if (title.includes(t)) best = 25
    else if (tags.some((tag) => tag.startsWith(t))) best = 20
    else if (tags.some((tag) => tag.includes(t))) best = 14
    else if (topic.includes(t)) best = 12
    else if (summary.includes(t)) best = 6
    if (best === 0) return 0
    score += best
  }
  return score
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi")
  const parts = text.split(pattern)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-orange-500/15 text-orange-600 dark:text-orange-300 rounded-sm px-0.5 -mx-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

// ─── Palette ───────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState<SearchIndex | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  // Load the index the first time the palette opens.
  useEffect(() => {
    if (!open || index) return
    let cancelled = false
    loadSearchIndex()
      .then((data) => !cancelled && setIndex(data))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [open, index])

  // Focus the input on open; lock page scroll while open.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const tokens = useMemo(() => norm(query).trim().split(/\s+/).filter(Boolean), [query])

  const groups = useMemo(() => {
    const posts: Item[] = []
    const topics: Item[] = []
    let pages: Item[] = []

    if (index) {
      for (const p of index.posts) {
        const score = tokens.length
          ? scoreText(tokens, { title: p.title, tags: p.tags, topic: p.category?.title, summary: p.summary })
          : 1
        if (score > 0) {
          posts.push({
            id: `post-${p.slug}`,
            kind: "post",
            title: p.title,
            subtitle: p.category?.title || p.summary,
            href: `/blog/${p.slug}`,
            icon: <FileText className="w-4 h-4" />,
            score,
          })
        }
      }
      for (const c of index.categories) {
        const score = tokens.length ? scoreText(tokens, { title: c.title, summary: c.description }) : 1
        if (score > 0) {
          topics.push({
            id: `topic-${c.slug}`,
            kind: "topic",
            title: c.title,
            subtitle: "Topic",
            href: `/category/${c.slug}`,
            icon: <Hash className="w-4 h-4" />,
            score,
          })
        }
      }
    }
    pages = QUICK_LINKS.map((q) => ({ ...q, score: tokens.length ? scoreText(tokens, { title: q.title, summary: q.subtitle }) : 1 })).filter(
      (q) => q.score > 0
    )

    const byScore = (a: Item, b: Item) => b.score - a.score
    return [
      { label: tokens.length ? "Articles" : "Latest articles", items: posts.sort(byScore).slice(0, tokens.length ? 8 : 5) },
      { label: "Topics", items: topics.sort(byScore).slice(0, 6) },
      { label: "Pages", items: pages.sort(byScore) },
    ].filter((g) => g.items.length > 0)
  }, [index, tokens])

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  // Keep the active row visible.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  const go = useCallback(
    (item: Item | undefined) => {
      if (!item) return
      onClose()
      setQuery("")
      if (item.external) window.location.href = item.href
      else router.push(item.href)
    },
    [onClose, router]
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
    } else if (e.key === "Home" && e.ctrlKey) {
      setActive(0)
    } else if (e.key === "End" && e.ctrlKey) {
      setActive(Math.max(0, flat.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      go(flat[active])
    } else if (e.key === "Tab") {
      // Focus trap: cycle between the focusable controls inside the dialog.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("input, button")
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!open || typeof document === "undefined") return null

  let running = -1
  const activeId = flat[active] ? `${listId}-${flat[active].id}` : undefined

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center sm:pt-[12vh] sm:px-4" onKeyDown={onKeyDown}>
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] motion-safe:animate-[palette-fade_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search articles and pages"
        className="relative w-full h-full sm:h-auto sm:max-w-xl flex flex-col bg-white dark:bg-[#151516] sm:rounded-2xl border-0 sm:border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden motion-safe:animate-[palette-in_180ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search articles, topics, pages…"
            className="flex-1 min-w-0 h-full bg-transparent text-base sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button
            type="button"
            onClick={onClose}
            className="relative shrink-0 flex items-center justify-center w-9 h-9 -mr-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors before:absolute before:-inset-1 before:content-['']"
            aria-label="Close search"
          >
            <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">ESC</kbd>
            <X className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        <div ref={listRef} id={listId} role="listbox" aria-label="Results" className="flex-1 sm:max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
          {!index && !loadError && (
            <div className="px-3 py-8 text-center text-sm text-gray-500" role="status">
              Loading…
            </div>
          )}
          {loadError && !index && (
            <div className="px-3 py-8 text-center text-sm text-gray-500" role="status">
              Search is unavailable right now. Try again in a moment.
            </div>
          )}
          {index && flat.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-gray-500" role="status">
              No results for “{query}”.
            </div>
          )}
          {groups.map((group) => (
            <div key={group.label} role="group" aria-label={group.label} className="mb-1 last:mb-0">
              <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400" aria-hidden="true">
                {group.label}
              </div>
              {group.items.map((item) => {
                running++
                const i = running
                const isActive = i === active
                return (
                  <div
                    key={item.id}
                    id={`${listId}-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    data-index={i}
                    onMouseMove={() => !isActive && setActive(i)}
                    onClick={() => go(item)}
                    className={`flex items-center gap-3 px-3 min-h-[48px] py-2 rounded-xl cursor-pointer transition-colors duration-100 ${
                      isActive ? "bg-orange-500/10 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                      } transition-colors duration-100`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">
                        <Highlight text={item.title} tokens={tokens} />
                      </span>
                      {item.subtitle && <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</span>}
                    </span>
                    {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 px-4 h-10 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 shrink-0" aria-hidden="true">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" />
            <ArrowDown className="w-3 h-3" /> to move
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> to open
          </span>
          <span>esc to close</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
