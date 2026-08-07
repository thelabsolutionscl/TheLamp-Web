import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Lamp | Iluminación inteligente de diseño",
  description:
    "Lámparas de diseño minimalista, terminaciones premium y control inteligente compatible con Google Home y Alexa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
