import { useCollection } from '../hooks/useCollection'
import ProjectCard from '../components/ui/ProjectCard'

export default function Projects() {
  const { data: projects, loading } = useCollection('projects')

  return (
    <div className="mb-24 pt-12 sm:pt-0">
      <div className="mb-12">
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          ALL
        </h1>
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          PROJECTS
        </h1>
      </div>
      
      {loading ? (
        <p className="text-gray-mid">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
