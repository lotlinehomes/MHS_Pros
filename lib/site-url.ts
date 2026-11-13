import { seo } from "@/content/site";

/** Public site URL: NEXT_PUBLIC_SITE_URL env var if set, otherwise the domain in content/site.ts. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv || seo.siteUrl).replace(/\/$/, "");
}
