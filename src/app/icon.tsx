import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/**
 * Favicon: el punto de luz ámbar del logotipo sobre negro.
 *
 * Se genera con código para no depender de un archivo. Cuando llegue el
 * isotipo definitivo, borra este archivo y deja `src/app/icon.png` en su
 * lugar: Next lo toma automáticamente.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 999,
            background: "#ffb454",
            boxShadow: "0 0 10px #ffb454",
          }}
        />
      </div>
    ),
    size
  )
}
