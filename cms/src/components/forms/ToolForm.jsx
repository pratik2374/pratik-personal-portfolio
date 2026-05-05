import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import ImageUploader from '../ui/ImageUploader'
import SlugInput from '../ui/SlugInput'
import TopBar from '../layout/TopBar'
import { slugify } from '../../utils/slugify'

const EMPTY = { title: '', slug: '', status: 'draft', description: '', image: '', link: '' }

export default function ToolForm({ isEdit }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add, update, getById } = useCollection('tools')
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit && id) getById(id).then(doc => { if (doc) setForm({ ...EMPTY, ...doc }) })
  }, [isEdit, id])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm(prev => ({ ...prev, title, slug: isEdit ? prev.slug : slugify(title) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { id: _, ...data } = form
      if (isEdit) await update(id, data)
      else await add(data)
      navigate('/tools')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title={isEdit ? 'Edit Tool' : 'New Tool'} />
      <div className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Title">
            <input type="text" value={form.title} onChange={handleTitleChange} required
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
          <Field label="Description (e.g. AI Assistant)">
            <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50" />
          </Field>
          <Field label="Logo Image">
            <ImageUploader value={form.image} onChange={v => set('image', v)} folder="tools" />
          </Field>
          <Field label="Official URL">
            <input type="url" value={form.link} onChange={e => set('link', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="https://..." />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Tool' : 'Create Tool'}
            </button>
            <button type="button" onClick={() => navigate('/tools')}
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
