import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and Conditions of Use for Pratik Gond's Engineering Blog.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Terms of Service</span>
      </nav>

      <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
          Terms & Agreements
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Last Updated: November 15, 2026 · Effective Date: November 15, 2026
        </p>
      </header>

      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-500 hover:prose-a:underline">
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or reading the engineering publication hosted at <strong>blog.pratikgond.tech</strong>,{" "}
            <strong>pratikgond.tech</strong>, or any associated subdomains (collectively referred to as the &ldquo;Website&rdquo;),
            you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and all applicable local, national, and international laws.
            If you disagree with any part of these Terms, you must discontinue your use of the Website immediately.
          </p>
        </section>

        <section>
          <h2>2. Intellectual Property Rights & Code Licensing</h2>
          
          <h3>A. Written Content and Editorial Media</h3>
          <p>
            Unless explicitly noted otherwise, all original prose, architectural diagrams, articles, essays, and editorial
            analysis published on this Website are the exclusive intellectual property of <strong>Pratik Gond</strong> and are
            protected under international copyright laws (© 2026 Pratik Gond. All rights reserved). You may share excerpts,
            quotes, or links provided you give clear attribution with a direct hyperlink back to the original post.
          </p>

          <h3>B. Code Snippets & Demonstrations (MIT License)</h3>
          <p>
            Unless specified otherwise within a particular article or GitHub repository, all technical code snippets, sample
            implementations, configuration files, and scripts displayed directly on this blog are provided under the terms of
            the permissive <strong>MIT License</strong>:
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-sm font-mono border border-gray-200 dark:border-gray-800">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
            documentation files, to deal in the Software without restriction, including without limitation the rights to
            use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...
          </div>
        </section>

        <section>
          <h2>3. Permitted and Prohibited Conduct</h2>
          <p>You agree to use this Website solely for lawful, educational, and professional purposes. You agree NOT to:</p>
          <ul>
            <li>Engage in any automated scraping, crawling, or data extraction that imposes unreasonable load on our origin servers or bypasses robots.txt exclusions.</li>
            <li>Attempt to circumvent security boundaries, inject malicious code, or test vulnerability limits without explicit written authorization.</li>
            <li>Misrepresent affiliation with Pratik Gond or impersonate any person or entity.</li>
            <li>Republish entire articles verbatim without prior written permission or appropriate canonical credit.</li>
          </ul>
        </section>

        <section>
          <h2>4. Technical & Engineering Disclaimer</h2>
          <p>
            The opinions, benchmarks, architectural patterns, and engineering recommendations expressed on this Website reflect
            personal experience, research, and technical explorations. <strong>All content is provided &ldquo;AS IS&rdquo; without
            warranty of any kind, whether express or implied.</strong>
          </p>
          <p>
            Software engineering and AI systems change rapidly. While we strive for extreme technical accuracy, you are solely
            responsible for testing, benchmarking, and auditing any code or architecture before implementing it in commercial or
            mission-critical production environments. Pratik Gond shall not be liable for system downtime, data corruption, or
            computational costs resulting from applying insights from this blog.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services & External Links</h2>
          <p>
            This Website frequently references external GitHub repositories, documentation pages, open-source tools, API
            providers, and technical papers. We do not control and are not responsible for the content, privacy practices, or
            terms of external websites. Following any external link is done at your own risk.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall Pratik Gond be liable for any direct, indirect,
            punitive, incidental, special, consequential, or exemplary damages, including damages for loss of profits, goodwill,
            data, or other intangible losses, arising out of or relating to the use of, or inability to use, this Website.
          </p>
        </section>

        <section>
          <h2>7. DMCA & Copyright Infringement Notifications</h2>
          <p>
            We respect the intellectual property rights of others. If you believe that any material residing on or accessible
            through this Website infringes a copyright you own or control, please submit a formal notification with the
            infringing URL, proof of ownership, and contact information to <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>8. Governing Law & Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict
            of law principles. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted
            in the competent courts located in India.
          </p>
        </section>

        <section>
          <h2>9. Amendments & Contact</h2>
          <p>
            We reserve the right to revise these Terms at any time. Material changes will be noted with an updated timestamp at
            the top of this page. Your continued use of the Website after such changes constitutes acceptance of the new Terms.
          </p>
          <p>
            For questions or legal inquiries regarding these Terms:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a></li>
            <li><strong>Author:</strong> Pratik Gond</li>
            <li><strong>Portfolio:</strong> <a href="https://pratikgond.tech" target="_blank" rel="noopener noreferrer">pratikgond.tech</a></li>
          </ul>
        </section>
      </article>
    </div>
  )
}
