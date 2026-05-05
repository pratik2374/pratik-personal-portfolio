import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const EMPTY = { name: '', tagline: '', bio: '', email: '', github: '', linkedin: '' }

export default function SettingsForm() {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general'))
      .then(snap => { if (snap.exists()) setForm({ ...EMPTY, ...snap.data() }) })
  }, [])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'general'), { ...form, updatedAt: serverTimestamp() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label="Name">
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50" />
      </Field>
      <Field label="Tagline">
        <input type="text" value={form.tagline} onChange={e => set('tagline', e.target.value)}
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
          placeholder="AI Engineer · LLMs · RAG · Generative AI · C++" />
      </Field>
      <Field label="Bio">
        <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4}
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50 resize-none" />
      </Field>
      <Field label="Email">
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50" />
      </Field>
      <Field label="GitHub URL">
        <input type="url" value={form.github} onChange={e => set('github', e.target.value)}
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
          placeholder="https://github.com/pratik2374" />
      </Field>
      <Field label="LinkedIn URL">
        <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
          className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
          placeholder="https://linkedin.com/in/pratikgond" />
      </Field>
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="text-accent-lime text-sm">Saved ✓</span>}
      </div>
    </form>
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
