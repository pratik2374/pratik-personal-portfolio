import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'
import { urlFor } from '../lib/sanity'

// Helper to parse different video URL styles (YouTube, Vimeo, Loom, Direct Video URLs)
function getEmbedUrl(url) {
  if (!url) return null

  // YouTube Match
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const ytMatch = url.match(ytRegex)
  if (ytMatch) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` }
  }

  // Vimeo Match
  const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  // Loom Match
  const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/
  const loomMatch = url.match(loomRegex)
  if (loomMatch) {
    return { type: 'loom', url: `https://www.loom.com/embed/${loomMatch[1]}` }
  }

  // Fallback to direct video file URL (MP4, WebM, etc.)
  return { type: 'direct', url }
}

function VideoPlayer({ url, title }) {
  const embed = getEmbedUrl(url)
  if (!embed) return null

  if (embed.type === 'direct') {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
        <video
          src={embed.url}
          controls
          className="w-full h-full object-contain"
          playsInline
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
      <iframe
        src={embed.url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  )
}


export default function ProjectDetail() {
  const { slug } = useParams()
  const { doc: project, loading, error } = useDocumentBySlug('projects', slug)
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  // Lightbox keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (activeImageIndex === null || !project?.gallery) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImageIndex(null)
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % project.gallery.length)
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, project?.gallery])

  if (loading) return <div className="mb-24 pt-12 sm:pt-0 text-gray-mid">Loading...</div>

  if (error || !project) {
    return (
      <div className="mb-24 pt-12 sm:pt-0">
        <p className="text-gray-mid mb-4">Project not found.</p>
        <Link to="/projects" className="text-accent-orange hover:underline">← Back to Projects</Link>
      </div>
    )
  }

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      {/* Back Link */}
      <Link to="/projects" className="group inline-flex items-center gap-2 text-sm text-[#998f8f] hover:text-accent-orange transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Projects
      </Link>

      {/* Hero Media Section */}
      <div className="mb-8">
        {project.video ? (
          <VideoPlayer url={project.video} title={project.title} />
        ) : (
          project.image && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
                <img src={urlFor(project.image).url()} alt={project.title} className="w-full h-full object-cover" />
              </div>
          )
        )}
      </div>

      {/* Header details */}
      <h1 className="font-poppins font-bold text-4xl sm:text-5xl leading-[1.1] text-white tracking-tight mb-4">
        {project.title}
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6 mb-10">
        {/* Live Demo Link */}
        {(project.demo || project.link) && (
          <a
            href={project.demo || project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-lime text-bg text-sm font-poppins font-bold rounded-xl hover:bg-accent-lime/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Live Demo</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        )}

        {/* GitHub Link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-white text-sm font-poppins font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all bg-white/5 hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Source Code</span>
          </a>
        )}
      </div>

      {/* Description Content */}
      <div className="prose prose-invert prose-lg max-w-none text-[#888888] font-inter leading-[1.8] text-[15px] sm:text-base
        prose-headings:font-poppins prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
        prose-h2:text-3xl prose-h3:text-2xl
        prose-p:mb-6
        prose-a:text-accent-orange prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent-orange prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-[#2d2a29] prose-pre:border prose-pre:border-white/10 mb-16">
        {project.description ? (
          <PortableText value={project.description} />
        ) : (
          <p>No description provided.</p>
        )}
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="mb-20">
          <h2 className="font-poppins font-bold text-2xl text-white mb-6">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#1c1a19] cursor-pointer group relative"
              >
                <img
                  src={urlFor(img).url()}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && project?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-10 select-none"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageIndex(null)} />

            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 text-xl font-bold border border-white/10"
              title="Close (Esc)"
            >
              ✕
            </button>

            {/* Nav Prev */}
            {project.gallery.length > 1 && (
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length)}
                className="absolute left-4 sm:left-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 border border-white/10"
                title="Previous (Left Arrow)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            {/* Zoomed Image & Counter */}
            <motion.div
              key={activeImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-[85vh] z-40 flex flex-col items-center gap-4"
            >
              <img
                src={urlFor(project.gallery[activeImageIndex]).url()}
                alt={`${project.title} gallery zoomed ${activeImageIndex + 1}`}
                className="max-w-[90vw] max-h-[75vh] sm:max-h-[78vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none"
              />
              <span className="text-gray-mid text-sm font-medium font-poppins">
                {activeImageIndex + 1} / {project.gallery.length}
              </span>
            </motion.div>

            {/* Nav Next */}
            {project.gallery.length > 1 && (
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % project.gallery.length)}
                className="absolute right-4 sm:right-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 border border-white/10"
                title="Next (Right Arrow)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Contact Form */}
      <ContactForm />
    </article>
  )
}
