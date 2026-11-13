import { business, ctaBands, disclosure, faq, partner, seo, services, serviceArea } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { CtaBand } from "@/components/ui";
import { RevealObserver } from "@/components/RevealObserver";
import {
  Faq,
  Gallery,
  Guarantee,
  Hero,
  LogoBar,
  MobileCtaBar,
  Partnership,
  ProblemSolution,
  Process,
  QuoteSection,
  ServiceArea,
  Services,
  SiteFooter,
  SiteHeader,
  StatsBand,
  TestimonialsFeatured,
  TestimonialsWall,
  VideoTestimonial,
} from "@/components/sections";

function jsonLd() {
  const url = siteUrl();
  const a = business.address;
  // NOTE: No aggregateRating/review markup on purpose — only add it once ratings are real
  // and shown on the page, or Google may penalize it.
  const partnerId = `${url}/#fulfillment-partner`;
  // Compliance: MHSP is described as the marketing / quoting / coordination business (generic LocalBusiness),
  // NOT a construction or installation contractor. Every setup service names Shark Management Group, LLC
  // (the licensed setup contractor) as its provider.
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${url}/#business`,
      name: business.name,
      description: `${seo.description} ${disclosure}`,
      slogan: business.roleLine,
      url,
      telephone: business.phoneHref.replace("tel:", ""),
      email: business.email,
      image: `${url}/opengraph-image.jpg`,
      logo: `${url}${business.logoFull.src}`,
      foundingDate: String(business.foundedYear),
      address: {
        "@type": "PostalAddress",
        ...(a.street ? { streetAddress: a.street } : {}),
        addressLocality: a.city,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.country,
      },
      areaServed: serviceArea.regions.map((r) => ({ "@type": "AdministrativeArea", name: r.name })),
      knowsAbout: ["Manufactured home setup quotes", "Project coordination", "Customer onboarding"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Manufactured home setup services (installed by Shark Management Group, LLC)",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          offeredBy: { "@id": `${url}/#business` },
          itemOffered: { "@type": "Service", name: s.title, description: s.body, provider: { "@id": partnerId } },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "@id": partnerId,
      name: partner.name,
      url: partner.url,
      description: partner.role,
      logo: `${url}${partner.logo.src}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  // Escape "<" so content can never break out of the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-navy-900"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        {/* 1–4: hook + instant proof */}
        <Hero />
        <LogoBar />
        <StatsBand />
        <CtaBand {...ctaBands.afterStats} />

        {/* 5–6: problem, who does what, then people vouching */}
        <ProblemSolution />
        <Partnership />
        <TestimonialsFeatured />
        <CtaBand {...ctaBands.afterTestimonials} />

        {/* 7–8: what we do + how */}
        <Services />
        <Process />
        <CtaBand {...ctaBands.afterProcess} />

        {/* 9–11: show the work, then more proof */}
        <Gallery />
        <VideoTestimonial />
        <TestimonialsWall />
        <CtaBand {...ctaBands.afterWall} />

        {/* 12–13: risk reversal + where */}
        <Guarantee />
        <ServiceArea />
        <CtaBand {...ctaBands.afterServiceArea} />

        {/* 14–15: objections, then the ask */}
        <Faq />
        <QuoteSection />
      </main>
      <SiteFooter />
      <MobileCtaBar />
      <RevealObserver />
    </>
  );
}
