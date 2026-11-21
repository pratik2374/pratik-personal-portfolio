import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }

interface CardOptions {
  title: string
  eyebrow?: string
  /** With imageOnly: a finished share image (JPEG/PNG URL) to return as-is. */
  backgroundUrl?: string
  imageOnly?: boolean
}

/** Shared 1200×630 share card: dark backdrop, orange accent, title, byline (or a finished image as-is). */
export function renderOgCard({ title, eyebrow, backgroundUrl, imageOnly }: CardOptions) {
  if (imageOnly && backgroundUrl) {
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser
        <img src={backgroundUrl} alt="" width={OG_SIZE.width} height={OG_SIZE.height} style={{ objectFit: "cover" }} />
      ),
      OG_SIZE
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0f0f0f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(circle at 85% 15%, rgba(249,115,22,0.35), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          {eyebrow && (
            <div style={{ display: "flex", fontSize: 26, color: "#fb923c", fontWeight: 600, marginBottom: 20, letterSpacing: 1 }}>
              {eyebrow.toUpperCase()}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 70 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 36, fontSize: 26, color: "#d4d4d4" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#f97316",
                color: "#fff",
                fontWeight: 700,
                marginRight: 16,
              }}
            >
              P
            </div>
            Pratik Gond · blog.pratikgond.tech
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  )
}
