import { getOptimizedImageUrl } from '../../lib/sanity'

export default function ToolCard({ tool }) {
  const iconUrl = getOptimizedImageUrl(tool.image, { width: 96, height: 96, fit: 'max' })

  const content = (
    <>
      {iconUrl ? (
        <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
          <img 
            src={iconUrl} 
            alt={tool.title || 'Tool icon'} 
            width="32"
            height="32"
            loading="lazy"
            decoding="async"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain" 
          />
        </div>
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
           <span className="text-white/20 text-xs">No Icon</span>
        </div>
      )}
      <div>
        <p className="font-poppins font-bold text-white text-base sm:text-lg group-hover:text-accent-orange transition-colors mb-1">
          {tool.title}
        </p>
        <p className="text-gray-mid font-inter text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </>
  )

  const cardClasses = "group flex flex-col p-4 sm:p-6 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all duration-300 h-full"

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
