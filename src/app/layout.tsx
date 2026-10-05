import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

/**
 * Both families are loaded for real: the Tailwind theme declares them but
 * nothing was ever fetching them, so every page silently rendered in
 * system-ui. `display: "swap"` stops late font loading from causing layout
 * shift.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theysix.ro-mihaiu.xyz"),
  title: "TheySix | Minecraft Java & Bedrock Farm Schematics & Downloads",
  description:
    "Official website of TheySix. Explore 500+ high-efficiency Minecraft Java and Bedrock farm designs, schematics (.litematic), world downloads, and video tutorials.",
  keywords: [
    "TheySix",
    "Minecraft Farms",
    "Java Farms",
    "Bedrock Farms",
    "Litematica Schematics",
    "Minecraft World Download",
    "Gunpowder Farm",
    "Iron Farm",
    "Gold Farm",
    "Raid Farm"
  ],
  authors: [{ name: "TheySix" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TheySix - Minecraft Farm Vault",
    description: "Download high-efficiency Minecraft Java & Bedrock farm schematics and world saves.",
    url: "https://theysix.ro-mihaiu.xyz",
    siteName: "TheySix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TheySix — high-efficiency Minecraft farm schematics for Java and Bedrock",
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
  themeColor: "#070A12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-base text-ink min-h-screen flex flex-col antialiased">
        <a
          href="#main"
          className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-brand focus:px-4 focus:py-2.5 focus:text-[#070A12]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1 w-full shell py-8 sm:py-12">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
