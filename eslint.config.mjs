import coreWebVitals from "eslint-config-next/core-web-vitals"
import typescript from "eslint-config-next/typescript"

// eslint-config-next 16 ya exporta flat config, así que se extiende directo.
// Nada de FlatCompat: con esta versión revienta al validar el esquema viejo.
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", ".open-next/**", "node_modules/**"],
  },
]

export default config
