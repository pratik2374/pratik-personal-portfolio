export default function ExperienceCard({ experience }) {
  return (
    <div className="flex gap-6 py-6 border-b border-white/5 last:border-0">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-accent-lime mt-2 flex-shrink-0" />
        <div className="w-px flex-1 bg-white/10 mt-2" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
          <div>
            <h3 className="font-poppins font-semibold text-white">{experience.companyName}</h3>
            {experience.link && (
              <a
                href={experience.link}
                target="_blank"
                rel="noreferrer"
                className="text-accent-lime text-xs hover:underline"
              >
                {experience.link.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <span className="text-gray-mid text-sm flex-shrink-0">{experience.date}</span>
        </div>
        <p className="text-gray-mid text-sm leading-relaxed whitespace-pre-line">
          {experience.description}
        </p>
      </div>
    </div>
  )
}
