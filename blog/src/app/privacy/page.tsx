import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Pratik Gond",
  description: "Privacy policy for Pratik Gond's blog",
}

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-lg dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: September 2026</p>
      <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit this blog.</p>
      <h2>Personal information we collect</h2>
      <p>When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.</p>
      <h2>Analytics</h2>
      <p>We may use third-party analytics services (like Google Analytics) to help understand how our customers use the Site.</p>
      <h2>Changes</h2>
      <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
    </div>
  )
}
