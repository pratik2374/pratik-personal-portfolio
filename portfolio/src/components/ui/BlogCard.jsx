import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BlogCard({ post }) {
  const dateStr = new Date(post.createdAt?.toDate?.() || post.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link to={`/blog/${post.slug || post.id}`} className="block border-b border-white/5 pb-8 mb-8 group cursor-pointer last:border-0">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-poppins font-bold text-2xl sm:text-[28px] text-white group-hover:text-accent-orange transition-colors leading-tight max-w-xl">
            {post.title}
          </h3>
          <div className="text-accent-orange opacity-0 group-hover:opacity-100 transition-opacity mt-2 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
        <p className="text-[#888888] text-sm sm:text-[15px] font-inter leading-relaxed line-clamp-3 mb-6 max-w-2xl">
          {post.excerpt || post.summary || 'Read more about this topic in the full blog post.'}
        </p>
        <div className="flex justify-between items-center text-[13px] text-[#666666] font-inter">
          <span>{dateStr}</span>
          <span>{post.readTime || '6min read'}</span>
        </div>
      </Link>
    </motion.div>
  )
}
