import { GET as getFeedXml } from "../feed.xml/route"

export const revalidate = 3600

export async function GET() {
  return getFeedXml()
}
