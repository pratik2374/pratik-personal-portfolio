import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Pratik Gond's Engineering Blog: understanding how your data is collected, handled, and protected.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Privacy Policy</span>
      </nav>

      <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
          Legal & Compliance
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Last Updated: November 15, 2026 · Effective Date: November 15, 2026
        </p>
      </header>

      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-500 hover:prose-a:underline">
        <section>
          <h2>1. Introduction & Overview</h2>
          <p>
            Welcome to the personal engineering blog of <strong>Pratik Gond</strong> (accessible via{" "}
            <code>blog.pratikgond.tech</code> and <code>pratikgond.tech</code>). We respect your privacy and are committed
            to protecting any personal data that may be collected when you access or interact with this publication.
          </p>
          <p>
            This Privacy Policy details our practices concerning data collection, usage, third-party disclosure, retention,
            and your statutory rights in compliance with global standards, including the European Union General Data
            Protection Regulation (GDPR), the California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA),
            and the Digital Personal Data Protection Act, 2023 (DPDP Act, India).
          </p>
        </section>

        <section>
          <h2>2. Data Controller Information</h2>
          <p>
            The data controller responsible for your personal information is:
          </p>
          <ul>
            <li><strong>Operator:</strong> Pratik Gond</li>
            <li><strong>Role:</strong> Software & AI Engineer, Independent Publisher</li>
            <li><strong>Website:</strong> <a href="https://pratikgond.tech" target="_blank" rel="noopener noreferrer">pratikgond.tech</a></li>
            <li><strong>Contact Email:</strong> <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a> (or through our <Link href="/contact">Contact Page</Link>)</li>
          </ul>
        </section>

        <section>
          <h2>3. Information We Collect</h2>
          <p>We believe in minimal data footprint. We only collect the minimal technical data necessary to deliver fast, secure, and reliable reading experiences:</p>
          
          <h3>A. Automatically Collected Technical Data</h3>
          <ul>
            <li><strong>Server Log Information:</strong> IP address (anonymized where applicable), user-agent header, browser type and version, operating system, referring URL, timestamp of requests, and HTTP status codes.</li>
            <li><strong>Performance & Analytics Metrics:</strong> Page load times, scroll depth, interactions with code snippets, and aggregate view counts to optimize performance across devices.</li>
          </ul>

          <h3>B. Voluntarily Submitted Information</h3>
          <ul>
            <li><strong>Direct Communications:</strong> If you contact us via email, feedback forms, or social channels, we receive your name, email address, and the contents of your message.</li>
            <li><strong>Newsletter or Subscription Data:</strong> If you opt-in to receive article dispatches, your email address is processed solely for newsletter delivery. You may unsubscribe at any time with a single click.</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal Grounds for Processing (GDPR & DPDP)</h2>
          <p>We process your data under the following legitimate legal bases:</p>
          <ul>
            <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> Ensuring website security, mitigating DDoS attacks, caching content geographically via CDN, and measuring aggregate readership metrics.</li>
            <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> When you explicitly subscribe to our newsletter or consent to optional analytical cookies.</li>
            <li><strong>Legal Obligation (Art. 6(1)(c) GDPR):</strong> Compliance with statutory requests or applicable legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We use minimal cookies designed to enhance your experience:
          </p>
          <ul>
            <li><strong>Essential Theme Preference:</strong> A local storage or lightweight cookie flag to remember your preference for Dark Mode or Light Mode.</li>
            <li><strong>Performance & Web Vitals:</strong> Aggregate, non-identifying telemetry (e.g. Next.js Analytics or Google Analytics 4 with IP anonymization) to diagnose slow pages or broken links.</li>
          </ul>
          <p>
            You can configure your browser to reject cookies or notify you when cookies are set. More details are available in our <Link href="/cookies">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Infrastructure & Subprocessors</h2>
          <p>To deliver a resilient, edge-distributed blog, we collaborate with industry-leading infrastructure partners:</p>
          <ul>
            <li><strong>Hosting & Edge Delivery:</strong> Vercel Inc. and Cloudflare (for DNS, edge caching, and SSL termination).</li>
            <li><strong>Content Management System (CMS):</strong> Sanity.io (Sanity AS, Norway/USA) for storing blog articles, category relationships, and optimized WebP/AVIF media delivery via Sanity CDN.</li>
            <li><strong>Source Code & Versioning:</strong> GitHub Inc. for repository hosting and issue tracking.</li>
            <li><strong>Analytics:</strong> Privacy-focused Google Analytics (with IP masking enabled) for readership aggregates.</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention & Security Measures</h2>
          <p>
            Server access logs are automatically rotated and purged after 30 to 90 days. We employ strict industry-standard
            security measures including TLS 1.3 encryption, Content Security Policies (CSP), HTTP Strict Transport Security
            (HSTS), and least-privilege token access for our CMS backend.
          </p>
        </section>

        <section>
          <h2>8. Your Statutory Rights</h2>
          <p>Depending on your jurisdiction (e.g., GDPR in the EU/UK, CCPA/CPRA in California, DPDP Act in India), you possess the following rights:</p>
          <ul>
            <li><strong>Right of Access & Rectification:</strong> You may request a copy of any personal data we hold about you and request correction of inaccurate data.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request deletion of your information from our records.</li>
            <li><strong>Right to Restrict or Object to Processing:</strong> You may object to data processing conducted on legitimate interest grounds.</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing relies on consent (e.g., email subscriptions), you can withdraw consent at any time.</li>
            <li><strong>Non-Discrimination:</strong> We do not discriminate against any visitor for exercising their statutory privacy rights.</li>
          </ul>
          <p>
            To exercise any of these rights, please email us directly at{" "}
            <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a>. We respond to verified requests within 30 days.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            This website is intended for professional developers, engineers, and general technology enthusiasts. We do not
            knowingly collect personally identifiable information from individuals under the age of 16. If we become aware
            that a child has provided us with personal information, we promptly delete it from our systems.
          </p>
        </section>

        <section>
          <h2>10. Modifications to this Privacy Policy</h2>
          <p>
            We may occasionally update this Privacy Policy to reflect technological updates, architectural improvements, or
            statutory revisions. The &ldquo;Last Updated&rdquo; date at the top will indicate when revisions took effect.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy or our data practices, reach out via:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a></li>
            <li><strong>Portfolio:</strong> <a href="https://pratikgond.tech" target="_blank" rel="noopener noreferrer">pratikgond.tech</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/pratikgond" target="_blank" rel="noopener noreferrer">linkedin.com/in/pratikgond</a></li>
          </ul>
        </section>
      </article>
    </div>
  )
}
