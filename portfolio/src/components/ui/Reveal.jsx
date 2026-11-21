import { useLayoutEffect, useRef, useState } from 'react'

const STAGGER_MS = 60
const MAX_STAGGER_STEPS = 6

/**
 * Fade-up on first scroll into view, once.
 *
 * Anything already on screen when the page mounts stays fully visible (no
 * flash of invisible content); only content below the fold is hidden and then
 * revealed. Pure CSS transition (opacity/transform), disabled entirely for
 * prefers-reduced-motion and when IntersectionObserver is unavailable.
 *
 * Wrap a card rather than putting this on the card itself, so the card's own
 * hover transform doesn't fight the reveal transform.
 */
export default function Reveal({ as: Tag = 'div', index = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [state, setState] = useState('idle') // idle → hidden → shown

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    // Measured before paint: on-screen content is never hidden.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const delay = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS
  const stateClass = state === 'hidden' ? 'reveal reveal-hidden' : state === 'shown' ? 'reveal' : ''

  return (
    <Tag
      ref={ref}
      className={`${stateClass} ${className}`.trim()}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
