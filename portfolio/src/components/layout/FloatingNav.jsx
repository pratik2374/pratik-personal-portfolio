import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const items = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/projects', label: 'Projects', icon: <FolderIcon /> },
  { to: '/experience', label: 'Experience', icon: <BriefcaseIcon /> },
  { to: '/tools', label: 'Tools', icon: <WrenchIcon /> },
  { to: '/blog', label: 'Thoughts', icon: <PencilIcon /> },
]

export default function FloatingNav() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {!isScrolled ? (
        <motion.div
          key="top-nav"
          initial={{ y: -100, x: "-50%", opacity: 0 }}
          animate={{ 
            y: 0, 
            x: "-50%",
            opacity: 1,
            backgroundColor: "rgba(28, 26, 25, 0.9)",
            scaleY: 1,
            scaleX: 1,
            transition: { duration: 0.25 }
          }}
          exit={{ 
            backgroundColor: ["rgba(28, 26, 25, 0.9)", "#f97316", "#f97316"],
            scaleY: [1, 0.05, 0.05],
            scaleX: [1, 1, 0],
            opacity: [1, 1, 0],
            transition: { duration: 0.25, ease: "easeInOut", times: [0, 0.5, 1] }
          }}
          className="fixed top-8 left-1/2 z-50 border border-white/5 backdrop-blur-md rounded-2xl flex flex-row gap-8 px-8 py-4 items-center justify-center"
        >
          {items.map(({ to, label, icon }, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div key={to} className="relative flex items-center justify-center">
                <NavLink
                  to={to}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={({ isActive }) =>
                    `relative flex items-center justify-center transition-colors duration-200 ${
                      isActive ? 'text-accent-orange' : 'text-gray-mid hover:text-white'
                    }`
                  }
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative z-10">{icon}</div>
                </NavLink>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full mt-5 left-1/2 -translate-x-1/2 bg-[#2d2a29] text-white text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg font-poppins pointer-events-none whitespace-nowrap z-50"
                    >
                      {label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      ) : (
        <motion.div
          key="left-nav"
          initial={{ 
            backgroundColor: "#f97316",
            scaleX: 0.05,
            scaleY: 0,
            y: "-50%",
            opacity: 0
          }}
          animate={{ 
            backgroundColor: ["#f97316", "#f97316", "rgba(28, 26, 25, 0.9)"],
            scaleY: [0, 1, 1],
            scaleX: [0.05, 0.05, 1],
            y: "-50%",
            opacity: [0, 1, 1],
            transition: { duration: 0.25, ease: "easeInOut", times: [0, 0.5, 1] }
          }}
          exit={{ 
            backgroundColor: ["rgba(28, 26, 25, 0.9)", "#f97316", "#f97316"],
            scaleX: [1, 0.05, 0.05],
            scaleY: [1, 1, 0],
            y: "-50%",
            opacity: [1, 1, 0],
            transition: { duration: 0.25, ease: "easeInOut", times: [0, 0.5, 1] }
          }}
          className="fixed top-1/2 left-4 sm:left-8 z-50 border border-white/5 backdrop-blur-md rounded-[32px] flex flex-col gap-8 px-4 py-8 items-center justify-center origin-left"
        >
          {items.map(({ to, label, icon }, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div key={to} className="relative flex items-center justify-center">
                <NavLink
                  to={to}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={({ isActive }) =>
                    `relative flex items-center justify-center transition-colors duration-200 ${
                      isActive ? 'text-accent-orange' : 'text-gray-mid hover:text-white'
                    }`
                  }
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative z-10">{icon}</div>
                </NavLink>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -5 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-full ml-5 top-1/2 -translate-y-1/2 bg-[#2d2a29] text-white text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg font-poppins pointer-events-none whitespace-nowrap z-50"
                    >
                      {label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  )
}
