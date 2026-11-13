import Image from "next/image";
import {
  business,
  faq,
  footer,
  gallery,
  guarantee,
  header,
  hero,
  logoBar,
  problemSolution,
  processSteps,
  quoteForm,
  serviceArea,
  services,
  stats,
  testimonialsFeatured,
  testimonialsWall,
  video,
  type Testimonial,
} from "@/content/site";
import { Icon, Stars } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { CallButton, Container, QuoteButton, QUOTE_ANCHOR, Section, SectionHeading, StarRule } from "@/components/ui";

const card = "rounded-xl border-2 border-navy-900 bg-cream-50";

/* ------------------------------------------------------------------ Header */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-navy-900 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/90">
      <div className="h-1.5 bg-brick" aria-hidden="true" />
      <Container className="flex h-20 items-center justify-between gap-3">
        <a href="#top" className="shrink-0" aria-label={`${business.name} — back to top`}>
          <Image
            src={business.logo.src}
            alt={business.logo.alt}
            width={business.logo.width}
            height={business.logo.height}
            priority
            sizes="120px"
            className="h-16 w-auto"
          />
        </a>
        <div className="flex items-center gap-2 sm:gap-5">
          <a
            href={business.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-display text-lg font-extrabold text-navy-900 hover:text-brick"
            aria-label={`Call ${business.phoneDisplay}`}
          >
            <Icon name="phone" className="h-5 w-5" />
            <span className="hidden sm:inline">{business.phoneDisplay}</span>
          </a>
          <a
            href={QUOTE_ANCHOR}
            className="inline-flex min-h-11 items-center rounded-lg border-2 border-navy-900 bg-brick px-4 font-display text-sm font-extrabold uppercase italic tracking-wide text-cream-50 shadow-retro-sm transition hover:bg-brick-dark sm:text-base"
          >
            {header.ctaLabel}
          </a>
        </div>
      </Container>
    </header>
  );
}

/* -------------------------------------------------------------------- Hero */
export function Hero() {
  const t = hero.trust;
  const trustItems = [
    { icon: null, top: <Stars rating={t.rating} className="h-4 w-4" />, bottom: `${t.rating} from ${t.ratingCount} ${t.ratingSource}` },
    { icon: "shield" as const, top: t.licensedLabel, bottom: t.licensedSub },
    { icon: "clock" as const, top: t.yearsLabel, bottom: t.yearsSub },
    { icon: "home" as const, top: t.homesLabel, bottom: t.homesSub },
  ];
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <Container className="relative grid items-center gap-12 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-16 lg:pt-20">
        <div className="min-w-0">
          <p className="font-display text-[13px] font-extrabold uppercase italic tracking-[0.1em] text-navy-900 sm:text-base sm:tracking-[0.12em]">
            {hero.eyebrow.split("★").map((part, i, arr) => (
              <span key={i}>
                <span className="whitespace-nowrap">
                  {part.trim()}
                  {i < arr.length - 1 && (
                    <span className="ml-2 text-brick" aria-hidden="true">
                      ★
                    </span>
                  )}
                </span>
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </p>
          <h1 id="hero-heading" className="mt-4">
            <span className="block font-display text-4xl font-black leading-[1.05] tracking-tight text-navy-900 text-balance sm:text-5xl lg:text-6xl">
              {hero.headline}
            </span>
            <span className="mt-2 block font-script text-4xl leading-tight text-brick sm:text-5xl lg:text-[3.6rem]">{hero.headlineAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">{hero.subhead}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <QuoteButton size="lg">{hero.primaryCta}</QuoteButton>
            <CallButton label={`${hero.secondaryCtaPrefix} ${business.phoneDisplay}`} className="text-lg" />
          </div>
        </div>

        {/* Photo with the logo's red sun behind it */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div aria-hidden="true" className="absolute -right-6 -top-8 aspect-square w-[78%] rounded-full border-4 border-navy-900 bg-brick sm:-right-10" />
          <div aria-hidden="true" className="absolute -bottom-6 -left-4 aspect-square w-24 rounded-full border-4 border-dashed border-navy-900/40 sm:w-32" />
          <div className="relative overflow-hidden rounded-2xl border-4 border-navy-900 shadow-retro">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Container>

      {/* Trust strip */}
      <Container className="relative pb-4">
        <ul className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl border-2 border-navy-900 bg-navy-900/25 shadow-retro md:grid-cols-4" aria-label="Why customers trust us">
          {trustItems.map((item, i) => (
            <li key={i} className="flex flex-col items-start gap-1.5 bg-cream-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 font-display font-extrabold text-navy-900">
                {item.icon && <Icon name={item.icon} className="h-5 w-5 shrink-0 text-brick" />}
                <span className="text-sm sm:text-base">{item.top}</span>
              </div>
              <span className="text-xs text-ink sm:text-sm">{item.bottom}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Logo bar */
export function LogoBar() {
  return (
    <section aria-labelledby="logos-heading" className="pb-12 pt-10 sm:pt-12">
      <Container>
        <h2 id="logos-heading" className="mb-8 text-center font-display text-sm font-extrabold uppercase italic tracking-[0.16em] text-ink">
          <span aria-hidden="true" className="mr-2 text-brick">★</span>
          {logoBar.heading}
          <span aria-hidden="true" className="ml-2 text-brick">★</span>
        </h2>
        <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6" data-reveal>
          {logoBar.logos.map((logo) => (
            <li key={logo.src} className="flex justify-center">
              <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-10 w-auto opacity-75 mix-blend-multiply grayscale sepia transition hover:opacity-100" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------- Stats */
export function StatsBand() {
  return (
    <section aria-label="By the numbers" className="border-y-4 border-navy-900 bg-navy-900">
      <Container className="py-12 sm:py-14">
        <dl className="grid grid-cols-2 gap-y-10 text-center md:grid-cols-4 md:divide-x-2 md:divide-dashed md:divide-cream/20">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-2" data-reveal>
              <dt className="mt-2 font-display text-sm font-bold uppercase italic tracking-wider text-cream-300 sm:text-base">{s.label}</dt>
              <dd className="font-display text-4xl font-black tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------- Problem/solution */
export function ProblemSolution() {
  const p = problemSolution;
  return (
    <Section labelledBy="problem-heading">
      <SectionHeading id="problem-heading" eyebrow={p.eyebrow} heading={p.heading} intro={p.intro} />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <ul className="space-y-5">
          {p.problems.map((item) => (
            <li key={item.title} className={`flex gap-4 p-5 ${card} shadow-retro-sm`} data-reveal>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-navy-900 bg-cream-200 text-brick">
                <Icon name="x" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold text-navy-900">{item.title}</h3>
                <p className="mt-1 text-ink">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border-2 border-navy-900 bg-navy-900 p-6 text-cream-50 shadow-[6px_6px_0_0_var(--color-brick)] sm:p-8" data-reveal>
          <h3 className="font-display text-2xl font-extrabold italic">{p.solutionsHeading}</h3>
          <ul className="mt-6 space-y-4">
            {p.solutions.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brick text-cream-50 ring-2 ring-cream-50/80">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-lg leading-relaxed text-cream-200">{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <QuoteButton tone="dark">Get a Quote</QuoteButton>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ Testimonials */
function TestimonialCard({ t, compact = false }: { t: Testimonial; compact?: boolean }) {
  return (
    <figure className={`relative flex h-full flex-col ${card} ${compact ? "p-5 shadow-retro-sm" : "p-6 shadow-retro sm:p-7"}`}>
      <span aria-hidden="true" className={`pointer-events-none absolute right-4 top-1 font-script leading-none text-brick/25 ${compact ? "text-6xl" : "text-8xl"}`}>
        &ldquo;
      </span>
      <Stars rating={t.rating} className={compact ? "h-4 w-4" : "h-5 w-5"} />
      <blockquote className={`mt-4 flex-1 text-navy-900 ${compact ? "text-base" : "text-lg leading-relaxed"}`}>
        <p>&ldquo;{t.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t-2 border-dashed border-navy-900/20 pt-4">
        {t.photo && (
          <Image src={t.photo.src} alt={t.photo.alt} width={48} height={48} className="h-12 w-12 shrink-0 rounded-full border-2 border-navy-900 object-cover" />
        )}
        <div>
          <div className="font-display font-extrabold text-navy-900">{t.name}</div>
          <div className="text-sm text-ink">
            {t.role} · {t.location}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialsFeatured() {
  return (
    <Section labelledBy="testimonials-heading" className="border-y-2 border-navy-900/10 bg-cream-200/70">
      <SectionHeading id="testimonials-heading" eyebrow="What customers say" heading="Dealers, developers, and homeowners call us back." />
      <ul className="grid gap-7 md:grid-cols-3">
        {testimonialsFeatured.map((t) => (
          <li key={t.name} data-reveal>
            <TestimonialCard t={t} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TestimonialsWall() {
  return (
    <Section labelledBy="wall-heading" className="border-y-2 border-navy-900/10 bg-cream-200/70">
      <SectionHeading id="wall-heading" eyebrow="More reviews" heading="Job after job, the same story." />
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 [&>li]:mb-5 [&>li]:break-inside-avoid">
        {testimonialsWall.map((t) => (
          <li key={t.name + t.quote.slice(0, 12)} data-reveal>
            <TestimonialCard t={t} compact />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------------- Services */
export function Services() {
  return (
    <Section labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        eyebrow="Services"
        heading="Everything it takes to set a home right."
        intro="One crew from blocking to trim-out — so nothing falls between trades."
      />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <li key={s.title} className={`p-6 ${card} shadow-retro-sm transition motion-safe:hover:-translate-y-1 hover:shadow-retro`} data-reveal>
            <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-navy-900 bg-brick text-cream-50 ring-4 ring-cream-200">
              <Icon name={s.icon} className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-lg font-extrabold text-navy-900">{s.title}</h3>
            <p className="mt-2 text-ink">{s.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ----------------------------------------------------------------- Process */
export function Process() {
  return (
    <Section labelledBy="process-heading" className="border-y-4 border-navy-900 bg-navy-900">
      <SectionHeading id="process-heading" eyebrow={processSteps.eyebrow} heading={processSteps.heading} tone="dark" />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-xl border-2 border-cream/25 bg-navy-800 p-6" data-reveal>
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-cream-50 bg-brick font-display text-xl font-black italic text-cream-50" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-lg font-extrabold text-cream-50">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-cream-200">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ----------------------------------------------------------------- Gallery */
export function Gallery() {
  return (
    <Section labelledBy="gallery-heading">
      <SectionHeading id="gallery-heading" eyebrow={gallery.eyebrow} heading={gallery.heading} />
      <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.items.map((g, i) => (
          <li key={g.src} data-reveal>
            {/* Snapshot-style frames, gently tilted */}
            <figure className={`${card} p-3 shadow-retro-sm ${i % 2 ? "sm:rotate-[0.8deg]" : "sm:-rotate-[0.8deg]"}`}>
              <Image
                src={g.src}
                alt={g.alt}
                width={g.width}
                height={g.height}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] h-auto w-full rounded-md border-2 border-navy-900 object-cover"
              />
              <figcaption className="px-1 pb-1 pt-3 font-display text-sm font-bold italic text-navy-900">{g.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------- Video */
export function VideoTestimonial() {
  return (
    <Section labelledBy="video-heading" className="pt-0 sm:pt-0 lg:pt-0">
      <SectionHeading id="video-heading" eyebrow={video.eyebrow} heading={video.heading} />
      <div className="mx-auto max-w-4xl" data-reveal>
        <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-navy-900 bg-navy-900 shadow-retro">
          {video.embedUrl ? (
            <iframe
              src={video.embedUrl}
              title={video.caption}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <Image src={video.poster.src} alt={video.poster.alt} fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-navy-950/30">
                <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-cream-50 bg-brick text-cream-50 shadow-retro sm:h-24 sm:w-24" aria-hidden="true">
                  <Icon name="play" className="ml-1 h-9 w-9 sm:h-10 sm:w-10" />
                </span>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-center italic text-ink">{video.caption}</p>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- Guarantee */
export function Guarantee() {
  return (
    <Section labelledBy="guarantee-heading">
      <SectionHeading id="guarantee-heading" eyebrow={guarantee.eyebrow} heading={guarantee.heading} />
      <ul className="grid gap-7 md:grid-cols-3">
        {guarantee.items.map((g) => (
          <li key={g.title} className={`p-7 text-center ${card} shadow-retro`} data-reveal>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-4 border-brick bg-navy-900 text-cream-50">
              <Icon name={g.icon} className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-xl font-extrabold italic text-navy-900">{g.title}</h3>
            <p className="mt-2 text-ink">{g.body}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10" aria-label="Certifications and memberships" data-reveal>
        {guarantee.badges.map((b) => (
          <li key={b.src}>
            <Image src={b.src} alt={b.alt} width={b.width} height={b.height} className="h-20 w-20 sm:h-24 sm:w-24" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------ Service area */
export function ServiceArea() {
  return (
    <Section labelledBy="area-heading" className="border-y-2 border-navy-900/10 bg-cream-200/70">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading id="area-heading" eyebrow={serviceArea.eyebrow} heading={serviceArea.heading} intro={serviceArea.intro} align="left" />
          <ul className="grid gap-3 sm:grid-cols-2" data-reveal>
            {serviceArea.regions.map((r) => (
              <li key={r.name} className="flex items-start gap-3 rounded-lg border-2 border-navy-900 bg-cream-50 p-4">
                <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-brick" />
                <div>
                  <div className="font-display font-extrabold text-navy-900">{r.name}</div>
                  <div className="text-sm text-ink">{r.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl border-4 border-navy-900 shadow-retro" data-reveal>
          <Image src={serviceArea.map.src} alt={serviceArea.map.alt} width={serviceArea.map.width} height={serviceArea.map.height} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full" />
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------------- FAQ */
export function Faq() {
  return (
    <Section labelledBy="faq-heading">
      <SectionHeading id="faq-heading" eyebrow={faq.eyebrow} heading={faq.heading} />
      {/* Native <details>/<summary>: keyboard + screen-reader friendly with zero JS. */}
      <div className={`mx-auto max-w-3xl divide-y-2 divide-dashed divide-navy-900/20 ${card} shadow-retro`}>
        {faq.items.map((item) => (
          <details key={item.q} className="group px-5 sm:px-6">
            <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-lg font-extrabold text-navy-900 hover:text-brick">
              <span>{item.q}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-navy-900 bg-cream-200 group-open:bg-brick group-open:text-cream-50">
                <Icon name="chevron" className="faq-chevron h-4 w-4 transition-transform motion-reduce:transition-none" />
              </span>
            </summary>
            <p className="pb-5 text-base leading-relaxed text-ink">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------- Final CTA + quote form */
export function QuoteSection() {
  const side = testimonialsFeatured.slice(0, 3);
  return (
    <section id="quote" aria-labelledby="quote-heading" className="border-t-4 border-navy-900 bg-navy-900 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <p className="font-script text-3xl leading-none text-cream-300 sm:text-4xl">{quoteForm.eyebrow}</p>
            <h2 id="quote-heading" className="mt-2 font-display text-3xl font-black tracking-tight text-cream-50 sm:text-4xl lg:text-5xl">
              {quoteForm.heading}
            </h2>
            <StarRule tone="dark" className="mb-8 mt-4 justify-start" />
            <QuoteForm />
          </div>
          <aside aria-labelledby="quote-side-heading" className="lg:pt-32">
            <h3 id="quote-side-heading" className="font-display text-xl font-extrabold italic text-cream-50">
              {quoteForm.sideHeading}
            </h3>
            <ul className="mt-5 space-y-4">
              {side.map((t) => (
                <li key={t.name} className="rounded-xl border-2 border-cream/20 bg-navy-800 p-5">
                  <Stars rating={t.rating} tone="dark" className="h-4 w-4" />
                  <blockquote className="mt-3 text-cream-200">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <p className="mt-3 text-sm font-semibold text-cream-50">
                    {t.name} <span className="font-normal text-cream-300">· {t.role}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border-2 border-dashed border-cream/35 p-5 text-cream-200">
              <p className="font-display font-extrabold italic text-cream-50">Rather talk it through?</p>
              <a href={business.phoneHref} className="mt-1 inline-flex items-center gap-2 font-display text-2xl font-black text-cream-50 underline decoration-brick decoration-4 underline-offset-4 hover:text-cream-300">
                <Icon name="phone" className="h-5 w-5" />
                {business.phoneDisplay}
              </a>
              <p className="mt-1 text-sm">{business.hours}</p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ Footer */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const a = business.address;
  return (
    <footer className="border-t-8 border-brick bg-navy-950 pb-28 pt-14 text-cream-200 md:pb-10">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="inline-block rounded-xl border-2 border-cream-50 bg-cream p-2">
              <Image src={business.logoFull.src} alt={business.logoFull.alt} width={business.logoFull.width} height={business.logoFull.height} sizes="240px" className="h-auto w-56" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{footer.blurb}</p>
            <p className="mt-3 text-sm">{business.licenseLine}</p>
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase italic tracking-wider text-cream-50">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={business.phoneHref} className="inline-flex items-center gap-2 hover:text-cream-50">
                  <Icon name="phone" className="h-4 w-4" /> {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2 hover:text-cream-50">
                  <Icon name="mail" className="h-4 w-4" /> {business.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="pin" className="h-4 w-4" />
                {[a.street, a.city, `${a.region} ${a.postalCode}`].filter(Boolean).join(", ")}
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4" /> {business.hours}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase italic tracking-wider text-cream-50">Service area</h2>
            <p className="mt-3 text-sm">{serviceArea.regions.map((r) => r.name).join(" ★ ")}</p>
            <nav aria-label="Footer" className="mt-5">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {footer.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="underline-offset-4 hover:text-cream-50 hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-12 border-t border-cream/15 pt-6 text-xs">
          © {year} {business.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------ Mobile bottom bar */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-navy-900 bg-cream-50/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={business.phoneHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-navy-900 bg-cream-50 font-display font-extrabold uppercase italic text-navy-900"
        >
          <Icon name="phone" className="h-5 w-5" /> Call
        </a>
        <a
          href={QUOTE_ANCHOR}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-navy-900 bg-brick font-display font-extrabold uppercase italic text-cream-50 shadow-retro-sm"
        >
          Get a Quote
        </a>
      </div>
    </div>
  );
}
