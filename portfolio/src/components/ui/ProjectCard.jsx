import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { slugify } from '../../utils/slugify'

const MotionLink = motion(Link)

export default function ProjectCard({ project }) {
  const content = (
    <>
      <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl border border-white/10">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
             <span className="text-white/20 text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <h3 className="font-poppins font-bold text-xl sm:text-2xl text-white mb-1 group-hover:text-accent-orange transition-colors truncate">
          {project.title}
        </h3>
        <p className="text-gray-mid text-sm sm:text-base font-inter truncate">
          {project.description || 'Project details'}
        </p>
      </div>
      
      {/* Arrow Icon */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-accent-orange opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+4px)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
    </>
  )

  const cardClasses = "group relative flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
  
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  const projectSlug = project.slug || (project.title ? slugify(project.title) : '')

  if (projectSlug) {
    return (
      <MotionLink to={`/projects/${projectSlug}`} className={cardClasses} {...motionProps}>
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.div className={cardClasses} {...motionProps}>
      {content}
    </motion.div>
  )
}
