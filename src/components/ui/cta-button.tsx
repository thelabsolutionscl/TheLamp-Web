import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const base =
  "group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg font-semibold transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4cc]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
} as const

const variants = {
  primary:
    "bg-[#00d4cc] text-[#0a0a0a] shadow-[0_4px_22px_-6px_rgba(0,212,204,0.5)] hover:-translate-y-0.5 hover:bg-[#27e3dc] hover:shadow-[0_14px_40px_-8px_rgba(0,212,204,0.65)]",
  secondary:
    "border border-white/[0.14] text-white/70 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.04] hover:text-white",
  ghost: "text-white/60 hover:text-white",
} as const

type Comun = {
  children: ReactNode
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  icon?: LucideIcon
  arrow?: boolean
  className?: string
}

/** El destello que barre el botón primario al pasar el mouse. */
function Interior({
  variant,
  icon: Icon,
  arrow,
  children,
}: Pick<Comun, "variant" | "icon" | "arrow" | "children">) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-[250%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[450%] motion-reduce:hidden" />
        </span>
      )}
      {Icon && <Icon className="relative z-10 h-4 w-4" />}
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
      )}
    </>
  )
}

/**
 * CTA con enlace. Elige <Link> para rutas internas y <a> para externas, así
 * la navegación interna sigue siendo cliente y no recarga la página.
 */
export function CtaButton({
  href,
  external = false,
  variant = "primary",
  size = "md",
  icon,
  arrow = false,
  className,
  children,
  ...rest
}: Comun & {
  href: string
  external?: boolean
  onClick?: () => void
  "aria-label"?: string
}) {
  const classes = cn(base, sizes[size], variants[variant], className)
  const inner = (
    <Interior variant={variant} icon={icon} arrow={arrow}>
      {children}
    </Interior>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {inner}
    </a>
  )
}

/** Mismo look, pero como <button> real (submit de formularios, acciones). */
export function CtaBoton({
  variant = "primary",
  size = "md",
  icon,
  arrow = false,
  className,
  children,
  ...rest
}: Comun & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      <Interior variant={variant} icon={icon} arrow={arrow}>
        {children}
      </Interior>
    </button>
  )
}
