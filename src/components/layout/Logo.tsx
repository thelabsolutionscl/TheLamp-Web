import Image from "next/image"
import { cn } from "@/lib/utils"

const LOGO_SRC = ""
const LOGO_RATIO = 4.6

/** Turquesa oficial de The Lamp, sincronizado con la app. */
const TURQUESA = "#00d4cc"

function Ampolleta({ alto }: { alto: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={alto}
      height={alto}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <g transform="rotate(34 12 12)">
        <path
          d="M12 2.6a6.2 6.2 0 0 1 3.7 11.2v1.1H8.3v-1.1A6.2 6.2 0 0 1 12 2.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M10.1 11.6 14 6.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="8.3" y="16.1" width="7.4" height="2.5" rx="0.5" fill={TURQUESA} />
        <rect x="9.3" y="19.2" width="5.4" height="2.2" rx="0.5" fill={TURQUESA} />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  alto = 24,
}: {
  className?: string
  alto?: number
}) {
  if (LOGO_SRC) {
    return (
      <Image
        src={LOGO_SRC}
        alt="The Lamp"
        width={Math.round(alto * LOGO_RATIO)}
        height={alto}
        className={cn("w-auto", className)}
        style={{ height: alto }}
        priority
      />
    )
  }

  return (
    <span
      className={cn(
        "inline-flex select-none items-center text-white",
        className
      )}
      style={{ gap: alto * 0.34 }}
    >
      <Ampolleta alto={alto * 1.15} />
      <span
        className="font-[family-name:var(--font-heading)] font-bold uppercase leading-none"
        style={{ fontSize: alto * 0.78, letterSpacing: "-0.01em" }}
      >
        The&nbsp;Lamp
      </span>
    </span>
  )
}
