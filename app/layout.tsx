import type { Metadata, Viewport } from "next";
import { Bitter, Libre_Franklin, Yellowtail } from "next/font/google";
import { business, seo } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Brand type, matched to the logo:
//   Yellowtail  → the "Mobile Home" script
//   Bitter      → the bold italic slab of "SETUP PROS"
//   Libre Franklin → a classic American sans for readable body copy
const script = Yellowtail({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-script-face" });
const slab = Bitter({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-slab" });
const body = Libre_Franklin({ subsets: ["latin"], display: "swap", variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: business.name,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#f6ead6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${script.variable} ${slab.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
