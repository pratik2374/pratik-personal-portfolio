import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const NAV = [
  { to: '/',           label: 'Home',       Icon: HomeIcon },
  { to: '/projects',   label: 'Projects',   Icon: FolderIcon },
  { to: '/experience', label: 'Experience', Icon: BriefcaseIcon },
  { to: '/tools',      label: 'Tools',      Icon: WrenchIcon },
  { to: '/blog',       label: 'Thoughts',   Icon: PencilIcon },
]

// Snap exit — fast ease-in collapse (the "snap" moment)
const SNAP = { duration: 0.18, ease: [0.55, 0, 1, 0.45] }
// Spring expand — slightly overshoots to feel alive
const EXPAND = { type: 'spring', stiffness: 520, damping: 32, mass: 0.7 }
// Item stagger spring
const ITEM_S = { type: 'spring', stiffness: 420, damping: 30 }

const PILL_BG   = 'rgba(15, 13, 12, 0.97)'
const PILL_RING = '0 0 0 1px rgba(255,255,255,0.055)'

export default function FloatingNav() {
  const location  = useLocation()
  const [hovered, setHovered] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [visibleSection, setVisibleSection] = useState(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Section-awareness: only runs on Home (/), where sections are embedded.
  // Tracks which section's top has most recently passed 40% down the viewport.
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

  const active = (to) => {
    if (visibleSection) {
      const id = to === '/' ? 'home' : to.slice(1)
      return visibleSection === id
    }
    return to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!scrolled ? (
        /* ── HORIZONTAL (top) ─────────────────────────────────── */
        <motion.nav
          key="h"
          /* Squish vertically to a thin line on exit, expand from line on enter */
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: 1, opacity: 1,
            transition: { ...EXPAND, delay: 0.04 },
          }}
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
          className="flex flex-row items-center gap-5 px-7 py-3.5
            backdrop-blur-2xl rounded-2xl
            border border-white/[0.055]"
        >
          {NAV.map(({ to, label, Icon }, i) => (
            <motion.div
              key={to}
              /* Items stagger in after container snaps open */
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { ...ITEM_S, delay: 0.1 + i * 0.05 } }}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <NavLink
                to={to} end={to === '/'}
                className={`flex items-center justify-center w-10 h-10 rounded-xl
                  transition-colors duration-200
                  ${active(to) ? 'text-accent-orange' : 'text-[#6e6666] hover:text-white'}`}
              >
                <span className="w-5 h-5 block pointer-events-none"><Icon /></span>
              </NavLink>

              {/* Tooltip — below */}
              <AnimatePresence>
                {hovered === i && (
                  <motion.span
                    initial={{ opacity: 0, y: 7, scale: 0.84 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.88 }}
                    transition={{ duration: 0.13, ease: [0, 0, 0.2, 1] }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2
                      bg-[#1b1918] border border-white/[0.07]
                      text-white text-[10px] uppercase tracking-[0.14em] font-semibold
                      px-3 py-1.5 rounded-xl font-poppins pointer-events-none whitespace-nowrap
                      shadow-none"
                  >
                    {/* Triangle pointing up */}
                    <span aria-hidden style={{
                      position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%)',
                      width:0, height:0,
                      borderLeft:'5px solid transparent',
                      borderRight:'5px solid transparent',
                      borderBottom:'5px solid #1b1918',
                    }} />
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.nav>
      ) : (
        /* ── VERTICAL (left) ──────────────────────────────────── */
        <motion.nav
          key="v"
          /* Collapse horizontally to a thin line on exit, expand from line on enter */
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1, opacity: 1,
            transition: { ...EXPAND, delay: 0.04 },
          }}
          exit={{ scaleX: 0, opacity: 0, transition: SNAP }}
          style={{
            position: 'fixed',
            top: '50%',
            left: 20,
            translateY: '-50%',
            originX: '0%',   /* expands rightward from the left wall */
            zIndex: 50,
            background: PILL_BG,
            boxShadow: PILL_RING,
          }}
          className="flex flex-col items-center gap-2 p-3
            backdrop-blur-2xl rounded-[26px]
            border border-white/[0.055]"
        >
          {NAV.map(({ to, label, Icon }, i) => (
            <motion.div
              key={to}
              /* Items stagger in after container snaps open */
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { ...ITEM_S, delay: 0.1 + i * 0.055 } }}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-[18px]"
                whileHover={{ scale: 1.11 }}
                whileTap={{ scale: 0.89 }}
                transition={{ type: 'spring', stiffness: 580, damping: 26 }}
              >
                {/* NavLink fills the full 48px hit area — icon is small inside */}
                <NavLink
                  to={to} end={to === '/'}
                  className={`flex items-center justify-center w-12 h-12 rounded-[18px]
                    transition-colors duration-200
                    ${active(to) ? 'text-accent-orange' : 'text-[#6e6666] hover:text-white'}`}
                >
                  <span className="w-5 h-5 block pointer-events-none"><Icon /></span>
                </NavLink>
              </motion.div>

              {/* Tooltip — right */}
              <AnimatePresence>
                {hovered === i && (
                  <motion.span
                    initial={{ opacity: 0, x: -10, scale: 0.84 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -7, scale: 0.88 }}
                    transition={{ type: 'spring', stiffness: 480, damping: 30 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4
                      bg-[#1b1918] border border-white/[0.07]
                      text-white text-[10px] uppercase tracking-[0.14em] font-semibold
                      px-3 py-1.5 rounded-xl font-poppins pointer-events-none whitespace-nowrap
                      shadow-none"
                  >
                    {/* Triangle pointing left */}
                    <span aria-hidden style={{
                      position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)',
                      width:0, height:0,
                      borderTop:'5px solid transparent',
                      borderBottom:'5px solid transparent',
                      borderRight:'5px solid #1b1918',
                    }} />
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
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
