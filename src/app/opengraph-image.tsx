import { ImageResponse } from "next/og"

export const alt = "The Lamp · Lámparas de diseño con luz inteligente"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Imagen que se ve al compartir el sitio en WhatsApp, Instagram o LinkedIn.
 * Se genera con código en vez de subir un PNG para que siempre calce con la
 * línea gráfica, aunque después cambien los textos.
 */
export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#0a0a0a",
          backgroundImage:
            // Cálido: es el halo de una lámpara encendida, no el acento de marca.
            "radial-gradient(ellipse 55% 65% at 50% 0%, rgba(255,180,84,0.20) 0%, transparent 70%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mismo logotipo que la barra del sitio: ampolleta + THE LAMP.
            Va con cajas y no con SVG porque el motor de next/og renderiza
            SVG de forma parcial. */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                border: "5px solid #ffffff",
              }}
            />
            <div style={{ width: 20, height: 7, borderRadius: 2, background: "#5badde" }} />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            THE LAMP
          </div>
        </div>

        {/* Satori (el motor de next/og) exige display flex explícito en todo
            div con más de un hijo, y no entiende <br>. Por eso cada línea del
            titular es su propio div. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex" }}>Lámparas que saben</div>
          <div style={{ display: "flex" }}>cuándo bajar la luz</div>
        </div>

        <div style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,0.55)" }}>
          Diseño minimalista · Google Home y Alexa · Envío a todo Chile
        </div>
      </div>
    ),
    size
  )
}
