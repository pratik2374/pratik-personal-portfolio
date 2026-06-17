import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import ImagePickerField from '../ui/ImagePickerField'
import SlugInput from '../ui/SlugInput'
import TopBar from '../layout/TopBar'
import { slugify } from '../../utils/slugify'

const EMPTY = { companyName: '', role: '', slug: '', status: 'draft', link: '', description: '', date: '', image: '', video: '', gallery: [], order: 1 }

export default function ExperienceForm({ isEdit }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add, update, getById } = useCollection('experience')
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit && id) getById(id).then(doc => { if (doc) setForm({ ...EMPTY, ...doc }) })
  }, [isEdit, id])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleNameChange = (e) => {
    const companyName = e.target.value
    setForm(prev => ({ ...prev, companyName, slug: isEdit ? prev.slug : slugify(companyName) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { id: _, ...data } = form
      if (isEdit) await update(id, { ...data, order: Number(data.order) })
      else await add({ ...data, order: Number(data.order) })
      navigate('/experience')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title={isEdit ? 'Edit Experience' : 'New Experience'} />
      <div className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Company Name">
            <input type="text" value={form.companyName} onChange={handleNameChange} required
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50" />
          </Field>
          <Field label="Role Title (e.g. Senior Software Engineer)">
            <input type="text" value={form.role || ''} onChange={e => set('role', e.target.value)} required
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="e.g. Senior Software Engineer" />
          </Field>
          <SlugInput value={form.slug} onChange={v => set('slug', v)} />
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50">
              <option value="draft">Draft</option>
              <option value="live">Live</option>
            </select>
          </Field>
          <Field label="Date (e.g. Apr 2025 – Mar 2026)">
            <input type="text" value={form.date} onChange={e => set('date', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="Apr 2025 – Mar 2026" />
          </Field>
          <Field label="Link (company or project URL)">
            <input type="url" value={form.link} onChange={e => set('link', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="https://..." />
          </Field>
          <Field label="Video Demo Link (YouTube, Vimeo, Loom, or direct video URL)">
            <input type="url" value={form.video || ''} onChange={e => set('video', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL" />
          </Field>
          <Field label="Cover Image / Company Logo">
            <ImagePickerField value={form.image || ''} onChange={v => set('image', v)} folder="experience" aspect="landscape" />
          </Field>
          <Field label="Gallery Images">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
              {(form.gallery || []).map((img, idx) => (
                <GalleryImageItem
                  key={idx}
                  img={img}
                  idx={idx}
                  onRemove={() => {
                    setForm(prev => ({
                      ...prev,
                      gallery: (prev.gallery || []).filter((_, i) => i !== idx)
                    }))
                  }}
                />
              ))}
              <ImagePickerField
                value=""
                onChange={(url) => {
                  if (url) {
                    setForm(prev => ({
                      ...prev,
                      gallery: [...(prev.gallery || []), url]
                    }))
                  }
                }}
                folder="experience/gallery"
                aspect="landscape"
              />
            </div>
            <p className="text-[10px] text-gray-dark">
              Add screenshots. Hover over an image to copy its URL for inline markdown embedding: <code>![left|Caption](url)</code> or <code>![right|Caption](url)</code>.
            </p>
          </Field>
          <Field label="Description (achievements, role details)">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={6}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50 resize-y"
              placeholder="• Shipped production RAG chatbot serving 500+ vendors daily..." />
          </Field>
          <Field label="Display Order (1 = first)">
            <input type="number" value={form.order} onChange={e => set('order', e.target.value)} min={1}
              className="w-24 bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
            </button>
            <button type="button" onClick={() => navigate('/experience')}
              className="px-6 py-2.5 border border-white/10 text-gray-mid text-sm rounded-lg hover:border-white/20 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-mid mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function GalleryImageItem({ img, idx, onRemove }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(img)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-[#151312]">
      <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1 bg-accent-lime text-bg text-[11px] font-poppins font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-poppins font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
