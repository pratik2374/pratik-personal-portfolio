import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'

export default function BlogPost() {
  const { slug } = useParams()
  const { doc: post, loading, error } = useDocumentBySlug('blog', slug)

  const date = post?.date?.toDate
    ? post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : post?.date

  if (loading) return <div className="mb-24 pt-12 sm:pt-0 text-gray-mid">Loading...</div>
  if (error || !post) return (
    <div className="mb-24 pt-12 sm:pt-0">
      <p className="text-gray-mid mb-4">Post not found.</p>
      <Link to="/blog" className="text-accent-orange hover:underline">← Back to Blog</Link>
    </div>
  )

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      {post.image && (
        <div className="w-full aspect-[21/9] sm:h-[400px] rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex justify-between items-center text-[13px] text-[#666666] font-inter mb-6">
        <span>{date}</span>
        <span>{post.readTime || '6min read'}</span>
      </div>

      <h1 className="font-poppins font-bold text-4xl sm:text-[44px] leading-[1.2] text-white mb-10 tracking-tight">
        {post.title}
      </h1>

      <div className="prose prose-invert prose-lg max-w-none text-[#888888] font-inter leading-[1.8] text-[15px] sm:text-base
        prose-headings:font-poppins prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
        prose-h2:text-3xl prose-h3:text-2xl
        prose-p:mb-6
        prose-a:text-accent-orange prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent-orange prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-[#2d2a29] prose-pre:border prose-pre:border-white/10 mb-24">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <ContactForm />
    </article>
  )
}
