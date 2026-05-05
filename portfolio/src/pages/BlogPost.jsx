import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'

export default function BlogPost() {
  const { slug } = useParams()
  const { doc: post, loading, error } = useDocumentBySlug('blog', slug)

  const date = post?.date?.toDate
    ? post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : post?.date

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-gray-mid">Loading...</div>
  if (error || !post) return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-gray-mid mb-4">Post not found.</p>
      <Link to="/blog" className="text-accent-lime hover:underline">← Back to Blog</Link>
    </div>
  )

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/blog" className="text-gray-mid text-sm hover:text-white mb-8 inline-block">
        ← Back to Blog
      </Link>
      {post.image && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gray-mid text-sm">{date}</span>
        {post.readTime && <span className="text-gray-dark text-sm">· {post.readTime}</span>}
      </div>
      <h1 className="font-poppins font-bold text-4xl text-white mb-6">{post.title}</h1>
      <div className="prose prose-invert prose-sm max-w-none text-gray-mid leading-relaxed
        prose-headings:font-poppins prose-headings:text-white
        prose-a:text-accent-lime prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent-lime prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-card prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
