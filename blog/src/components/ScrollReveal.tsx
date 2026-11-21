"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const STAGGER_MS = 60
const MAX_STAGGER_MS = 240

/**
 * Fades `[data-reveal]` elements up the first time they scroll into view.
 *
 * Anything already on screen when this runs is marked revealed *before* the
 * hiding CSS switches on (`.reveal-ready` on <html>), so above-the-fold content
 * never flashes invisible, and with JS off everything simply stays visible.
 * Elements entering together get a small stagger. Mount once (in the header).
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const reveal = (el: Element, delay = 0) => {
      ;(el as HTMLElement).style.setProperty("--reveal-delay", `${delay}ms`)
      el.setAttribute("data-revealed", "")
    }

    const io = new IntersectionObserver(
      (entries) => {
        let batch = 0
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.unobserve(entry.target)
          reveal(entry.target, Math.min(batch * STAGGER_MS, MAX_STAGGER_MS))
          batch++
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )

    const track = (el: Element) => {
      if (el.hasAttribute("data-revealed")) return
      const r = el.getBoundingClientRect()
      // Already visible (or above the viewport): show immediately, no animation.
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el)
      else if (r.bottom <= 0) reveal(el)
      else io.observe(el)
    }

    // Content that streams in or is filtered client-side (search, topic tabs).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches("[data-reveal]")) track(node)
          node.querySelectorAll?.("[data-reveal]").forEach(track)
        })
      }
    })

    // Touching server-rendered elements before React hydrates them causes hydration
    // mismatches, so the first scan waits until the page is idle. Nothing is hidden
    // until then (.reveal-ready is added only after the scan), so there is no flash.
    const start = () => {
      document.querySelectorAll("[data-reveal]").forEach(track)
      root.classList.add("reveal-ready")
      mo.observe(document.body, { childList: true, subtree: true })
    }
    const hydrated = root.classList.contains("reveal-ready")
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if (hydrated) start()
    else if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 1500 })
    else timeoutId = setTimeout(start, 600)

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
