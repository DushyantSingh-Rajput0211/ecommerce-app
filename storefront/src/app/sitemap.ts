import type { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://my-store.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/products", "/collections", "/cart"]
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))
}
