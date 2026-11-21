import { draftMode } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

/** Leaves live preview and returns to the published page the visitor was on. */
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  const back = request.nextUrl.searchParams.get("redirect") || "/"
  // Only same-site paths, never an absolute URL from the query string.
  const safe = back.startsWith("/") && !back.startsWith("//") ? back : "/"
  return NextResponse.redirect(new URL(safe, request.url))
}
