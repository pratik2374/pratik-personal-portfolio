export default function StatusBadge({ status, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        status === 'live'
          ? 'bg-accent-lime/15 text-accent-lime hover:bg-accent-lime/25'
          : 'bg-white/5 text-gray-mid hover:bg-white/10'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-accent-lime' : 'bg-gray-mid'}`} />
      {status === 'live' ? 'Live' : 'Draft'}
      <span className="ml-0.5 opacity-60">▾</span>
    </button>
  )
}
