import { useSettingsContext } from '../../context/SettingsContext'
import { motion } from 'framer-motion'

export default function Hero() {
  const settings = useSettingsContext()

  return (
    <section className="mb-24 flex flex-col gap-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-poppins font-bold text-6xl sm:text-[80px] leading-[0.9] tracking-tighter text-white uppercase mb-2">
          {settings?.tagline?.split(' ')[0] || 'SOFTWARE'}
        </h1>
        <h1 className="font-poppins font-bold text-6xl sm:text-[80px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          {settings?.tagline?.split(' ').slice(1).join(' ') || 'ENGINEER'}
        </h1>
      </motion.div>

      {/* Bio */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="text-gray-mid text-lg font-inter max-w-2xl leading-relaxed"
      >
        {settings?.bio || 'Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products.'}
      </motion.p>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="grid grid-cols-3 gap-6 pt-4 pb-8 border-b border-white/5"
      >
        {(settings?.stats || [
          { value: '+12', label: 'Years of\nExperience' },
          { value: '+46', label: 'Projects\nCompleted' },
          { value: '+20', label: 'Worldwide\nClients' },
        ]).map((stat, i) => (
          <div key={i}>
            <h2 className="font-poppins font-bold text-5xl text-white mb-2">{stat.value}</h2>
            <p className="text-gray-dark text-xs font-semibold tracking-wider uppercase leading-snug">
              {stat.label.split('\n').map((line, j) => (
                <span key={j}>{line}{j < stat.label.split('\n').length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Colorful Highlight Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Orange Card */}
        <div className="bg-accent-orange rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-4 left-4 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <h3 className="font-poppins font-bold text-white text-xl uppercase mt-16 leading-tight">
            {(settings?.heroOrangeCard || 'Dynamic Animation,\nMotion Design').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h3>
          <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </div>

        {/* Lime Card */}
        <div className="bg-accent-lime rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          {/* SVG background zig-zag lines */}
          <svg className="absolute inset-0 w-full h-full text-black/10" preserveAspectRatio="none" viewBox="0 0 200 100">
             <path d="M0 50 L 50 10 L 100 90 L 150 10 L 200 50" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="absolute top-4 left-4 w-10 h-10 border border-black/20 rounded-full flex items-center justify-center relative z-10">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
          <h3 className="font-poppins font-bold text-bg text-xl uppercase mt-16 leading-tight relative z-10">
            {(settings?.heroLimeCard || 'Framer, Figma,\nWordPress, ReactJs').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h3>
          <div className="absolute bottom-4 right-4 text-bg opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
