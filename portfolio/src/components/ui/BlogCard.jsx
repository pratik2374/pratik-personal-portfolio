import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  const date = post.date?.toDate
    ? post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : post.date

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="flex gap-6 py-6 border-b border-white/5 hover:border-white/10 transition-colors">
        {post.image && (
          <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-mid">{date}</span>
            {post.readTime && (
              <span className="text-xs text-gray-dark">· {post.readTime}</span>
            )}
          </div>
          <h3 className="font-poppins font-semibold text-white group-hover:text-accent-lime transition-colors mb-1 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-gray-mid text-sm line-clamp-2">{post.summary}</p>
        </div>
      </div>
    </Link>
  )
}
