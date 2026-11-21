import { Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import { SettingsProvider } from './context/SettingsContext'
import ScrollToTop from './components/layout/ScrollToTop'
import FloatingNav from './components/layout/FloatingNav'
import ProfileSidebar from './components/layout/ProfileSidebar'
import Footer from './components/layout/Footer'
import { BlogHomeRedirect, BlogPostRedirect } from './components/layout/ExternalRedirect'
import { DetailSkeleton, ListPageSkeleton } from './components/ui/Skeleton'
import Home from './pages/Home'
import { Pages, preloadAllPagesWhenIdle } from './routes'
import { purgeLegacyCache } from './lib/content'

function page(Component, fallback) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  )
}

const PAGE_ENTER = { duration: 0.26, ease: [0.16, 1, 0.3, 1] }

/**
 * Route transition: each new page (or its skeleton) fades up 10px. Enter-only,
 * so navigation is never held back waiting for the old page to animate out and
 * ScrollToTop can jump to the top immediately. The very first page paints
 * without animating. MotionConfig reducedMotion="user" drops the slide.
 */
function PageTransition({ children }) {
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])

  return (
    <motion.div
      key={pathname}
      initial={firstRender.current ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={PAGE_ENTER}
    >
      {children}
    </motion.div>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-bg text-white relative font-inter">
      <FloatingNav />
      {/* Bottom padding clears the floating dock (phones/tablets) plus the iPhone home indicator. */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 md:pt-28 pb-[calc(7rem+env(safe-area-inset-bottom))] flex flex-col lg:flex-row gap-8 sm:gap-12 relative">
        <aside className="w-full lg:w-[350px] shrink-0 z-10">
          <div className="lg:sticky lg:top-24">
            <ProfileSidebar />
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={page(Pages.projects, <ListPageSkeleton variant="projects" />)} />
              <Route path="/projects/:slug" element={page(Pages.projectDetail, <DetailSkeleton />)} />
              <Route path="/experience" element={page(Pages.experience, <ListPageSkeleton variant="experience" />)} />
              <Route path="/experience/:slug" element={page(Pages.experienceDetail, <DetailSkeleton />)} />
              <Route path="/tools" element={page(Pages.tools, <ListPageSkeleton variant="tools" />)} />
              {/* The blog lives on its own site now. */}
              <Route path="/blog" element={<BlogHomeRedirect />} />
              <Route path="/blog/:slug" element={<BlogPostRedirect />} />
              <Route path="*" element={page(Pages.notFound, null)} />
            </Routes>
          </PageTransition>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    purgeLegacyCache()
    preloadAllPagesWhenIdle()
  }, [])

  return (
    <SettingsProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </MotionConfig>
    </SettingsProvider>
  )
}
