import { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BUDGET_PLACEHOLDER = 'Select...'
const BUDGET_OPTIONS = ['< $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+']

// Must match firestore.rules (messages): anything larger is rejected server-side.
export const LIMITS = { name: 100, email: 200, budget: 50, message: 5000 }

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const EMPTY_FORM = { name: '', email: '', budget: '', message: '' }

/** Builds exactly the document the Firestore rules accept. */
export function buildMessageDoc(form, createdAt) {
  const doc = {
    name: form.name.trim().slice(0, LIMITS.name),
    email: form.email.trim().slice(0, LIMITS.email),
    message: form.message.trim().slice(0, LIMITS.message),
    createdAt,
  }
  if (form.budget) doc.budget = form.budget.slice(0, LIMITS.budget)
  return doc
}

// Firebase (~100 KB+) loads only when someone starts using the form.
let firebaseModules = null
function loadFirebase() {
  if (!firebaseModules) {
    firebaseModules = Promise.all([import('../../lib/firebase'), import('firebase/firestore')]).catch((err) => {
      firebaseModules = null
      throw err
    })
  }
  return firebaseModules
}

const inputClasses =
  'w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-orange transition-colors'
const labelClasses = 'block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1'

export default function ContactForm() {
  const ids = useId()
  const [form, setForm] = useState(EMPTY_FORM)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [senderName, setSenderName] = useState('')
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [activeOption, setActiveOption] = useState(0)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const timerRef = useRef(null)

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // Clear the toast timer when unmounting.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const scheduleIdle = (ms) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus('idle'), ms)
  }

  // Close dropdown on outside click.
  useEffect(() => {
    if (!budgetOpen) return
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setBudgetOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [budgetOpen])

  // Move focus to the active option while the listbox is open.
  useEffect(() => {
    if (budgetOpen) optionRefs.current[activeOption]?.focus()
  }, [budgetOpen, activeOption])

  const openBudget = () => {
    const selected = BUDGET_OPTIONS.indexOf(form.budget)
    setActiveOption(selected >= 0 ? selected : 0)
    setBudgetOpen(true)
  }

  const closeBudget = (refocus = true) => {
    setBudgetOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  const chooseBudget = (option) => {
    setForm((prev) => ({ ...prev, budget: option }))
    closeBudget()
  }

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openBudget()
    }
  }

  const onListKeyDown = (e) => {
    const last = BUDGET_OPTIONS.length - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveOption((i) => Math.min(i + 1, last))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveOption((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveOption(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveOption(last)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      chooseBudget(BUDGET_OPTIONS[activeOption])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeBudget()
    } else if (e.key === 'Tab') {
      closeBudget(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    // Bots fill hidden fields; pretend it worked and store nothing.
    if (honeypot) {
      setStatus('success')
      setForm(EMPTY_FORM)
      scheduleIdle(6000)
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const [{ db }, { collection, addDoc, serverTimestamp }] = await loadFirebase()
      const doc = buildMessageDoc(form, serverTimestamp())
      await addDoc(collection(db, 'messages'), doc)

      // The message is saved; the email notification is best-effort.
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          const { default: emailjs } = await import('@emailjs/browser')
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            { from_name: doc.name, from_email: doc.email, budget: doc.budget || 'Not specified', message: doc.message },
            EMAILJS_PUBLIC_KEY
          )
        } catch (emailErr) {
          console.warn('Message saved, but the email notification failed:', emailErr)
        }
      }

      setSenderName(doc.name.split(' ')[0])
      setStatus('success')
      setForm(EMPTY_FORM)
      scheduleIdle(6000)
    } catch (err) {
      console.error('Contact form error:', err)
      setErrorMsg('Something went wrong. Please try again, or email me directly.')
      setStatus('error')
      scheduleIdle(5000)
    }
  }

  const listboxId = `${ids}-budget-list`

  return (
    <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-white/5 relative">
      <div className="mb-8 sm:mb-12">
        <h2>
          <span className="block font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">LET'S WORK</span>
          <span className="block font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">TOGETHER</span>
        </h2>
      </div>

      {/* ─── Toast notifications ─── */}
      <div aria-live="polite" role="status">
        <AnimatePresence>
          {status === 'success' && (
            <Toast
              key="toast-success"
              tone="success"
              title={senderName ? `Got it, ${senderName}!` : 'Message sent!'}
              body="I'll get back to you within 24 hours."
              duration={6}
              onClose={() => setStatus('idle')}
            />
          )}
          {status === 'error' && (
            <Toast
              key="toast-error"
              tone="error"
              title="Couldn't send that"
              body={errorMsg}
              duration={5}
              onClose={() => setStatus('idle')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} onFocus={() => loadFirebase().catch(() => {})} className="space-y-6">
        {/* Honeypot: hidden from people and screen readers, filled by bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor={`${ids}-website`}>Website</label>
          <input
            id={`${ids}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`${ids}-name`} className={labelClasses}>Name</label>
            <input
              id={`${ids}-name`}
              name="name"
              required
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              placeholder="Your Name"
              className={inputClasses}
              value={form.name}
              onChange={update('name')}
            />
          </div>
          <div>
            <label htmlFor={`${ids}-email`} className={labelClasses}>Email</label>
            <input
              id={`${ids}-email`}
              name="email"
              required
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              placeholder="you@example.com"
              className={inputClasses}
              value={form.email}
              onChange={update('email')}
            />
          </div>
        </div>

        <div>
          <span id={`${ids}-budget-label`} className={labelClasses}>Budget</span>
          <div className="relative" ref={dropdownRef}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={budgetOpen}
              aria-controls={listboxId}
              aria-labelledby={`${ids}-budget-label ${ids}-budget-value`}
              onClick={() => (budgetOpen ? closeBudget(false) : openBudget())}
              onKeyDown={onTriggerKeyDown}
              className={`w-full min-h-[48px] bg-[#2d2a29] border rounded-lg px-4 py-3.5 text-base sm:text-sm text-left flex items-center justify-between transition-colors focus:outline-none focus-visible:border-accent-orange active:scale-[0.99] ${
                budgetOpen ? 'border-accent-orange text-white' : 'border-transparent text-white hover:border-white/10'
              }`}
            >
              <span id={`${ids}-budget-value`} className={form.budget ? 'text-white font-medium' : 'text-gray-400'}>
                {form.budget || BUDGET_PLACEHOLDER}
              </span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: budgetOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-mid shrink-0 ml-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.span>
            </button>

            <AnimatePresence>
              {budgetOpen && (
                <motion.ul
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={`${ids}-budget-label`}
                  onKeyDown={onListKeyDown}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#1c1a19] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl p-1.5"
                >
                  {BUDGET_OPTIONS.map((opt, i) => {
                    const isSelected = form.budget === opt
                    return (
                      <li
                        key={opt}
                        ref={(el) => (optionRefs.current[i] = el)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={i === activeOption ? 0 : -1}
                        onClick={() => chooseBudget(opt)}
                        onMouseEnter={() => setActiveOption(i)}
                        className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between cursor-pointer focus:outline-none active:scale-[0.98] ${
                          isSelected
                            ? 'bg-accent-orange/15 text-accent-orange font-semibold'
                            : i === activeOption
                              ? 'bg-white/5 text-white'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent-orange">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label htmlFor={`${ids}-message`} className={labelClasses}>Message</label>
          <textarea
            id={`${ids}-message`}
            name="message"
            required
            rows={4}
            maxLength={LIMITS.message}
            placeholder="Message"
            className={`${inputClasses} resize-none`}
            value={form.message}
            onChange={update('message')}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
          className="w-full min-h-[48px] bg-accent-orange text-white font-poppins font-semibold text-sm py-4 rounded-lg hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <span aria-hidden="true" className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Sending...
            </>
          ) : 'Submit'}
        </button>
      </form>
    </div>
  )
}

function Toast({ tone, title, body, duration, onClose }) {
  const isSuccess = tone === 'success'
  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 16, opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto max-w-[calc(100vw-32px)] sm:w-[320px] z-[9999]"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-[#191716] border border-white/[0.07]"
        style={{ borderLeft: `3px solid ${isSuccess ? '#802a08' : '#f87171'}` }}
      >
        <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
          <div className={`w-8 h-8 rounded-full ${isSuccess ? 'bg-accent-orange/10' : 'bg-red-400/10'} flex items-center justify-center shrink-0 mt-0.5`}>
            {isSuccess ? (
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f46c38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M20 6 L9 17 L4 12"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                />
              </svg>
            ) : (
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
                <motion.path d="M18 6 L6 18" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.25 }} />
                <motion.path d="M6 6 L18 18" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.25 }} />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-poppins font-semibold text-sm leading-snug">{title}</p>
            <p className={`text-[#6e6666] text-[11px] mt-1 leading-relaxed ${isSuccess ? '' : 'line-clamp-2'}`}>{body}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="text-[#3d3838] hover:text-white transition-colors shrink-0 mt-0.5"
          >
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Depleting progress bar */}
        <div className="px-5 pb-4">
          <div className="h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${isSuccess ? 'bg-accent-orange/50' : 'bg-red-400/50'} rounded-full`}
              style={{ originX: 0 }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
