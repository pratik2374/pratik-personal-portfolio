import { useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { motion, AnimatePresence } from 'framer-motion'

// ─── EmailJS Config ───
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', budget: 'Select...', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [senderName, setSenderName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      // Save to Firestore (viewable in CMS)
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp()
      })

      // Send email via EmailJS
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: form.name,
            from_email: form.email,
            budget: form.budget,
            message: form.message,
          },
          EMAILJS_PUBLIC_KEY
        )
        console.log('EmailJS result:', result)
      } else {
        console.warn('EmailJS not configured — skipping email send')
      }

      setSenderName(form.name.split(' ')[0])
      setStatus('success')
      setForm({ name: '', email: '', budget: 'Select...', message: '' })

      // Auto-dismiss success after 6 seconds
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      console.error('Contact form error:', err)
      setErrorMsg(err?.text || err?.message || 'Something went wrong. Please try again.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div className="mt-24 pt-12 border-t border-white/5 relative">
      <div className="mb-12">
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          LET'S WORK
        </h2>
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          TOGETHER
        </h2>
      </div>

      {/* ─── Toast Notifications ─── */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="toast-success"
            initial={{ y: 80, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-6 right-6 z-[9999] w-[320px]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#191716] border border-white/[0.07]"
              style={{ borderLeft: '3px solid #802a08' }}>
              <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
                {/* Icon with draw-on checkmark */}
                <div className="w-8 h-8 rounded-full bg-accent-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#f46c38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="M20 6 L9 17 L4 12"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.18, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-poppins font-semibold text-sm leading-snug">
                    {senderName ? `Got it, ${senderName}!` : 'Message sent!'}
                  </p>
                  <p className="text-[#6e6666] text-[11px] mt-1 leading-relaxed">
                    I'll get back to you within 24 hours.
                  </p>
                </div>

                <button
                  onClick={() => setStatus('idle')}
                  className="text-[#3d3838] hover:text-white transition-colors shrink-0 mt-0.5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Depleting progress bar — 6s linear */}
              <div className="px-5 pb-4">
                <div className="h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-orange/50 rounded-full"
                    style={{ originX: 0 }}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="toast-error"
            initial={{ y: 80, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-6 right-6 z-[9999] w-[320px]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#191716] border border-white/[0.07]"
              style={{ borderLeft: '3px solid #f87171' }}>
              <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
                <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
                    <motion.path d="M18 6 L6 18" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.25 }} />
                    <motion.path d="M6 6 L18 18" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2, duration: 0.25 }} />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-poppins font-semibold text-sm leading-snug">
                    Couldn't send that
                  </p>
                  <p className="text-[#6e6666] text-[11px] mt-1 leading-relaxed line-clamp-2">
                    {errorMsg || 'Something went wrong. Please try again.'}
                  </p>
                </div>

                <button
                  onClick={() => setStatus('idle')}
                  className="text-[#3d3838] hover:text-white transition-colors shrink-0 mt-0.5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="px-5 pb-4">
                <div className="h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-400/50 rounded-full"
                    style={{ originX: 0 }}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Name</label>
            <input 
              required
              type="text" 
              placeholder="Your Name"
              className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Email</label>
            <input 
              required
              type="email" 
              placeholder="you@example.com"
              className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Budget</label>
          <div className="relative">
            <select 
              className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors appearance-none"
              value={form.budget}
              onChange={e => setForm({...form, budget: e.target.value})}
            >
              <option>Select...</option>
              <option>$1k - $5k</option>
              <option>$5k - $10k</option>
              <option>$10k+</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-mid">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Message</label>
          <textarea 
            required
            rows={4}
            placeholder="Message"
            className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors resize-none"
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-accent-orange text-white font-poppins font-semibold text-sm py-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : 'Submit'}
        </button>
      </form>
    </div>
  )
}
