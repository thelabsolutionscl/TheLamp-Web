"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from "lucide-react"
import type { Imagen } from "@/data/products"

type Props = {
  imagenes: Imagen[]
  nombre: string
}

export function ProductGallery({ imagenes, nombre }: Props) {
  const fotos = useMemo(() => imagenes.filter((img) => Boolean(img?.src)), [imagenes])
  const [indice, setIndice] = useState(0)
  const [abierto, setAbierto] = useState(false)
  const [zoom, setZoom] = useState(1)

  const total = fotos.length
  const actual = fotos[indice]

  function irA(nuevoIndice: number) {
    if (!total) return
    setIndice((nuevoIndice + total) % total)
    setZoom(1)
  }

  function anterior() {
    irA(indice - 1)
  }

  function siguiente() {
    irA(indice + 1)
  }

  useEffect(() => {
    if (!abierto) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAbierto(false)
      if (event.key === "ArrowLeft") anterior()
      if (event.key === "ArrowRight") siguiente()
      if (event.key === "+" || event.key === "=") setZoom((z) => Math.min(3, z + 0.5))
      if (event.key === "-") setZoom((z) => Math.max(1, z - 0.5))
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  if (!actual) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-white/[0.07] bg-[#111111] text-sm text-white/30">
        Foto próximamente
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.07] bg-[#111111]">
          <button
            type="button"
            onClick={() => {
              setZoom(1)
              setAbierto(true)
            }}
            className="absolute inset-0 z-10 cursor-zoom-in"
            aria-label={`Ampliar foto de ${nombre}`}
          />

          <img
            key={actual.src}
            src={actual.src}
            alt={actual.alt || nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />

          <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] text-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" />
            Ampliar
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  anterior()
                }}
                className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/10 bg-black/55 p-2.5 text-white/80 backdrop-blur-sm transition hover:border-[#00d4cc]/40 hover:bg-black/80 hover:text-white"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  siguiente()
                }}
                className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/10 bg-black/55 p-2.5 text-white/80 backdrop-blur-sm transition hover:border-[#00d4cc]/40 hover:bg-black/80 hover:text-white"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-2.5 py-1 text-[11px] tabular-nums text-white/70 backdrop-blur-sm">
                {indice + 1} / {total}
              </span>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="relative">
            <div className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {fotos.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => irA(i)}
                  className={`relative aspect-square w-[112px] shrink-0 snap-start overflow-hidden rounded-lg border bg-[#111111] transition-all duration-200 sm:w-[126px] ${
                    i === indice
                      ? "border-[#00d4cc]/70 ring-1 ring-[#00d4cc]/30"
                      : "border-white/[0.07] hover:border-white/25"
                  }`}
                  aria-label={`Ver foto ${i + 1} de ${nombre}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `${nombre} foto ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {abierto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería ampliada de ${nombre}`}
          onClick={() => setAbierto(false)}
        >
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="absolute right-4 top-4 z-[110] rounded-full border border-white/10 bg-black/60 p-2.5 text-white/80 transition hover:border-[#00d4cc]/40 hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute left-1/2 top-4 z-[110] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-sm sm:top-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoom((z) => Math.max(1, z - 0.5))
              }}
              disabled={zoom <= 1}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-[#00d4cc] disabled:opacity-30"
              aria-label="Alejar"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-12 text-center text-xs tabular-nums text-white/70">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoom((z) => Math.min(3, z + 0.5))
              }}
              disabled={zoom >= 3}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-[#00d4cc] disabled:opacity-30"
              aria-label="Acercar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  anterior()
                }}
                className="absolute left-3 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white/80 transition hover:border-[#00d4cc]/40 hover:bg-white/10 hover:text-white sm:left-6"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  siguiente()
                }}
                className="absolute right-3 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-3 text-white/80 transition hover:border-[#00d4cc]/40 hover:bg-white/10 hover:text-white sm:right-6"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="flex h-[82vh] w-[88vw] items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={`${actual.src}-${zoom}`}
              src={actual.src}
              alt={actual.alt || nombre}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {total > 1 && (
            <div className="absolute bottom-4 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs tabular-nums text-white/70 backdrop-blur-sm sm:bottom-6">
              {indice + 1} / {total}
            </div>
          )}
        </div>
      )}
    </>
  )
}
