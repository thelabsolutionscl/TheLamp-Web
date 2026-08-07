import type { MetadataRoute } from "next"
import { productos } from "@/data/products"
import { site } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date()

  const fijas = [
    { url: "", priority: 1 },
    { url: "/tienda", priority: 0.9 },
    { url: "/luz-inteligente", priority: 0.7 },
    { url: "/ayuda", priority: 0.6 },
    { url: "/contacto", priority: 0.5 },
    { url: "/terminos", priority: 0.2 },
    { url: "/privacidad", priority: 0.2 },
  ].map((p) => ({
    url: `${site.url}${p.url}`,
    lastModified: ahora,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }))

  const fichas = productos.map((p) => ({
    url: `${site.url}/producto/${p.slug}`,
    lastModified: ahora,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...fijas, ...fichas]
}
