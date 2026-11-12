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
import { CallButton, Container, QuoteButton, QUOTE_ANCHOR, Section, SectionHeading } from "@/components/ui";

/* ------------------------------------------------------------------ Header */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-16 items-center justify-between gap-3">
        <a href="#top" className="shrink-0" aria-label={`${business.name} — back to top`}>
          <Image src={business.logo.src} alt={business.logo.alt} width={business.logo.width} height={business.logo.height} priority className="h-10 w-auto" />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={business.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-bold text-navy-900 hover:text-orange-700"
            aria-label={`Call ${business.phoneDisplay}`}
          >
            <Icon name="phone" className="h-5 w-5" />
            <span className="hidden sm:inline">{business.phoneDisplay}</span>
          </a>
          <a
            href={QUOTE_ANCHOR}
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-bold text-navy-950 hover:bg-accent-hover sm:text-base"
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
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.18),transparent_55%)]" />
      <Container className="relative grid items-center gap-10 pb-28 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-36 lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-orange-300">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">{hero.subhead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <QuoteButton size="lg">{hero.primaryCta}</QuoteButton>
            <CallButton label={`${hero.secondaryCtaPrefix} ${business.phoneDisplay}`} className="text-lg" />
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
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
      <Container className="relative -mt-20 pb-2 lg:-mt-24">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-slate-200 md:grid-cols-4" aria-label="Why customers trust us">
          {trustItems.map((item, i) => (
            <li key={i} className="flex flex-col items-start gap-1.5 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 font-extrabold text-navy-900">
                {item.icon && <Icon name={item.icon} className="h-5 w-5 shrink-0 text-orange-600" />}
                <span className="text-sm sm:text-base">{item.top}</span>
              </div>
              <span className="text-xs text-slate-600 sm:text-sm">{item.bottom}</span>
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
    <section aria-labelledby="logos-heading" className="bg-white pb-12 pt-12 sm:pt-14">
      <Container>
        <h2 id="logos-heading" className="mb-8 text-center text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
          {logoBar.heading}
        </h2>
        <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6" data-reveal>
          {logoBar.logos.map((logo) => (
            <li key={logo.src} className="flex justify-center">
              <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100" />
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
    <section aria-label="By the numbers" className="border-y border-slate-200 bg-navy-50">
      <Container className="py-12 sm:py-14">
        <dl className="grid grid-cols-2 gap-y-10 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-2" data-reveal>
              <dt className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600 sm:text-base">{s.label}</dt>
              <dd className="text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">{s.value}</dd>
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
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <ul className="space-y-4">
          {p.problems.map((item) => (
            <li key={item.title} className="flex gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-5" data-reveal>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                <Icon name="x" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-1 text-slate-600">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl bg-navy-900 p-6 text-white shadow-xl sm:p-8" data-reveal>
          <h3 className="text-2xl font-extrabold">{p.solutionsHeading}</h3>
          <ul className="mt-6 space-y-4">
            {p.solutions.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-navy-950">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="text-lg leading-relaxed text-slate-200">{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <QuoteButton>Get a Quote</QuoteButton>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ Testimonials */
function TestimonialCard({ t, compact = false }: { t: Testimonial; compact?: boolean }) {
  return (
    <figure className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "p-5" : "p-6 sm:p-7"}`}>
      <Stars rating={t.rating} className={compact ? "h-4 w-4" : "h-5 w-5"} />
      <blockquote className={`mt-4 flex-1 text-navy-900 ${compact ? "text-base" : "text-lg leading-relaxed"}`}>
        <p>&ldquo;{t.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {t.photo && (
          <Image src={t.photo.src} alt={t.photo.alt} width={48} height={48} className="h-12 w-12 shrink-0 rounded-full object-cover" />
        )}
        <div>
          <div className="font-bold text-navy-900">{t.name}</div>
          <div className="text-sm text-slate-600">
            {t.role} · {t.location}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialsFeatured() {
  return (
    <Section labelledBy="testimonials-heading" className="bg-navy-50">
      <SectionHeading id="testimonials-heading" eyebrow="What customers say" heading="Dealers, developers, and homeowners call us back." />
      <ul className="grid gap-6 md:grid-cols-3">
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
    <Section labelledBy="wall-heading" className="bg-navy-50">
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
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <li key={s.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none" data-reveal>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-orange-700">
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy-900">{s.title}</h3>
            <p className="mt-2 text-slate-600">{s.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ----------------------------------------------------------------- Process */
export function Process() {
  return (
    <Section labelledBy="process-heading" className="bg-navy-900">
      <SectionHeading id="process-heading" eyebrow={processSteps.eyebrow} heading={processSteps.heading} tone="dark" />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10" data-reveal>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-lg font-extrabold text-navy-950" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-slate-300">{step.body}</p>
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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.items.map((g) => (
          <li key={g.src} data-reveal>
            <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm font-semibold text-navy-900">{g.caption}</figcaption>
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
    <Section labelledBy="video-heading" className="bg-white pt-0 sm:pt-0 lg:pt-0">
      <SectionHeading id="video-heading" eyebrow={video.eyebrow} heading={video.heading} />
      <div className="mx-auto max-w-4xl" data-reveal>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-900 shadow-2xl">
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
                <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-navy-950 shadow-2xl ring-8 ring-white/20 sm:h-24 sm:w-24" aria-hidden="true">
                  <Icon name="play" className="ml-1 h-9 w-9 sm:h-10 sm:w-10" />
                </span>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-center text-slate-600">{video.caption}</p>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- Guarantee */
export function Guarantee() {
  return (
    <Section labelledBy="guarantee-heading">
      <SectionHeading id="guarantee-heading" eyebrow={guarantee.eyebrow} heading={guarantee.heading} />
      <ul className="grid gap-6 md:grid-cols-3">
        {guarantee.items.map((g) => (
          <li key={g.title} className="rounded-2xl border-2 border-navy-900 bg-white p-7 text-center" data-reveal>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-accent">
              <Icon name={g.icon} className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">{g.title}</h3>
            <p className="mt-2 text-slate-600">{g.body}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10" aria-label="Certifications and memberships" data-reveal>
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
    <Section labelledBy="area-heading" className="bg-navy-50">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading id="area-heading" eyebrow={serviceArea.eyebrow} heading={serviceArea.heading} intro={serviceArea.intro} align="left" />
          <ul className="grid gap-3 sm:grid-cols-2" data-reveal>
            {serviceArea.regions.map((r) => (
              <li key={r.name} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <div className="font-bold text-navy-900">{r.name}</div>
                  <div className="text-sm text-slate-600">{r.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200" data-reveal>
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
      <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {faq.items.map((item) => (
          <details key={item.q} className="group px-5 sm:px-6">
            <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 py-4 text-left text-lg font-bold text-navy-900 hover:text-orange-700">
              <span>{item.q}</span>
              <Icon name="chevron" className="faq-chevron h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none" />
            </summary>
            <p className="pb-5 text-base leading-relaxed text-slate-600">{item.a}</p>
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
    <section id="quote" aria-labelledby="quote-heading" className="bg-navy-900 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-accent">{quoteForm.eyebrow}</p>
            <h2 id="quote-heading" className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {quoteForm.heading}
            </h2>
            <QuoteForm />
          </div>
          <aside aria-labelledby="quote-side-heading" className="lg:pt-24">
            <h3 id="quote-side-heading" className="text-xl font-extrabold text-white">
              {quoteForm.sideHeading}
            </h3>
            <ul className="mt-5 space-y-4">
              {side.map((t) => (
                <li key={t.name} className="rounded-2xl bg-navy-800 p-5 ring-1 ring-white/10">
                  <Stars rating={t.rating} className="h-4 w-4" />
                  <blockquote className="mt-3 text-slate-200">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <p className="mt-3 text-sm font-semibold text-white">
                    {t.name} <span className="font-normal text-slate-400">· {t.role}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-white/15 p-5 text-slate-300">
              <p className="font-semibold text-white">Rather talk it through?</p>
              <a href={business.phoneHref} className="mt-1 inline-flex items-center gap-2 text-xl font-extrabold text-accent hover:underline">
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
    <footer className="bg-navy-950 pb-28 pt-14 text-slate-400 md:pb-10">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-white">{business.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">{footer.blurb}</p>
            <p className="mt-3 text-sm">{business.licenseLine}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={business.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
                  <Icon name="phone" className="h-4 w-4" /> {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2 hover:text-white">
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Service area</h2>
            <p className="mt-3 text-sm">{serviceArea.regions.map((r) => r.name).join(" · ")}</p>
            <nav aria-label="Footer" className="mt-5">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {footer.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="underline-offset-4 hover:text-white hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs">
          © {year} {business.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------ Mobile bottom bar */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,31,51,0.12)] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={business.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-navy-900 font-bold text-navy-900">
          <Icon name="phone" className="h-5 w-5" /> Call
        </a>
        <a href={QUOTE_ANCHOR} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent font-bold text-navy-950">
          Get a Quote
        </a>
      </div>
    </div>
  );
}
