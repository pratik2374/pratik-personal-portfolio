import { motion } from 'framer-motion'

export default function ToolCard({ tool }) {
  const content = (
    <>
      {tool.image ? (
        <div className="w-12 h-12 mb-4 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
          <img src={tool.image} alt={tool.title} className="w-8 h-8 object-contain" />
        </div>
      ) : (
        <div className="w-12 h-12 mb-4 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
           <span className="text-white/20 text-xs">No Icon</span>
        </div>
      )}
      <div>
        <p className="font-poppins font-bold text-white text-lg group-hover:text-accent-lime transition-colors mb-1">
          {tool.title}
        </p>
        <p className="text-gray-mid font-inter text-sm line-clamp-2 leading-relaxed">{tool.description}</p>
      </div>
    </>
  )

  const cardClasses = "group flex flex-col p-6 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-300 h-full"

  if (tool.link) {
    return (
      <a href={tool.link} target="_blank" rel="noreferrer" className={cardClasses}>
        {content}
      </a>
    )
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  )
}
