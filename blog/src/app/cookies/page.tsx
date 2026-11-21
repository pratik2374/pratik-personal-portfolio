import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how cookies and local storage are utilized on Pratik Gond's Engineering Blog.",
  alternates: {
    canonical: "/cookies",
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Cookie Policy</span>
      </nav>

      <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
          Browser Storage & Privacy
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Cookie Policy
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Last Updated: November 15, 2026
        </p>
      </header>

      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-500 hover:prose-a:underline">
        <section>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text strings stored directly on your computer or mobile device when you browse internet pages.
            They help websites remember your preferences, enhance navigation fluidity, and provide aggregated analytics.
          </p>
        </section>

        <section>
          <h2>2. How We Use Cookies & Local Storage</h2>
          <p>We believe in privacy-by-design. We maintain an ultra-lean cookie footprint:</p>
          
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-left border-collapse border border-gray-200 dark:border-gray-800 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="p-3 border border-gray-200 dark:border-gray-800">Category</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-800">Purpose</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-800">Duration</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-800">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-800 font-semibold">Theme Preference</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Remembers whether you selected Dark Mode, Light Mode, or System theme.</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Persistent (Local Storage)</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Strictly Necessary</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-800 font-semibold">Performance Telemetry</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Anonymous aggregate page views and core web vitals (Next.js / Google Analytics with IP masking).</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Session / Up to 13 months</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-800">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>3. Managing and Disabling Cookies</h2>
          <p>
            You have full control over cookie permissions through your web browser preferences:
          </p>
          <ul>
            <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies</li>
            <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking Protection</li>
            <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies</li>
            <li><strong>Microsoft Edge:</strong> Settings → Cookies and Site Permissions</li>
          </ul>
          <p>
            For additional questions, review our full <Link href="/privacy">Privacy Policy</Link> or email us at{" "}
            <a href="mailto:pratik.gond.dev@gmail.com">pratik.gond.dev@gmail.com</a>.
          </p>
        </section>
      </article>
    </div>
  )
}
