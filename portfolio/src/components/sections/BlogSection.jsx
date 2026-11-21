import { useCollection } from '../../hooks/useCollection'
import BlogCard from '../ui/BlogCard'
import { BlogListSkeleton } from '../ui/Skeleton'
import { useSettings } from '../../hooks/useSettings'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

/** Picks up to 3 posts: ones pinned in the CMS first, then the newest. */
export function pickHomePosts(posts, limit = 3) {
  const all = posts || []
  const chosen = all.filter((p) => p.featuredInDesignThoughts === true || p.isFeatured === true)
  const rest = all.filter((p) => !chosen.includes(p))
  return [...chosen, ...rest].slice(0, limit)
}

export default function BlogSection() {
  const { headings, blogUrl } = useSettings()
  const { data: posts, loading } = useCollection('blog')
  const displayPosts = pickHomePosts(posts)

  return (
    <section className="mb-16 sm:mb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <SectionHeading text={headings.blog} className="" />

        {posts.length > 0 && (
          <a
            href={blogUrl}
            className="text-sm font-poppins font-semibold text-accent-orange hover:underline inline-flex items-center gap-1.5 min-h-[44px] pb-1 self-start sm:self-auto"
          >
            <span>{posts.length > 3 ? `View all (${posts.length})` : 'Visit the blog'}</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        )}
      </div>

      {loading && displayPosts.length === 0 ? (
        <BlogListSkeleton count={2} />
      ) : displayPosts.length > 0 ? (
        <div className="flex flex-col">
          {displayPosts.map((post, i) => (
            <Reveal key={post.id} index={i} className="border-b border-white/5 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-gray-mid text-sm font-inter">No blog posts published yet.</p>
      )}
    </section>
  )
}
