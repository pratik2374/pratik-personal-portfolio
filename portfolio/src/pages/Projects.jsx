import { useCollection } from '../hooks/useCollection'
import ProjectCard from '../components/ui/ProjectCard'

export default function Projects() {
  const { data: projects, loading } = useCollection('projects')

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <div className="mb-8 sm:mb-12">
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
          ALL
        </h1>
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          PROJECTS
        </h1>
      </div>
      
      <div className="flex flex-col gap-2">
        {loading && projects.length === 0 ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3.5 sm:gap-6 p-3 sm:p-4 rounded-2xl animate-pulse">
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-xl bg-white/5" />
              <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                <div className="h-6 sm:h-7 bg-white/10 rounded-md w-2/3 mb-2" />
                <div className="h-4 bg-white/5 rounded-md w-4/5" />
              </div>
            </div>
          ))
        ) : (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  )
}
