import { useCollection } from '../../hooks/useCollection'
import ProjectCard from '../ui/ProjectCard'
import { motion } from 'framer-motion'

export default function FeaturedProjects() {
  const { data: projects, loading } = useCollection('projects')

  if (loading) return null

  return (
    <section className="mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
      >
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          RECENT
        </h2>
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          PROJECTS
        </h2>
      </motion.div>
      <div className="flex flex-col gap-2">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
