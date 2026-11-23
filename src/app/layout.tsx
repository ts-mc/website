import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "900"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theysix.tech"),
  title: "THEYSIX | Maximum Efficiency Minecraft Farms",
  description:
    "Next-generation Minecraft farm schematics for Java & Bedrock Edition. High-efficiency designs, world downloads, and video tutorials.",
  keywords: [
    "TheySix",
    "Minecraft Farms",
    "Java Farms",
    "Bedrock Farms",
    "Litematica Schematics",
    "Minecraft World Download",
  ],
  authors: [{ name: "TheySix" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "THEYSIX - Maximum Efficiency Minecraft Farms",
    description: "High-efficiency Minecraft Java & Bedrock farm schematics and world saves.",
    url: "https://theysix.tech",
    siteName: "TheySix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "THEYSIX — Maximum Efficiency Minecraft Farms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.gif",
    shortcut: "/logo.gif",
    apple: "/logo.gif",
  },
};

export const viewport: Viewport = {
  themeColor: "#080818",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#main"
          className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:text-black"
        >
          SKIP TO CONTENT
        </a>
        <main id="main" className="flex-1 w-full">
          {children}
        </main>
        <Navbar />
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
