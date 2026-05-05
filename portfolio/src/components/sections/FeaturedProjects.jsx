import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import ProjectCard from '../ui/ProjectCard'

export default function FeaturedProjects() {
  const { data: projects, loading } = useCollection('projects')

  if (loading) return null

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-poppins font-semibold text-2xl text-white">Projects</h2>
        <Link to="/projects" className="text-accent-lime text-sm hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.slice(0, 2).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
