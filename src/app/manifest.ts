import type { MetadataRoute } from "next"
import { site } from "@/data/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nombreLargo,
    short_name: site.nombre,
    description: site.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "es-CL",
  }
}
