import { defineEnableDraftMode } from "next-sanity/draft-mode"
import { client } from "@/lib/sanity"

/**
 * Called by the studio's Presentation tool: validates the studio's secret,
 * turns on Next.js draft mode and redirects to the page being previewed.
 * Needs SANITY_API_READ_TOKEN (a Viewer token) on the server.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
