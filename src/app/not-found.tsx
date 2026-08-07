import { CtaButton } from "@/components/ui/cta-button"

export default function NoEncontrado() {
  return (
    <div className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-md text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#5badde]">
          Error 404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">
          Acá no hay nada encendido
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          La página que buscabas no existe o cambió de dirección.
        </p>
        <CtaButton href="/tienda" className="mt-8" arrow>
          Ver las lámparas
        </CtaButton>
      </div>
    </div>
  )
}
