import { useCollection } from '../hooks/useCollection'
import { useSettings } from '../hooks/useSettings'
import ProjectCard from '../components/ui/ProjectCard'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { ProjectListSkeleton } from '../components/ui/Skeleton'

export default function Projects() {
  const { headings } = useSettings()
  const { data: projects, loading } = useCollection('projects')

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <SectionHeading as="h1" text={headings.allProjects} />

      <div className="flex flex-col gap-2">
        {loading && projects.length === 0 ? (
          <ProjectListSkeleton count={4} />
        ) : (
          projects.map((project, i) => (
            <Reveal key={project.id} index={i}>
              <ProjectCard project={project} />
            </Reveal>
          ))
        )}
      </div>
    </div>
  )
}
