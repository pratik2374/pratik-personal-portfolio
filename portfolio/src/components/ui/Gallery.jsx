import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOptimizedImageUrl } from '../../lib/sanity'
import SmartImage from './SmartImage'

/** Thumbnail grid + accessible lightbox, shared by project and experience pages. */
export default function Gallery({ images, title, heading = 'Gallery' }) {
  const [activeIndex, setActiveIndex] = useState(null)
  if (!images || images.length === 0) return null

  return (
    <div className="mb-20">
      <h2 className="font-poppins font-bold text-2xl text-white mb-6">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={img.asset?._ref || idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Open ${title} image ${idx + 1} of ${images.length}`}
            className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#1c1a19] cursor-zoom-in group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange"
          >
            <SmartImage
              image={img}
              width={800}
              height={450}
              alt={img.alt || `${title} screenshot ${idx + 1}`}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        title={title}
        index={activeIndex}
        onChange={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  )
}

// Bottom corners on phones (clear of the image), vertically centred from 640px.
const sideButton = 'bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-auto'

const navButton =
  'absolute text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange'

export function Lightbox({ images, title, index, onChange, onClose }) {
  const open = index !== null && index !== undefined && images?.length > 0
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const count = images?.length || 0

  const prev = useCallback(() => onChange((i) => (i - 1 + count) % count), [onChange, count])
  const next = useCallback(() => onChange((i) => (i + 1) % count), [onChange, count])

  // Touch: swipe left/right to change image, swipe down to close.
  const touch = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const start = touch.current
    touch.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2 && count > 1) {
      if (dx < 0) next()
      else prev()
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      onClose()
    }
  }

  // Focus management + scroll lock while open.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && count > 1) next()
      else if (e.key === 'ArrowLeft' && count > 1) prev()
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, count, next, prev, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 sm:p-10 select-none touch-pan-y"
        >
          <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} aria-hidden="true" />

          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" style={{ top: 'calc(1rem + env(safe-area-inset-top))' }} className={`${navButton} right-4 sm:right-6 text-xl font-bold`}>
            <span aria-hidden="true">✕</span>
          </button>

          {count > 1 && (
            <button type="button" onClick={prev} aria-label="Previous image" className={`${navButton} ${sideButton} left-4 sm:left-8`}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-full max-h-[85vh] z-40 flex flex-col items-center gap-4"
          >
            <img
              src={getOptimizedImageUrl(images[index], { width: 1600, fit: 'max' })}
              alt={images[index]?.alt || `${title} image ${index + 1}`}
              decoding="async"
              draggable={false}
              className="max-w-[92vw] max-h-[70vh] sm:max-h-[78vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none"
            />
            <span className="text-gray-mid text-sm font-medium font-poppins" aria-live="polite">
              {index + 1} / {count}
            </span>
          </motion.div>

          {count > 1 && (
            <button type="button" onClick={next} aria-label="Next image" className={`${navButton} ${sideButton} right-4 sm:right-8`}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
