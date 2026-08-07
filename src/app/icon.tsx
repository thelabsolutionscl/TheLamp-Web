import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/**
 * Favicon: la ampolleta del logo reducida a lo mínimo que sigue siendo
 * reconocible a 16 px — el bulbo y el casquillo celeste.
 *
 * Se arma con cajas y no con SVG porque el motor de `next/og` renderiza SVG
 * de forma parcial, y acá lo que importa es que no falle nunca.
 *
 * Cuando tengas el isotipo definitivo, borra este archivo y deja
 * `src/app/icon.png` en su lugar (cuadrado, mínimo 512 × 512): Next lo toma
 * automáticamente.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "#0a0a0a",
          borderRadius: 7,
        }}
      >
        {/* Bulbo */}
        <div
          style={{
            width: 17,
            height: 17,
            borderRadius: 999,
            border: "2.5px solid #ffffff",
          }}
        />
        {/* Casquillo */}
        <div style={{ width: 9, height: 3, borderRadius: 1, background: "#5badde" }} />
      </div>
    ),
    size
  )
}
