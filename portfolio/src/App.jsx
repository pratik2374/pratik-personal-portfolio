import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import ScrollToTop from './components/layout/ScrollToTop'
import FloatingNav from './components/layout/FloatingNav'
import ProfileSidebar from './components/layout/ProfileSidebar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Tools from './pages/Tools'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-bg text-white relative font-inter">
          <FloatingNav />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col lg:flex-row gap-12 relative">
            <aside className="w-full lg:w-[350px] shrink-0 z-10">
              <div className="lg:sticky lg:top-24">
                <ProfileSidebar />
              </div>
            </aside>
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
              </Routes>
              <Footer />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  )
}
