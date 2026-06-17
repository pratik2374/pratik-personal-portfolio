import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'

// Preprocessor to auto-parse raw image URLs into markdown image tags with optional float prefix
function preprocessDescription(text) {
  if (!text) return 'No content yet.'
  const rawImageRegex = /(?<!\()(?:(left|right)\s*\|\s*)?(https?:\/\/[^\s)]+\.(?:png|jpg|jpeg|gif|webp)(?:\?[^\s)]+)?)(?!\))/gi
  return text.replace(rawImageRegex, (match, align, url) => {
    const alignment = align || 'center'
    return `![${alignment}](${url})`
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const { doc: post, loading, error } = useDocumentBySlug('blog', slug)

  const date = post?.date?.toDate
    ? post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : post?.date

  // Dynamically update SEO meta tags & structured data
  useEffect(() => {
    if (!post) return

    // 1. Update document title
    document.title = `${post.title} | Pratik Gond`

    // 2. Update meta description (uses post summary or falls back to snippet of content)
    const excerpt = post.summary || (post.content ? post.content.substring(0, 155).replace(/[#*`\n]/g, ' ') : 'Design thought blog post by Pratik Gond.')
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', excerpt)

    // 3. Update Open Graph Tags (Facebook, LinkedIn, etc.)
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', post.title)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', excerpt)

    if (post.image) {
      let ogImage = document.querySelector('meta[property="og:image"]')
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.appendChild(ogImage)
      }
      ogImage.setAttribute('content', post.image)
    }

    // 4. Inject JSON-LD Schema Markup (BlogPosting) for Google Rich Snippets
    const existingScript = document.getElementById('blog-structured-data')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.id = 'blog-structured-data'
    script.type = 'application/ld+json'

    const datePublished = post.date?.toDate ? post.date.toDate().toISOString() : new Date().toISOString()

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.image || "",
      "datePublished": datePublished,
      "author": {
        "@type": "Person",
        "name": "Pratik Gond",
        "url": window.location.origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "Pratik Gond",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "description": excerpt
    }

    script.text = JSON.stringify(schema)
    document.head.appendChild(script)

    // Cleanup on unmount or post change
    return () => {
      const scriptToRemove = document.getElementById('blog-structured-data')
      if (scriptToRemove) scriptToRemove.remove()
    }
  }, [post])

  if (loading) return <div className="mb-24 pt-12 sm:pt-0 text-gray-mid">Loading...</div>
  if (error || !post) {
    return (
      <div className="mb-24 pt-12 sm:pt-0">
        <p className="text-gray-mid mb-4">Post not found.</p>
        <Link to="/blog" className="text-accent-orange hover:underline">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      {/* Back to Blog */}
      <Link to="/blog" className="group inline-flex items-center gap-2 text-sm text-[#998f8f] hover:text-accent-orange transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Blog
      </Link>

      {post.image && (
        <div className="w-full aspect-[21/9] sm:h-[400px] rounded-2xl overflow-hidden mb-8 border border-white/10">
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
        {/<[a-z][\s\S]*>/i.test(post.content || '') ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => {
                let align = 'center'
                let cleanAlt = props.alt || ''
                
                if (cleanAlt.startsWith('left|')) {
                  align = 'left'
                  cleanAlt = cleanAlt.substring(5)
                } else if (cleanAlt.startsWith('right|')) {
                  align = 'right'
                  cleanAlt = cleanAlt.substring(6)
                }

                const wrapperClasses = align === 'left'
                  ? 'sm:float-left sm:mr-6 my-4 max-w-full sm:max-w-[45%] block'
                  : align === 'right'
                  ? 'sm:float-right sm:ml-6 my-4 max-w-full sm:max-w-[45%] block'
                  : 'block my-8 max-w-3xl mx-auto w-full'

                return (
                  <span className={`${wrapperClasses} clear-both`}>
                    <img
                      {...props}
                      alt={cleanAlt}
                      className="rounded-xl border border-white/10 shadow-lg object-cover w-full animate-fade-in"
                    />
                    {cleanAlt && cleanAlt !== 'left' && cleanAlt !== 'right' && cleanAlt !== 'center' && (
                      <span className="block text-center text-xs text-[#666666] mt-2 font-poppins">
                        {cleanAlt}
                      </span>
                    )}
                  </span>
                )
              }
            }}
          >
            {preprocessDescription(post.content)}
          </ReactMarkdown>
        )}
      </div>

      <ContactForm />
    </article>
  )
}
