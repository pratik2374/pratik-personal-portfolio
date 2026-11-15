import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { settings } from '../../data/settings'

export default function Hero() {
  return (
    <section className="mb-16 sm:mb-24 flex flex-col gap-6 sm:gap-8">
      {/* Dominant Headline */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col"
      >
        <h1 className="font-poppins font-black text-[46px] xs:text-[52px] sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.88] tracking-tighter text-white uppercase break-words sm:whitespace-nowrap">
          AI · SOFTWARE
        </h1>
        <h1 className="font-poppins font-black text-[46px] xs:text-[52px] sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.88] tracking-tighter text-white uppercase break-words sm:whitespace-nowrap mt-1">
          ENGINEER
        </h1>
        <h2 className="font-poppins font-black text-[26px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-[68px] leading-[0.92] sm:leading-[0.9] tracking-tighter text-[#2a2624] uppercase whitespace-pre-line mt-3 sm:mt-2">
          {settings.tagline}
        </h2>
      </motion.div>

      {/* Bio */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="text-gray-mid text-sm sm:text-base md:text-lg font-inter max-w-2xl leading-relaxed"
      >
        {settings.bio}
      </motion.p>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 sm:pt-4 pb-6 sm:pb-8 border-b border-white/5"
      >
        {settings.stats.map((stat, i) => (
          <div key={i} className="pr-1">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-1">
              {stat.value}
            </h2>
            <p className="text-gray-dark text-[10px] sm:text-xs font-semibold tracking-wider uppercase leading-tight sm:leading-snug">
              {stat.label.split('\n').map((line, j) => (
                <span key={j}>{line}{j < stat.label.split('\n').length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Identical Height Highlight Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-stretch"
      >
        {/* Orange Card → Experience */}
        <Link 
          to="/experience" 
          aria-label="View Experience"
          className="bg-accent-orange rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:-translate-y-1 active:scale-[0.98] transition-[transform,box-shadow] duration-150 ease-out block cursor-pointer shadow-lg h-[160px] sm:h-[180px] flex flex-col justify-between"
        >
          {/* Top Icon Circle */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
               <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
             </svg>
          </div>

          {/* Title */}
          <h3 className="font-poppins font-bold text-white text-lg sm:text-xl uppercase leading-tight pr-8">
            {settings.heroOrangeCard.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h3>

          {/* Corner Arrow Indicator */}
          <div className="absolute bottom-4 right-4 text-white opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </Link>

        {/* Lime Card → Projects */}
        <Link 
          to="/projects" 
          aria-label="View Projects"
          className="bg-accent-lime rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:-translate-y-1 active:scale-[0.98] transition-[transform,box-shadow] duration-150 ease-out block cursor-pointer shadow-lg h-[160px] sm:h-[180px] flex flex-col justify-between"
        >
          {/* SVG background zig-zag lines */}
          <svg className="absolute inset-0 w-full h-full text-black/10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 100">
             <path d="M0 50 L 50 10 L 100 90 L 150 10 L 200 50" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* Top Icon Circle */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 border border-black/20 rounded-full flex items-center justify-center shrink-0 relative z-10">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
             </svg>
          </div>

          {/* Title */}
          <h3 className="font-poppins font-bold text-bg text-lg sm:text-xl uppercase leading-tight relative z-10 pr-8">
            {settings.heroLimeCard.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h3>

          {/* Corner Arrow Indicator */}
          <div className="absolute bottom-4 right-4 text-bg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
