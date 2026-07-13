import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imammarbleandtiles.com"),
  title: "Imam Marble & Tiles | Premium Tiles & Sanitary Ware",
  description: "Discover premium tiles, sanitary ware, and luxury bathroom solutions from Imam Marble & Tiles. Browse categories, request pricing, and contact the shop directly.",
  keywords: ["tiles", "sanitary ware", "bathroom tiles", "kitchen tiles", "granite", "wash basins", "luxury interiors"],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Imam Marble & Tiles | Premium Tiles & Sanitary Ware",
    description: "Premium tiles and sanitary ware for modern projects and luxurious homes.",
    type: "website",
    locale: "en_US",
    siteName: "Imam Marble & Tiles",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imam Marble & Tiles",
    description: "Premium tiles and sanitary ware for luxury spaces.",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8fbff" }, { media: "(prefers-color-scheme: dark)", color: "#020617" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
