import { renderOgCard, OG_SIZE } from "./_og/card"

export const alt = "Pratik Gond: Engineering, AI & Architecture Journal"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return renderOgCard({
    eyebrow: "Engineering · AI · Architecture",
    title: "Technical deep dives into LLM systems, RAG and production engineering",
  })
}
