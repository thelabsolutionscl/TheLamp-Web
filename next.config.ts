import type { NextConfig } from "next"

// Cabeceras de seguridad aplicadas a todas las rutas.
// Mismo criterio que web-thelab-solutions: el sitio maneja datos de compra,
// así que no relajamos nada de esto.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
]

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.trycloudflare.com",
  ],
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Fotos de producto: caché larga, los nombres son estables.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // El checkout y el retorno de Flow nunca se cachean.
        source: "/checkout",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/pedido/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ]
  },
}

export default nextConfig

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev())
