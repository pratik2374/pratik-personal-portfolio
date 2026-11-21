import { useCollection } from '../../hooks/useCollection'
import ProjectCard from '../ui/ProjectCard'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { useSettings } from '../../hooks/useSettings'
import { ProjectListSkeleton } from '../ui/Skeleton'

export default function FeaturedProjects() {
  const { headings } = useSettings()
  const { data: projects, loading } = useCollection('projects')

  return (
    <section className="mb-16 sm:mb-24">
      <SectionHeading text={headings.projects} />

      {/* Projects List with Skeleton Fallback */}
      <div className="flex flex-col gap-2">
        {loading && projects.length === 0 ? (
          <ProjectListSkeleton count={3} />
        ) : (
          projects.map((project, i) => (
            <Reveal key={project.id} index={i}>
              <ProjectCard project={project} />
            </Reveal>
          ))
        )}
      </div>
    </section>
  )
}
