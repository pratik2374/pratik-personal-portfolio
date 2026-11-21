import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

/** "+46" → { prefix: "+", number: 46, suffix: "" }; null when there's no number to animate. */
export function parseStat(value) {
  const match = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(String(value ?? '').trim())
  if (!match) return null
  const [, prefix, digits, suffix] = match
  return { prefix, number: Number(digits), decimals: digits.split('.')[1]?.length || 0, suffix }
}

const DURATION_S = 0.8

/**
 * Counts a stat up from 0 the first time it scrolls into view. The final value
 * is always laid out (invisibly) underneath, so the width never changes while
 * counting, and screen readers only ever get the final value.
 */
export default function CountUp({ value, className = '' }) {
  const parsed = parseStat(value)
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [display, setDisplay] = useState(null) // null = show the final value

  useEffect(() => {
    const el = ref.current
    if (!parsed || reduce || !el || typeof IntersectionObserver === 'undefined') return

    let controls
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        setDisplay(0)
        controls = animate(0, parsed.number, {
          duration: DURATION_S,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => setDisplay(v),
          onComplete: () => setDisplay(null),
        })
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      controls?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce])

  if (!parsed) return <span className={className}>{value}</span>

  const shown =
    display === null
      ? value
      : `${parsed.prefix}${display.toFixed(parsed.decimals)}${parsed.suffix}`

  return (
    <span ref={ref} className={`relative inline-block tabular-nums ${className}`} aria-label={String(value)}>
      {/* Reserves the final width so nothing shifts while counting. */}
      <span aria-hidden="true" className="invisible">{value}</span>
      <span aria-hidden="true" className="absolute inset-0">{shown}</span>
    </span>
  )
}
