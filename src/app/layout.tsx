import type { Metadata, Viewport } from "next"
import { DM_Sans, Montserrat } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { SiteBackground } from "@/components/layout/SiteBackground"
import { site } from "@/data/site"

// Mismas familias que thelab.solutions: Montserrat para títulos, DM Sans para
// texto. Es lo que mantiene a The Lamp reconocible como parte de la familia.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nombre} · Lámparas de diseño con luz inteligente`,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcion,
  keywords: [
    "lámparas de diseño",
    "iluminación minimalista",
    "luz inteligente",
    "domótica",
    "Google Home",
    "Alexa",
    "lámpara de mesa",
    "lámpara colgante",
    "Chile",
  ],
  authors: [{ name: site.nombre }],
  creator: site.nombre,
  openGraph: {
    title: `${site.nombre} · Lámparas de diseño con luz inteligente`,
    description: site.descripcion,
    locale: "es_CL",
    type: "website",
    siteName: site.nombre,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nombre} · Lámparas de diseño con luz inteligente`,
    description: site.descripcion,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${site.url}/#tienda`,
    name: site.nombre,
    legalName: site.empresa.razonSocial,
    taxID: site.empresa.rut,
    description: site.descripcion,
    url: site.url,
    email: site.email,
    telephone: `+${site.whatsapp}`,
    parentOrganization: {
      "@type": "Organization",
      name: site.empresa.matriz,
      url: site.empresa.matrizUrl,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.direccion.calle,
      addressLocality: site.direccion.comuna,
      addressRegion: site.direccion.region,
      addressCountry: site.direccion.pais,
    },
    areaServed: { "@type": "Country", name: "Chile" },
    currenciesAccepted: "CLP",
    sameAs: [site.instagram],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.nombre,
    inLanguage: "es-CL",
    publisher: { "@id": `${site.url}/#tienda` },
  },
]

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${montserrat.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#0a0a0a] text-white">
        <SiteBackground />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#5badde] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0a0a0a]"
        >
          Saltar al contenido
        </a>
        {/* El carrito no necesita provider: vive en localStorage y los
            componentes lo leen con useSyncExternalStore. */}
        <Navbar />
        <main id="contenido" className="flex flex-1 flex-col pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
