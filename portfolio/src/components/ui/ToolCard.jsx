import SmartImage from './SmartImage'
import { CARD_MOTION } from './cardStyles'

const iconBox = 'w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-200 ease-out'

export default function ToolCard({ tool }) {
  const content = (
    <>
      <div className={iconBox}>
        <SmartImage
          image={tool.image}
          width={96}
          height={96}
          fit="max"
          placeholder={false}
          alt={tool.image?.alt || tool.title || 'Tool icon'}
          className="w-6 h-6 sm:w-8 sm:h-8"
          imgClassName="w-full h-full object-contain"
          fallback={<span className="text-white/20 text-xs">No Icon</span>}
        />
      </div>
      <div>
        <p className="font-poppins font-bold text-white text-base sm:text-lg group-hover:text-accent-orange transition-colors duration-150 mb-1 break-words">
          {tool.title}
        </p>
        {tool.description && (
          <p className="text-gray-mid font-inter text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        )}
      </div>
    </>
  )

  const cardClasses = `group flex flex-col p-4 sm:p-6 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/10 ${CARD_MOTION} h-full min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange`

  if (tool.link) {
    return (
      <a href={tool.link} target="_blank" rel="noreferrer" className={cardClasses}>
        {content}
      </a>
    )
  }

  return <div className={cardClasses}>{content}</div>
}
