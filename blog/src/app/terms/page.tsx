import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Pratik Gond",
  description: "Terms of service for Pratik Gond's blog",
}

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-lg dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: September 2026</p>
      <h2>1. Terms</h2>
      <p>By accessing this Website, accessible from blog.pratikgond.tech or pratikgond.blog, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
      <h2>2. Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials on Pratik Gond's Website for personal, non-commercial transitory viewing only.</p>
      <h2>3. Disclaimer</h2>
      <p>All the materials on Pratik Gond's Website are provided "as is". Pratik Gond makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Pratik Gond does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
    </div>
  )
}
