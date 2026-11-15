import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pratikgond.tech";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Pratik Gond — Engineering, AI & Architecture Journal",
    template: "%s | Pratik Gond",
  },
  description:
    "Technical deep dives into Artificial Intelligence, autonomous agents, modern web architecture, and production software engineering by Pratik Gond.",
  keywords: [
    "Pratik Gond",
    "AI Engineer",
    "Software Engineer",
    "Artificial Intelligence",
    "Autonomous Agents",
    "LLM Architecture",
    "RAG",
    "Next.js",
    "React 19",
    "System Design",
    "Distributed Systems",
    "Web Performance",
  ],
  authors: [{ name: "Pratik Gond", url: "https://pratikgond.tech" }],
  creator: "Pratik Gond",
  publisher: "Pratik Gond",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": `${baseUrl}/feed.xml`,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Pratik Gond — Engineering, AI & Architecture Journal",
    description:
      "Technical deep dives into Artificial Intelligence, autonomous agents, modern web architecture, and production software engineering.",
    url: baseUrl,
    siteName: "Pratik Gond Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Pratik Gond Blog Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratik Gond — Engineering, AI & Architecture Journal",
    description:
      "Technical deep dives into Artificial Intelligence, autonomous agents, and high-performance software engineering.",
    creator: "@pratikgond",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global WebSite & Person Schema for Extreme Search Ranking
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Pratik Gond Blog",
        "description": "Technical deep dives into Artificial Intelligence, autonomous agents, and systems architecture.",
        "publisher": {
          "@id": `${baseUrl}/#person`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        "name": "Pratik Gond",
        "url": "https://pratikgond.tech",
        "jobTitle": "Software & AI Engineer",
        "sameAs": [
          "https://github.com/pratikgond",
          "https://linkedin.com/in/pratikgond",
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen flex flex-col font-sans selection:bg-orange-500 selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
