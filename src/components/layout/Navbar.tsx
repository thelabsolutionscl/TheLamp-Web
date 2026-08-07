"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, VisuallyHidden } from "radix-ui"
import { Menu, ShoppingBag, X } from "lucide-react"
import { Logo } from "./Logo"
import { useCarrito } from "@/components/shop/cart"
import { cn } from "@/lib/utils"

const enlaces = [
  { label: "Tienda", href: "/tienda" },
  { label: "Luz inteligente", href: "/luz-inteligente" },
  { label: "Ayuda", href: "/ayuda" },
  { label: "Contacto", href: "/contacto" },
]

/** Contador del carrito. Se mantiene invisible hasta hidratar para no
 *  mostrar "0" un instante cuando el visitante sí tenía cosas guardadas. */
function BotonCarrito({ onNavigate }: { onNavigate?: () => void }) {
  const { unidades, listo } = useCarrito()
  return (
    <Link
      href="/carrito"
      onClick={onNavigate}
      className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white/65 transition-colors hover:text-white"
      aria-label={
        unidades > 0
          ? `Carrito, ${unidades} ${unidades === 1 ? "producto" : "productos"}`
          : "Carrito, vacío"
      }
    >
      <ShoppingBag className="h-[18px] w-[18px]" />
      {listo && unidades > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ffb454] px-1 text-[10px] font-semibold tabular text-[#0a0a0a]">
          {unidades}
        </span>
      )}
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // El menú móvil se cierra en el clic del enlace (`cerrar`), no con un efecto
  // sobre pathname: la navegación es la causa real y así no hay un render de
  // más en cada cambio de página.
  const cerrar = () => setAbierto(false)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-[#0a0a0a]/92 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="The Lamp, ir a la portada">
          <Logo alto={22} />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {enlaces.map((e) => {
            const activo =
              pathname === e.href || pathname.startsWith(`${e.href}/`)
            return (
              <Link
                key={e.href}
                href={e.href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  activo ? "text-white" : "text-white/65 hover:text-white"
                )}
              >
                {e.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <BotonCarrito />

          <Dialog.Root open={abierto} onOpenChange={setAbierto}>
            <Dialog.Trigger asChild>
              <button
                className="p-2 text-white/65 transition-colors hover:text-white md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
                <div className="flex items-center justify-between">
                  <Dialog.Title asChild>
                    <span>
                      <Logo alto={20} />
                    </span>
                  </Dialog.Title>
                  <Dialog.Close
                    className="p-2 text-white/50 transition-colors hover:text-white"
                    aria-label="Cerrar menú"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <VisuallyHidden.Root>
                  <Dialog.Description>
                    Menú de navegación de The Lamp
                  </Dialog.Description>
                </VisuallyHidden.Root>

                <nav aria-label="Menú" className="mt-8 flex flex-col">
                  {enlaces.map((e) => (
                    <Link
                      key={e.href}
                      href={e.href}
                      onClick={cerrar}
                      className="border-b border-white/[0.07] py-3.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
                    >
                      {e.label}
                    </Link>
                  ))}
                  <Link
                    href="/carrito"
                    onClick={cerrar}
                    className="border-b border-white/[0.07] py-3.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
                  >
                    Carrito
                  </Link>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
