/** IndexNow key file (https://www.indexnow.org): proves to Bing/Yandex/Seznam that pings come from this site. */
export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new Response("Not found", { status: 404 })
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
