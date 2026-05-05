import { useSettingsContext } from '../../context/SettingsContext'

export default function Hero() {
  const settings = useSettingsContext()

  return (
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <div className="max-w-3xl">
        <p className="text-accent-lime text-sm font-medium tracking-widest uppercase mb-4">
          Available for opportunities
        </p>
        <h1 className="font-poppins font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
          {settings?.name ?? 'Pratik Gond'}
        </h1>
        <p className="text-gray-mid text-lg sm:text-xl mb-4 font-inter">
          {settings?.tagline ?? 'AI Engineer · LLMs · RAG · Generative AI · C++'}
        </p>
        <p className="text-gray-mid text-base leading-relaxed mb-10 max-w-2xl">
          {settings?.bio}
        </p>
        <div className="flex flex-wrap gap-4">
          {settings?.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-accent-lime text-bg font-poppins font-semibold text-sm rounded-full hover:bg-accent-lime/90 transition-colors"
            >
              LinkedIn
            </a>
          )}
          {settings?.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border border-white/20 text-white font-poppins font-medium text-sm rounded-full hover:border-white/40 transition-colors"
            >
              GitHub
            </a>
          )}
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="px-6 py-3 border border-white/20 text-white font-poppins font-medium text-sm rounded-full hover:border-white/40 transition-colors"
            >
              Email Me
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
