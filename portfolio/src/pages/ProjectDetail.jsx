import { useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'
import SmartImage from '../components/ui/SmartImage'
import VideoPlayer from '../components/ui/VideoPlayer'
import Gallery from '../components/ui/Gallery'
import { DetailSkeleton } from '../components/ui/Skeleton'
import { BackLink, DetailNotFound, PROSE_CLASSES } from '../components/ui/DetailParts'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { doc: project, loading } = useDocumentBySlug('projects', slug)

  if (loading && !project) return <DetailSkeleton />
  if (!project) return <DetailNotFound label="Project not found." to="/projects" back="Back to Projects" />

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      <BackLink to="/projects">Back to Projects</BackLink>

      {/* Hero media */}
      <div className="mb-8">
        {project.video ? (
          <VideoPlayer url={project.video} title={project.title} />
        ) : (
          project.image && (
            <SmartImage
              image={project.image}
              width={1200}
              height={675}
              alt={project.image.alt || project.title}
              priority
              className="w-full aspect-video rounded-2xl border border-white/10 bg-[#1c1a19]"
            />
          )
        )}
      </div>

      <h1 className="font-poppins font-bold text-3xl sm:text-5xl leading-[1.1] text-white tracking-tight mb-4">
        {project.title}
      </h1>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-6 mb-10">
        {(project.demo || project.link) && (
          <a
            href={project.demo || project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-lime text-bg text-sm font-poppins font-bold rounded-xl hover:bg-accent-lime/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Live Demo</span>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        )}

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-white text-sm font-poppins font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all bg-white/5 hover:bg-white/10"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Source Code</span>
          </a>
        )}
      </div>

      <div className={`${PROSE_CLASSES} mb-16`}>
        {Array.isArray(project.description) && project.description.length > 0 ? (
          <PortableText value={project.description} />
        ) : typeof project.description === 'string' && project.description ? (
          <p>{project.description}</p>
        ) : (
          <p>No description provided.</p>
        )}
      </div>

      <Gallery images={project.gallery} title={project.title} />

      <ContactForm />
    </article>
  )
}
