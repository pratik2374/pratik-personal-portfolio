import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import ImagePickerField from '../ui/ImagePickerField'

const EMPTY = {
  name: '',
  tagline: '',
  bio: '',
  bioSnippet: '',
  avatar: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  socialLinks: [],
  stats: [
    { value: '+12', label: 'Years of\nExperience' },
    { value: '+46', label: 'Projects\nCompleted' },
    { value: '+20', label: 'Worldwide\nClients' },
  ],
  heroOrangeCard: 'Dynamic Animation,\nMotion Design',
  heroLimeCard: 'Framer, Figma,\nWordPress, ReactJs',
}

export default function SettingsForm() {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general')).then(snap => {
      if (snap.exists()) {
        const data = snap.data()
        setForm({
          ...EMPTY,
          ...data,
          stats: data.stats?.length ? data.stats : EMPTY.stats,
          socialLinks: data.socialLinks || [],
        })
      }
    })
  }, [])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const setStat = (index, key, value) => {
    const updated = [...form.stats]
    updated[index] = { ...updated[index], [key]: value }
    set('stats', updated)
  }

  const addSocialLink = () => {
    set('socialLinks', [...form.socialLinks, { label: '', url: '', icon: 'link' }])
  }

  const updateSocialLink = (index, key, value) => {
    const updated = [...form.socialLinks]
    updated[index] = { ...updated[index], [key]: value }
    set('socialLinks', updated)
  }

  const removeSocialLink = (index) => {
    set('socialLinks', form.socialLinks.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'general'), { ...form, updatedAt: serverTimestamp() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">

      {/* ── Profile ── */}
      <Section title="Profile">
        <Field label="Name">
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required className={input} />
        </Field>
        <Field label="Bio Snippet (shown on profile card)">
          <input type="text" value={form.bioSnippet} onChange={e => set('bioSnippet', e.target.value)} className={input} placeholder="A Software Engineer who has developed countless innovative solutions." />
        </Field>
        <Field label="Profile Avatar URL or Upload">
          <ImagePickerField value={form.avatar} onChange={v => set('avatar', v)} folder="avatars" />
          <input type="url" value={form.avatar} onChange={e => set('avatar', e.target.value)}
            className={`${input} mt-2`} placeholder="Or paste image URL directly..." />
        </Field>
      </Section>

      {/* ── Hero Section ── */}
      <Section title="Hero Section">
        <Field label="Tagline (first word = white, rest = dark)">
          <input type="text" value={form.tagline} onChange={e => set('tagline', e.target.value)} className={input}
            placeholder="AI Engineer · LLMs · RAG · Generative AI · C++" />
        </Field>
        <Field label="Hero Bio">
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4}
            className={`${input} resize-none`} />
        </Field>
        <Field label="Orange Card Text">
          <textarea value={form.heroOrangeCard} onChange={e => set('heroOrangeCard', e.target.value)} rows={2}
            className={`${input} resize-none font-mono text-xs`} placeholder="Dynamic Animation,\nMotion Design" />
        </Field>
        <Field label="Lime Card Text">
          <textarea value={form.heroLimeCard} onChange={e => set('heroLimeCard', e.target.value)} rows={2}
            className={`${input} resize-none font-mono text-xs`} placeholder="Framer, Figma,\nWordPress, ReactJs" />
        </Field>
      </Section>

      {/* ── Stats ── */}
      <Section title="Stats (e.g. +12 Years of Experience)">
        <div className="space-y-3">
          {form.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field label={`Stat ${i + 1} — Value`}>
                <input type="text" value={stat.value} onChange={e => setStat(i, 'value', e.target.value)}
                  className={input} placeholder="+12" />
              </Field>
              <Field label="Label (use \\n for line break)">
                <input type="text" value={stat.label} onChange={e => setStat(i, 'label', e.target.value)}
                  className={input} placeholder="Years of\nExperience" />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Social Links ── */}
      <Section title="Social Links">
        <div className="space-y-3">
          <Field label="Email">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={input} />
          </Field>
          <Field label="GitHub URL">
            <input type="url" value={form.github} onChange={e => set('github', e.target.value)} className={input}
              placeholder="https://github.com/pratik2374" />
          </Field>
          <Field label="LinkedIn URL">
            <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} className={input}
              placeholder="https://linkedin.com/in/pratikgond" />
          </Field>
          <Field label="Twitter / X URL">
            <input type="url" value={form.twitter} onChange={e => set('twitter', e.target.value)} className={input}
              placeholder="https://twitter.com/yourhandle" />
          </Field>
        </div>

        {/* Custom Social Links */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-mid mb-3">Additional social links (any platform)</p>
          <div className="space-y-3">
            {form.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => updateSocialLink(i, 'label', e.target.value)}
                    className={input}
                    placeholder="Label (e.g. Instagram)"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => updateSocialLink(i, 'url', e.target.value)}
                    className={input}
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(i)}
                  className="mt-0.5 text-red-400/60 hover:text-red-400 text-sm transition-colors shrink-0 w-8 h-9 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSocialLink}
            className="mt-3 px-4 py-2 border border-white/10 text-gray-mid text-xs rounded-lg hover:border-white/20 hover:text-white transition-colors"
          >
            + Add Social Link
          </button>
        </div>
      </Section>

      {/* ── Save ── */}
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="text-accent-lime text-sm font-medium">Saved ✓</span>}
      </div>
    </form>
  )
}

const input = 'w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50'

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs text-gray-dark uppercase tracking-widest mb-4 pb-2 border-b border-white/5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
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
