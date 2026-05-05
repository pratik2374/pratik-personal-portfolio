import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import SlugInput from '../ui/SlugInput'
import TopBar from '../layout/TopBar'
import { slugify } from '../../utils/slugify'

const EMPTY = { companyName: '', slug: '', status: 'draft', link: '', description: '', date: '', order: 1 }

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
