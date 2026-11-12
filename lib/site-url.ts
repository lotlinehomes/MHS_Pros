import { seo } from "@/content/site";

/** Public site URL from env (set NEXT_PUBLIC_SITE_URL in Vercel), else Vercel's URL, else a placeholder. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return seo.fallbackUrl;
}
