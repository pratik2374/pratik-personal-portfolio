import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-accent-lime/20 transition-all duration-300">
      {project.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-poppins font-semibold text-lg text-white mb-2 group-hover:text-accent-lime transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-mid text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-accent-lime text-sm font-medium hover:underline"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}
