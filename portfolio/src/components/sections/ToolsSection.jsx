import { useCollection } from '../../hooks/useCollection'
import ToolCard from '../ui/ToolCard'
import { motion } from 'framer-motion'

export default function ToolsSection() {
  const { data: tools, loading } = useCollection('tools')

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
          PREMIUM
        </h2>
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          TOOLS
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tools.slice(0, 6).map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}
