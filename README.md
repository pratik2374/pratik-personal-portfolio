# pratikgond.tech

Monorepo for my personal site, blog and content studio.

| Folder | What it is | Stack | Live at |
| --- | --- | --- | --- |
| `portfolio/` | Personal portfolio | Vite + React 18 + Tailwind | https://pratikgond.tech |
| `blog/` | Blog | Next.js 16 (App Router) + Tailwind 4 | https://blog.pratikgond.tech |
| `sanity-studio/` | **Insanity**, the content studio for both sites | Sanity Studio | deployed with `sanity deploy` |

All content (posts, categories, projects, experience, tools) lives in Sanity
(project `8j6w8ohu`, dataset `production`). Firebase is only used to store
contact-form messages from the portfolio.

## Running locally

```bash
# Portfolio: http://localhost:5173
cd portfolio && npm install && npm run dev

# Blog: http://localhost:3000
cd blog && npm install && npm run dev

# Insanity (Sanity Studio): http://localhost:3333
cd sanity-studio && npm install && npm run dev
```

## Environment variables

**portfolio/.env.local**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# Optional: email notification for contact messages
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

**blog/.env.local** (and in the hosting provider)

```
NEXT_PUBLIC_SITE_URL=https://blog.pratikgond.tech
SANITY_REVALIDATE_SECRET=<long random string, same as the Sanity webhook secret>
# Live preview (see "Live preview" below). Server-only: never prefix with NEXT_PUBLIC_.
SANITY_API_READ_TOKEN=<Sanity token with Viewer permissions>
# Where "edit" overlays in live preview open. Defaults to http://localhost:3333.
NEXT_PUBLIC_SANITY_STUDIO_URL=https://<your-studio>.sanity.studio
# Optional SEO: search-console ownership tags and instant indexing (see "SEO" below)
GOOGLE_SITE_VERIFICATION=<content value of Google's meta tag>
BING_SITE_VERIFICATION=<content value of Bing's msvalidate.01 tag>
INDEXNOW_KEY=<random 32+ character hex string>
```

**sanity-studio** (set when building or deploying the studio)

```
# Site the studio's Live preview tab loads. Defaults to http://localhost:3000.
SANITY_STUDIO_PREVIEW_ORIGIN=https://blog.pratikgond.tech
```

## Deploying

### Firebase rules and CORS

Rules only take effect once deployed:

```bash
firebase deploy --only firestore:rules,storage
gsutil cors set cors.json gs://<your-storage-bucket>
```

Firestore denies everything except creating a well-formed document in `messages`.
Read messages in the Firebase console.

### Insanity (Sanity Studio)

```bash
cd sanity-studio
SANITY_STUDIO_PREVIEW_ORIGIN=https://blog.pratikgond.tech npm run deploy
```

On Windows PowerShell set the variable first: `$env:SANITY_STUDIO_PREVIEW_ORIGIN="https://blog.pratikgond.tech"; npm run deploy`.

### Instant blog updates (Sanity webhook)

The blog pre-renders pages and refreshes them when Sanity reports a change.
Create a webhook at sanity.io/manage → project → API → Webhooks:

- **URL:** `https://blog.pratikgond.tech/api/revalidate`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type in ["blog", "category", "siteSettings"]`
- **Projection:** `{_type, "slug": slug.current}`
- **HTTP method:** POST
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

Without the webhook, pages still refresh on their own every hour.

## Shared profile (Profile & Site Settings)

Your name, job title, tagline, bio, avatar, email, social links, portfolio stats and
portfolio section headings live in one Sanity document, **Profile & Site Settings**
(the first item in the studio sidebar, document id `siteSettings`). Both the portfolio
and the blog read it, so a change there shows up on both sites.

- It is a singleton: it can't be created from "New document", deleted, duplicated or unpublished.
- Its fields start filled with the values the sites used before. Open it once and click
  **Publish**; until then both sites fall back to their built-in copies.
- Line breaks in **Tagline** and in each stat's **Label** are shown as separate lines.

## Live preview

The studio's **Live preview** tab (Sanity Presentation) shows the blog with your unpublished
edits, and clicking text on the page jumps to that field in the editor.

One-time setup:

1. **Viewer token:** sanity.io/manage → project → API → Tokens → *Add API token* with
   **Viewer** permissions. Put it in `SANITY_API_READ_TOKEN` in `blog/.env.local` and in the
   blog's hosting environment.
2. **CORS:** sanity.io/manage → project → API → CORS origins → add `http://localhost:3000`
   and `https://blog.pratikgond.tech`, each with **Allow credentials** ticked.
3. **Studio origin:** build/deploy the studio with
   `SANITY_STUDIO_PREVIEW_ORIGIN=https://blog.pratikgond.tech` (see *Insanity (Sanity Studio)* above).
   Locally it uses `http://localhost:3000`, so run the blog with `npm run dev` alongside the studio.

How it works: the studio opens `/api/draft-mode/enable` on the blog, which checks a secret the
studio creates and turns on Next.js draft mode. In draft mode the blog reads drafts with the
viewer token and skips its cache; normal visitors never see drafts.

Posts open at `/blog/<slug>`, categories at `/category/<slug>`, and the profile on `/` and `/about`.

## SEO (blog)

What the blog already does on its own:

- Pre-rendered pages, canonical URLs, per-post titles/descriptions (overridable in the post's SEO tab) and 1200×630 share images.
- Structured data: one `Person` entity (`https://pratikgond.tech/#person`, shared with the portfolio), `WebSite`, `Blog` with every post, `BlogPosting` (dates, reading time, word count, section, speakable summary), `BreadcrumbList`, category `CollectionPage` + `ItemList`, and `ProfilePage` on /about.
- `sitemap.xml` with real last-modified dates and image entries, `robots.txt`, RSS at `/feed.xml`, and `/llms.txt` for AI assistants.
- "Hide from search engines" on a post (SEO tab) adds `noindex` and removes it from the sitemap and `llms.txt`.

One-time setup that only you can do:

1. Add the blog to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) using the HTML-tag method; put the tag values in `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`, redeploy, verify, then submit `https://blog.pratikgond.tech/sitemap.xml` in both.
2. Optional: set `INDEXNOW_KEY` so every publish pings Bing/Yandex/Seznam immediately (the key is served at `/indexnow-key.txt`).
