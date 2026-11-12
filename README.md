# Mobile Home Setup Pros — Marketing Site

A single-page, funnel-style landing page with one job: **get visitors to request a setup quote.** Social proof is stacked all the way down the page, with a "Get a Quote" call to action every 2–3 sections.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**. Runtime dependencies are just `next`, `react`, and `react-dom`.

> ⚠️ **Everything marked `// PLACEHOLDER` in `content/site.ts` is fake.** That includes testimonials, names, ratings, stats, partner logos, badges, the phone number, email, license number, and service area. Replace each one with real, verifiable info or delete it before you rely on the site. Search the file for `PLACEHOLDER` to find them all.

---

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

Other commands:

| Command         | What it does                                          |
| --------------- | ----------------------------------------------------- |
| `npm run build` | Production build. Vercel runs this on every deploy.   |
| `npm start`     | Serves the production build locally.                  |
| `npm run lint`  | Runs ESLint.                                          |

## Deploys

Vercel deploys production automatically from `main`. No Vercel config is needed.

Optional: in Vercel → Project → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL` to the real domain once you have one. Canonical URLs, Open Graph tags, and JSON-LD use it. Until then the site falls back to the Vercel production URL.

---

## Where to edit things

### All words, numbers, and contact info → `content/site.ts`

That one file controls everything on the page. You shouldn't need to touch any component to change content.

| What you want to change                                  | Look for in `content/site.ts`             |
| -------------------------------------------------------- | ----------------------------------------- |
| Phone, email, hours, address, license line, logo         | `business`                                |
| Page title, meta description, share text                 | `seo`                                     |
| Hero headline, subhead, buttons, trust strip             | `hero`                                    |
| "Trusted by" partner logos                               | `logoBar.logos`                           |
| The 4 big numbers                                        | `stats`                                   |
| Problems / how we prevent them                           | `problemSolution`                         |
| 3 featured testimonials (also shown beside the form)     | `testimonialsFeatured`                    |
| Short-quote review wall                                  | `testimonialsWall`                        |
| Service cards                                            | `services` (icons come from `components/Icon.tsx`) |
| Process steps                                            | `processSteps`                            |
| Project gallery photos + captions                        | `gallery.items`                           |
| Video testimonial (add `embedUrl` when you have a video) | `video`                                   |
| Guarantees + certification badges                        | `guarantee`                               |
| States/regions + map image                               | `serviceArea`                             |
| FAQ questions and answers                                | `faq.items`                               |
| Text on the repeating CTA bands                          | `ctaBands`                                |
| Form labels, thank-you message, texting-consent wording  | `quoteForm`                               |
| Footer blurb + links (privacy, terms, social)            | `footer`                                  |

When you change the phone number, update **both** `phoneDisplay` (what people see) and `phoneHref` / `smsHref` (what gets dialed).

### Colors → `app/globals.css`

The brand palette (navy + safety orange) is defined once in the `@theme` block at the top.

---

## Swapping placeholder images

Every placeholder lives in **`public/placeholders/`**. File names describe the real photo that belongs there:

| Placeholder file                                   | Real photo that goes there                      |
| -------------------------------------------------- | ----------------------------------------------- |
| `logo-mhs-pros-wordmark.svg`                       | Your logo (about 4:1 wide)                      |
| `hero-crew-setting-home.svg`                       | Crew setting a home on piers (wide, ~1600×1100) |
| `logo-partner-*.svg` (6)                           | Partner dealer / developer logos                |
| `testimonial-headshot-*.svg` (3)                   | Customer headshots (square)                     |
| `gallery-*.svg` (9)                                | Job photos (4:3, ~800×600 or larger)            |
| `video-poster-dealer-testimonial.svg`              | Video thumbnail (16:9)                          |
| `badge-*.svg` (4)                                  | Real certification / association badges         |
| `service-area-map.svg`                             | Static map of your coverage area                |

**To swap one:**

1. Put the real file in `public/images/`, e.g. `public/images/hero-crew-setting-home.jpg`.
2. In `content/site.ts`, change that item's `src` to `/images/hero-crew-setting-home.jpg`.
3. Update `width` and `height` to the photo's real pixel size (this prevents layout shift), and make sure `alt` describes what's actually in the photo.

JPG/PNG/WebP photos are resized and converted to AVIF/WebP automatically by `next/image`. To regenerate the placeholder graphics, run `node scripts/generate-placeholders.mjs`.

**Remote images:** `next.config.ts` allows `https://placehold.co`. If you host photos on a CDN, add its hostname to `images.remotePatterns` there.

**Social share image:** generated automatically from the content file by `app/opengraph-image.tsx`. To use a real photo, delete that file and add `app/opengraph-image.jpg` (1200×630).

---

## The quote form

- Client-side validation and server-side validation share the same rules (`lib/quote.ts`).
- The form posts to **`app/api/quote/route.ts`**. Right now it validates the lead, logs it (Vercel → Project → Logs, search for `[quote] new lead`), and returns success.
- A hidden honeypot field silently drops basic spam bots.
- **TODOs in `route.ts`:** forward each lead to email and to the LotStack CRM API. All credentials come from environment variables; see `.env.example` for the names (`QUOTE_NOTIFY_EMAIL`, `EMAIL_PROVIDER_API_KEY`, `LOTSTACK_API_URL`, `LOTSTACK_API_KEY`). Never commit secrets.
- Have the texting-consent wording (`quoteForm.smsConsentLabel`) reviewed for your SMS provider and TCPA requirements before you send texts.

## SEO

Title, description, Open Graph/Twitter tags, `HomeAndConstructionBusiness` JSON-LD, and `FAQPage` JSON-LD are all generated from `content/site.ts`. Rating/review markup is left out on purpose. Add it only once the ratings on the page are real.

## Project layout

```
app/
  layout.tsx              metadata, font
  page.tsx                section order + JSON-LD
  globals.css             palette + scroll-reveal
  opengraph-image.tsx     generated share image
  api/quote/route.ts      form endpoint (TODOs for email + LotStack)
components/
  sections.tsx            every page section
  ui.tsx                  buttons, CTA band, layout helpers
  QuoteForm.tsx           the form (client component)
  RevealObserver.tsx      scroll-reveal (respects reduced motion)
  Icon.tsx                inline SVG icons + star rating
content/site.ts           ← ALL content lives here
lib/quote.ts              shared form validation
public/placeholders/      placeholder images to replace
```
