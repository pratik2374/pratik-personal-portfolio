import { Link } from 'react-router-dom'

// [overflow-wrap:anywhere] lets long URLs/tokens in CMS text wrap instead of widening the page on phones.
export const PROSE_CLASSES = `prose prose-invert prose-lg max-w-none min-w-0 [overflow-wrap:anywhere] text-[#888888] font-inter leading-[1.8] text-[15px] sm:text-base
  prose-headings:font-poppins prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
  prose-h2:text-3xl prose-h3:text-2xl
  prose-p:mb-6
  prose-a:text-accent-orange prose-a:no-underline hover:prose-a:underline
  prose-code:text-accent-orange prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
  prose-pre:bg-[#2d2a29] prose-pre:border prose-pre:border-white/10 prose-pre:overflow-x-auto prose-pre:[overflow-wrap:normal]
  prose-img:max-w-full prose-img:h-auto`

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2 min-h-[44px] -my-3 py-3 pr-2 text-sm text-[#998f8f] hover:text-accent-orange transition-colors mb-5">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      {children}
    </Link>
  )
}

export function DetailNotFound({ label, to, back }) {
  return (
    <div className="mb-24 pt-12 sm:pt-0">
      <p className="text-gray-mid mb-4">{label}</p>
      <Link to={to} className="inline-flex items-center min-h-[44px] text-accent-orange hover:underline">← {back}</Link>
    </div>
  )
}
