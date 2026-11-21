import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { preloadRoute } from '../../routes'
import { useSettings } from '../../hooks/useSettings'

// `section` is the matching section id on the home page (for scroll-spy).
const NAV = [
  { to: '/',           section: 'home',       label: 'Home',       Icon: HomeIcon },
  { to: '/projects',   section: 'projects',   label: 'Projects',   Icon: FolderIcon },
  { to: '/experience', section: 'experience', label: 'Experience', Icon: BriefcaseIcon },
  { to: '/tools',      section: 'tools',      label: 'Tools',      Icon: WrenchIcon },
  { external: true,    section: 'blog',       label: 'Blog',       Icon: PencilIcon }, // href = settings.blogUrl
]

/**
 * In-app items render a NavLink that preloads its page on intent; the blog
 * item is a plain link to the separate blog site.
 */
function NavTarget({ item, isActive, className, children }) {
  if (item.external) {
    return (
      <a href={item.href} aria-label={item.label} className={className}>
        {children}
      </a>
    )
  }
  const warm = () => preloadRoute(item.to)
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      onClick={(e) => {
        if (isActive) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
      className={className}
    >
      {children}
    </NavLink>
  )
}

// Transitions
const SNAP = { duration: 0.18, ease: [0.55, 0, 1, 0.45] }
const EXPAND = { type: 'spring', stiffness: 520, damping: 32, mass: 0.7 }
const ITEM_S = { type: 'spring', stiffness: 420, damping: 30 }
const DOCK_IN = { type: 'spring', stiffness: 460, damping: 34 }

const PILL_BG   = 'rgba(15, 13, 12, 0.95)'
const PILL_RING = '0 0 0 1px rgba(255,255,255,0.08)'

// Below 768px there's no room for a top bar: always the bottom dock.
const PHONE_QUERY = '(max-width: 767.98px)'
// The left rail needs a real gutter beside the 1152px content column
// (20px offset + 74px rail + breathing room). On narrower screens the rail
// would sit on top of the profile card, so those use the bottom dock instead.
const RAIL_QUERY = '(min-width: 1320px)'

function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia?.(query)
    if (!mql) return
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [query])
  return matches
}

function Tooltip({ side, label }) {
  const below = side === 'below'
  return (
    <motion.span
      aria-hidden="true"
      initial={below ? { opacity: 0, y: 7, scale: 0.84 } : { opacity: 0, x: -10, scale: 0.84 }}
      animate={below ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, x: 0, scale: 1 }}
      exit={below ? { opacity: 0, y: 5, scale: 0.88 } : { opacity: 0, x: -7, scale: 0.88 }}
      transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
      className={`absolute ${below ? 'top-full mt-4 left-1/2 -translate-x-1/2' : 'left-full top-1/2 -translate-y-1/2 ml-4'}
        bg-[#1b1918] border border-white/[0.07]
        text-white text-[10px] uppercase tracking-[0.14em] font-semibold
        px-3 py-1.5 rounded-xl font-poppins pointer-events-none whitespace-nowrap`}
    >
      <span
        aria-hidden
        style={
          below
            ? { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #1b1918' }
            : { position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #1b1918' }
        }
      />
      {label}
    </motion.span>
  )
}

export default function FloatingNav() {
  const location = useLocation()
  const { blogUrl } = useSettings()
  const [hovered, setHovered] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [visibleSection, setVisibleSection] = useState(null)
  const phone = useMediaQuery(PHONE_QUERY)
  const wide = useMediaQuery(RAIL_QUERY)

  const items = NAV.map((item) => (item.external ? { ...item, href: blogUrl } : item))

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Section-awareness on Home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setVisibleSection(null)
      return
    }

    const SECTION_IDS = ['home', 'projects', 'experience', 'tools', 'blog']

    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.4
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= trigger) current = id
      }
      setVisibleSection(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [location.pathname])

  const active = (item) => {
    if (visibleSection) return visibleSection === item.section
    if (!item.to) return false
    return item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  }

  // Tooltips follow both the pointer and keyboard focus.
  const tipProps = (i) => ({
    onMouseEnter: () => setHovered(i),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(i),
    onBlur: () => setHovered(null),
  })

  const mode = phone ? 'dock' : !scrolled ? 'top' : wide ? 'rail' : 'dock'

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode === 'dock' && (
        /* ── DOCK (bottom, thumb-friendly): phones always; tablets once scrolled ── */
        <motion.nav
          key="dock"
          aria-label="Main"
          initial={phone ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: DOCK_IN }}
          exit={{ y: 24, opacity: 0, transition: SNAP }}
          style={{
            position: 'fixed',
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            left: '50%',
            x: '-50%',
            zIndex: 50,
            background: PILL_BG,
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), ' + PILL_RING,
          }}
          className="flex flex-row items-center gap-1.5 px-3 py-2 min-[380px]:gap-2 min-[380px]:px-4
            backdrop-blur-2xl rounded-full border border-white/10"
        >
          {items.map((item) => {
            const { label, Icon } = item
            const isActive = active(item)
            return (
              <NavTarget
                key={label}
                item={item}
                isActive={isActive}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-full
                  transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.88]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange
                  ${isActive ? 'text-accent-orange bg-accent-orange/10' : 'text-[#888888] hover:text-white'}`}
              >
                <span className="w-5 h-5 block pointer-events-none">
                  <Icon />
                </span>
                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-accent-orange pointer-events-none" />
                )}
              </NavTarget>
            )
          })}
        </motion.nav>
      )}

      {mode === 'top' && (
        /* ── HORIZONTAL (top of page, 768px+) ─────────────────────────────── */
        <motion.nav
          key="h"
          aria-label="Main"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1, transition: { ...EXPAND, delay: 0.04 } }}
          exit={{ scaleY: 0, opacity: 0, transition: SNAP }}
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            translateX: '-50%',
            originY: '50%',
            zIndex: 50,
            background: PILL_BG,
            boxShadow: PILL_RING,
          }}
          className="flex flex-row items-center gap-4 px-6 py-3 backdrop-blur-2xl rounded-2xl border border-white/[0.055]"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { ...ITEM_S, delay: 0.1 + i * 0.05 } }}
              className="relative flex items-center justify-center"
              {...tipProps(i)}
            >
              <NavTarget
                item={item}
                isActive={active(item)}
                className={`flex items-center justify-center w-11 h-11 rounded-xl
                  transition-[transform,color] duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange
                  ${active(item) ? 'text-accent-orange' : 'text-[#6e6666] hover:text-white'}`}
              >
                <span className="w-5 h-5 block pointer-events-none"><item.Icon /></span>
              </NavTarget>
              <AnimatePresence>{hovered === i && <Tooltip side="below" label={item.label} />}</AnimatePresence>
            </motion.div>
          ))}
        </motion.nav>
      )}

      {mode === 'rail' && (
        /* ── VERTICAL (left rail, 1320px+ only) ───────────────────────────── */
        <motion.nav
          key="v"
          aria-label="Main"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1, transition: { ...EXPAND, delay: 0.04 } }}
          exit={{ scaleX: 0, opacity: 0, transition: SNAP }}
          style={{
            position: 'fixed',
            top: '50%',
            left: 20,
            translateY: '-50%',
            originX: '0%',
            zIndex: 50,
            background: PILL_BG,
            boxShadow: PILL_RING,
          }}
          className="flex flex-col items-center gap-2 p-3 backdrop-blur-2xl rounded-[26px] border border-white/[0.055]"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { ...ITEM_S, delay: 0.1 + i * 0.055 } }}
              className="relative flex items-center justify-center"
              {...tipProps(i)}
            >
              <NavTarget
                item={item}
                isActive={active(item)}
                className={`flex items-center justify-center w-12 h-12 rounded-[18px]
                  transition-[transform,color,background-color] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]
                  hover:scale-110 hover:bg-white/[0.04] active:scale-90
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange
                  ${active(item) ? 'text-accent-orange' : 'text-[#6e6666] hover:text-white'}`}
              >
                <span className="w-5 h-5 block pointer-events-none"><item.Icon /></span>
              </NavTarget>
              <AnimatePresence>{hovered === i && <Tooltip side="right" label={item.label} />}</AnimatePresence>
            </motion.div>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

/* ── Icons ─────────────────────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function FolderIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function BriefcaseIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
function WrenchIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
function PencilIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}
