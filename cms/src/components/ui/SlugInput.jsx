export default function SlugInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-mid mb-1.5">Slug</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-accent-lime/50"
        placeholder="auto-generated-from-title"
      />
      <p className="text-xs text-gray-dark mt-1">URL: /blog/{value || 'slug'}</p>
    </div>
  )
}
