import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Craft Bun | Pães artesanais para food service",
  description:
    "Craft Bun é a linha de pães artesanais para hamburguerias e distribuidoras. Tradicional, Brioche e Gergelim em volume de food service. Fale com nosso time comercial.",
  robots: "index, follow",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-craft-black text-craft-cream">
        {children}
      </body>
    </html>
  );
}
