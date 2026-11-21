import { useSettings } from '../../hooks/useSettings'
import { CARD_MOTION } from './cardStyles'

function formatDate(date) {
  if (!date) return ''
  // Sanity `date` fields are plain YYYY-MM-DD; format in UTC so the day doesn't shift.
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

/** Article teaser that links out to the blog site. */
export default function BlogCard({ post }) {
  const { blogUrl } = useSettings()
  const dateStr = formatDate(post.date)
  const href = post.slug ? `${blogUrl}/blog/${post.slug}` : blogUrl

  return (
    <div className="w-full">
      <a
        href={href}
        className={`block group cursor-pointer -mx-3 px-3 py-3 rounded-2xl hover:bg-white/[0.03] ${CARD_MOTION} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange`}
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-poppins font-bold text-xl sm:text-[28px] text-white group-hover:text-accent-orange transition-colors duration-150 leading-tight max-w-xl min-w-0 break-words">
            {post.title}
          </h3>
          <div aria-hidden="true" className="text-accent-orange opacity-0 group-hover:opacity-100 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] transform group-hover:translate-x-1 group-hover:-translate-y-1 mt-2 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
        {post.summary && (
          <p className="text-[#888888] text-sm sm:text-[15px] font-inter leading-relaxed line-clamp-3 mb-6 max-w-2xl">
            {post.summary}
          </p>
        )}
        <div className="flex justify-between items-center text-[13px] text-[#666666] font-inter">
          {dateStr ? <time dateTime={post.date}>{dateStr}</time> : <span />}
          {post.readTime && <span>{post.readTime}</span>}
        </div>
      </a>
    </div>
  )
}
