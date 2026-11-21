import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"
import { SANITY_CACHE_TAG, SITE_URL } from "@/lib/sanity"

/**
 * Tell IndexNow engines (Bing, Yandex, Seznam, Naver…) the changed URLs right away
 * instead of waiting for a recrawl. Only runs when INDEXNOW_KEY is configured.
 */
async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY
  if (!key || urls.length === 0) return
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.warn("IndexNow ping failed (content is still revalidated):", err)
  }
}

/**
 * Sanity webhook target: called on create/update/delete of posts and categories.
 * Verifies the signature with SANITY_REVALIDATE_SECRET, then drops the cached
 * Sanity responses so the next visit renders the new content (see README).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 })
  }

  try {
    // `true` waits briefly so the query API has the new revision before we refetch.
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret, true)

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
    }

    // expire: 0 → the next request refetches instead of serving the old version once more.
    revalidateTag(SANITY_CACHE_TAG, { expire: 0 })
    // Pages and new slugs that were never cached through a tagged fetch (e.g. sitemap, feed).
    revalidatePath("/", "layout")

    const changed: string[] = [SITE_URL]
    if (body?.slug && body._type === "blog") changed.push(`${SITE_URL}/blog/${body.slug}`)
    if (body?.slug && body._type === "category") changed.push(`${SITE_URL}/category/${body.slug}`)
    await pingIndexNow(changed)

    return NextResponse.json({ revalidated: true, type: body?._type, slug: body?.slug })
  } catch (err) {
    console.error("Revalidation webhook failed:", err)
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}
