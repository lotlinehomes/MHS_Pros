import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { business, seo } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

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
  themeColor: "#0f1f33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
