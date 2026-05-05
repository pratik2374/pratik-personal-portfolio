export default function ToolCard({ tool }) {
  return (
    <a
      href={tool.link}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-white/5 hover:border-accent-lime/20 transition-all duration-300"
    >
      {tool.image && (
        <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
          <img src={tool.image} alt={tool.title} className="w-8 h-8 object-contain" />
        </div>
      )}
      <div>
        <p className="font-poppins font-medium text-white text-sm group-hover:text-accent-lime transition-colors">
          {tool.title}
        </p>
        <p className="text-gray-mid text-xs">{tool.description}</p>
      </div>
    </a>
  )
}
