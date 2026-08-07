import type { MetadataRoute } from "next"
import { site } from "@/data/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El carrito, el checkout y las páginas de pedido son privadas y
      // cambian por visitante: no tienen nada que hacer en el índice.
      disallow: ["/carrito", "/checkout", "/pedido/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
