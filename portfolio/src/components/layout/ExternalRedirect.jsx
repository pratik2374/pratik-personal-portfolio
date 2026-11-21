import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'

/** Sends the visitor to another site (the blog), replacing this history entry. */
export default function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return (
    <div role="status" className="mb-24 pt-12 sm:pt-0 text-gray-mid font-inter text-sm">
      Taking you to the blog…{' '}
      <a href={to} className="text-accent-orange hover:underline">
        Continue
      </a>
    </div>
  )
}

export function BlogHomeRedirect() {
  const { blogUrl } = useSettings()
  return <ExternalRedirect to={blogUrl} />
}

export function BlogPostRedirect() {
  const { blogUrl } = useSettings()
  const { slug = '' } = useParams()
  return <ExternalRedirect to={`${blogUrl}/blog/${encodeURIComponent(slug)}`} />
}
