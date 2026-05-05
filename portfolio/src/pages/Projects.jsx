import { useCollection } from '../hooks/useCollection'
import ProjectCard from '../components/ui/ProjectCard'

export default function Projects() {
  const { data: projects, loading } = useCollection('projects')

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-poppins font-bold text-4xl text-white mb-4">Projects</h1>
      <p className="text-gray-mid mb-12">Things I've built.</p>
      {loading ? (
        <p className="text-gray-mid">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
