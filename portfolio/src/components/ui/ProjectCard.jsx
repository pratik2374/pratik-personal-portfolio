import { Link } from 'react-router-dom'
import { slugify } from '../../utils/slugify'
import { preloadProps } from '../../routes'
import SmartImage from './SmartImage'
import { CARD_MOTION } from './cardStyles'

const cardClasses = `group relative flex items-center gap-3.5 sm:gap-6 p-3 sm:p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 active:bg-white/[0.08] ${CARD_MOTION} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange`

export default function ProjectCard({ project }) {
  const summary = project.descriptionText || 'Project details'

  const content = (
    <>
      <SmartImage
        image={project.image}
        width={240}
        height={240}
        alt={project.image?.alt || project.title || 'Project thumbnail'}
        className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-xl border border-white/10 bg-white/5"
        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        fallback={
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-white/20 text-xs">No Image</span>
          </div>
        }
      />
      <div className="flex-1 min-w-0 pr-6 sm:pr-8">
        <h3 className="font-poppins font-bold text-lg sm:text-2xl text-white mb-1 group-hover:text-accent-orange transition-colors truncate">
          {project.title}
        </h3>
        <p className="text-gray-mid text-xs sm:text-base font-inter line-clamp-1 sm:line-clamp-2">
          {summary}
        </p>
      </div>

      {/* Arrow icon - visible on mobile, hover-animated on desktop */}
      <div aria-hidden="true" className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-accent-orange opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+4px)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
    </>
  )

  const projectSlug = project.slug || (project.title ? slugify(project.title) : '')

  if (projectSlug) {
    const to = `/projects/${projectSlug}`
    return (
      <Link to={to} className={cardClasses} {...preloadProps(to)}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  )
}
