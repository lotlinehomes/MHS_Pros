/**
 * ============================================================================
 *  SITE CONTENT — the ONLY file you need to edit to change words, numbers,
 *  testimonials, logos, photos, phone, email, and service area.
 * ============================================================================
 *
 *  Rules of the road:
 *  - Anything marked `// PLACEHOLDER` is fake. Replace it with real, verifiable
 *    info (or delete it) before you rely on this site to sell. Do NOT ship fake
 *    testimonials, ratings, or stats as real.
 *  - Image paths point to /public. To swap a photo, drop your real file into
 *    /public/images (or /public/placeholders) and change the `src` here.
 *    Keep the `alt` text accurate to what the real photo shows.
 *  - Icons are picked by name from components/Icon.tsx.
 *  - COMPLIANCE: Mobile Home Setup Pros (MHSP) is the marketing, quoting, and
 *    customer-coordination front end. It does NOT hold an installer license and
 *    does NOT perform installation. All licensed manufactured-home setup and
 *    field work is performed by fulfillment partner Shark Management Group, LLC
 *    (see `partner` below). Keep every word on the site consistent with that —
 *    never write "we install / our crews set" as if MHSP does the work.
 *
 *  Search this file for "PLACEHOLDER" to find everything that still needs
 *  real content.
 * ============================================================================
 */

import type { IconName } from "@/components/Icon";

export type ImageRef = { src: string; alt: string; width: number; height: number };

// ---------------------------------------------------------------------------
// Business basics
// ---------------------------------------------------------------------------
export const business = {
  name: "Mobile Home Setup Pros",
  shortName: "MHS Pros",
  tagline: "Manufactured & mobile home setup, done right the first time.",
  phoneDisplay: "(555) 555-0123", // PLACEHOLDER
  phoneHref: "tel:+15555550123", // PLACEHOLDER — keep digits in sync with phoneDisplay
  smsHref: "sms:+15555550123", // PLACEHOLDER
  email: "quotes@example.com", // PLACEHOLDER
  // Street address is optional for a service-area business. Leave blank to hide it.
  address: {
    street: "", // PLACEHOLDER
    city: "Anytown", // PLACEHOLDER
    region: "ST", // PLACEHOLDER — 2-letter state
    postalCode: "00000", // PLACEHOLDER
    country: "US",
  },
  hours: "Mon–Fri 7am–6pm · Sat by appointment", // PLACEHOLDER
  // MHSP does not hold an installer license. Licensing lives on `partner` below.
  roleLine: "Marketing, quoting & project coordination",
  foundedYear: 2025, // PLACEHOLDER
  // Brand logo. The header uses a tighter crop (no tagline lines); the full lockup is used in the footer.
  logo: {
    src: "/brand/mhs-pros-logo-header.webp",
    alt: "Mobile Home Setup Pros logo",
    width: 1260,
    height: 800,
  } satisfies ImageRef,
  logoFull: {
    src: "/brand/mhs-pros-logo-full.webp",
    alt: "Mobile Home Setup Pros — Site Prep, Installation, Finishing — 40 Years of Experience",
    width: 1536,
    height: 1024,
  } satisfies ImageRef,
};

// ---------------------------------------------------------------------------
// Fulfillment partner — the licensed setup contractor
// ---------------------------------------------------------------------------
export const partner = {
  name: "Shark Management Group, LLC",
  shortName: "Shark Management Group",
  url: "https://sharkmanagementgroupllc.com/",
  role: "Licensed manufactured-home setup contractor & fulfillment partner",
  // PLACEHOLDER — Shark's actual state installer license number(s) and state(s). Do not publish until confirmed.
  licenseLine: "Manufactured-home installer license # PLACEHOLDER (state PLACEHOLDER)",
  // PLACEHOLDER — confirm Shark's general liability & workers' comp coverage before relying on this.
  insuranceLine: "Certificates of insurance available on request.",
  // Official vector logo supplied by Shark (transparent SVG).
  // Full lockup (wordmark + "Licensed Setup Contractor") — used in the partnership section and footer.
  logo: {
    src: "/brand/shark-management-logo.svg",
    alt: "Shark Management Group, LLC logo — Licensed Setup Contractor",
    width: 1475,
    height: 807,
  } satisfies ImageRef,
  // Circular shark-fin emblem only (same artwork, cropped viewBox) — used in the compact header lockup.
  mark: {
    src: "/brand/shark-management-mark.svg",
    alt: "Shark Management Group, LLC",
    width: 570,
    height: 570,
  } satisfies ImageRef,
};

/** Plain-English disclosure. Shown in the partnership section and the footer. */
export const disclosure =
  "Mobile Home Setup Pros is the marketing, quoting, and customer-coordination front end. All licensed manufactured-home installation work is performed by our fulfillment partner, Shark Management Group, LLC.";

// ---------------------------------------------------------------------------
// Partnership / operating model section
// ---------------------------------------------------------------------------
export const partnership = {
  eyebrow: "Who does what",
  heading: "Two companies. One accountable team.",
  intro:
    "You deal with one point of contact from your first quote to the final walkthrough. Behind that, each company does the part it's set up to do.",
  mhsp: {
    tag: "Front end · Your point of contact",
    title: "Mobile Home Setup Pros",
    body: "Our marketing, customer service, quoting, and onboarding team. We're who you talk to.",
    points: [
      "Handles your quote request and scopes the job",
      "Coordinates site readiness before the home moves",
      "Assigns a dedicated project coordinator as your single point of contact",
      "Keeps schedule, paperwork, and updates moving",
    ],
  },
  shark: {
    tag: "Licensed setup contractor · Fulfillment partner",
    title: "Shark Management Group, LLC",
    body: "Our licensed manufactured-home setup contractor. Their licensed setup crews do the physical work in the field.",
    points: [
      "Physical installation and placement of the home",
      "Blocking, leveling, piers, and anchoring / tie-downs",
      "Marriage-line work on multi-section homes",
      "All other on-site setup work",
    ],
    linkLabel: "Visit Shark Management Group",
  },
};

// ---------------------------------------------------------------------------
// SEO (title, description, Open Graph, JSON-LD all read from here)
// ---------------------------------------------------------------------------
export const seo = {
  title: "Mobile Home Setup Pros | Manufactured & Mobile Home Setup Quotes",
  description:
    "Manufactured and mobile home setup quotes with a dedicated project coordinator, for dealers, developers, investors, and homeowners. Licensed installation (blocking, leveling, anchoring, marriage lines) is performed by fulfillment partner Shark Management Group, LLC.",
  // The official site address. Used for the canonical URL, share previews, sitemap, and Google's business data.
  // (Setting the NEXT_PUBLIC_SITE_URL env var in Vercel overrides this.)
  siteUrl: "https://mobilehomesetuppros.com",
  keywords: [
    "mobile home setup",
    "manufactured home installation",
    "mobile home blocking and leveling",
    "mobile home tie-downs",
    "multi-section marriage line",
    "mobile home skirting",
  ],
};

// ---------------------------------------------------------------------------
// Header / navigation
// ---------------------------------------------------------------------------
export const header = {
  ctaLabel: "Get a Quote",
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const hero = {
  eyebrow: "Quoting ★ Coordination ★ Licensed Partner Installs",
  // Headline renders in two parts: bold slab line, then a red script line underneath.
  // PLACEHOLDER — confirm whose experience the "40 years" refers to (MHSP principals vs. Shark crews).
  headline: "40 years of combined setup experience.",
  headlineAccent: "Level, anchored & inspection-ready.",
  subhead:
    "One point of contact from quote to final walkthrough. We scope the job and coordinate your site — the setup itself is performed by the licensed crews of our fulfillment partner, Shark Management Group, LLC.",
  primaryCta: "Get My Setup Quote",
  secondaryCtaPrefix: "Call",
  image: {
    src: "/images/work/01-finished-charcoal-white-gravel-drive.webp",
    alt: "Finished charcoal and white manufactured home with block skirting, wood entry steps and a new gravel driveway",
    width: 1448,
    height: 1086,
  } satisfies ImageRef,
  trust: {
    rating: 4.9, // PLACEHOLDER
    ratingCount: "120+", // PLACEHOLDER
    ratingSource: "Google reviews", // PLACEHOLDER
    licensedLabel: "Licensed partner installs",
    licensedSub: "By Shark Management Group, LLC · Lic. # PLACEHOLDER", // PLACEHOLDER — Shark's license #
    yearsLabel: "40 yrs combined experience", // PLACEHOLDER — confirm attribution
    yearsSub: "Industry veterans",
    homesLabel: "1,500+ homes set", // PLACEHOLDER — confirm number and attribution
    homesSub: "Single & multi-section",
  },
};

// ---------------------------------------------------------------------------
// Logo bar
// ---------------------------------------------------------------------------
export const logoBar = {
  heading: "Trusted by dealers and developers",
  logos: [
    // PLACEHOLDER — every logo below is fake. Only show real partners who said yes.
    { src: "/placeholders/logo-partner-dealer-1.svg", alt: "Partner dealer logo placeholder 1", width: 160, height: 48 },
    { src: "/placeholders/logo-partner-dealer-2.svg", alt: "Partner dealer logo placeholder 2", width: 160, height: 48 },
    { src: "/placeholders/logo-partner-developer-3.svg", alt: "Land developer logo placeholder 3", width: 160, height: 48 },
    { src: "/placeholders/logo-partner-community-4.svg", alt: "Community operator logo placeholder 4", width: 160, height: 48 },
    { src: "/placeholders/logo-partner-investor-5.svg", alt: "Investor group logo placeholder 5", width: 160, height: 48 },
    { src: "/placeholders/logo-partner-manufacturer-6.svg", alt: "Manufacturer logo placeholder 6", width: 160, height: 48 },
  ] satisfies ImageRef[],
};

// ---------------------------------------------------------------------------
// Stats band
// ---------------------------------------------------------------------------
export const stats = [
  { value: "40+", label: "Years combined experience" },
  { value: "1,500+", label: "Homes set" }, // PLACEHOLDER
  { value: "6", label: "States served" }, // PLACEHOLDER
  { value: "98%", label: "On-time setups" }, // PLACEHOLDER
];

// ---------------------------------------------------------------------------
// Problem / solution
// ---------------------------------------------------------------------------
export const problemSolution = {
  eyebrow: "Why setup matters",
  heading: "A bad setup costs more than a good one.",
  intro:
    "The home is only as good as what it sits on. Most setup problems trace back to a rushed or sloppy set.",
  problems: [
    { title: "Failed inspections", body: "Wrong pier spacing, missing anchors, or no paperwork means a re-inspection and another week of waiting." },
    { title: "Delays that stack up", body: "A crew that no-shows or runs out of material pushes back utilities, trim-out, and your closing date." },
    { title: "Unlevel, unsealed homes", body: "Sticking doors, cracked drywall, and a leaky marriage line show up months later — on your dime." },
  ],
  solutionsHeading: "How we prevent it",
  solutions: [
    "Every set is performed by Shark Management Group's licensed crews to the manufacturer's installation manual and your local code — every pier, every anchor.",
    "We coordinate a site-readiness check before the home moves, so the pad, access, and materials are ready on day one.",
    "Laser-level blocking by the licensed setup crew, then a re-check after the marriage line is sealed.",
    "Your project coordinator delivers photo documentation and runs the punch list at walkthrough, so the inspector sees the work.",
  ],
};

// ---------------------------------------------------------------------------
// Testimonials (used in wall #1, wall #2, and beside the quote form)
// ---------------------------------------------------------------------------
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  photo?: ImageRef;
};

// PLACEHOLDER — ALL testimonials below are invented examples. Replace with real
// customer quotes (with their permission) before launch.
export const testimonialsSection = {
  featuredEyebrow: "What customers say",
  featuredHeading: "Dealers, developers, and homeowners call us back.",
  wallEyebrow: "More reviews",
  wallHeading: "Job after job, the same story.",
};

export const testimonialsFeatured: Testimonial[] = [
  {
    quote:
      "We had three homes land the same week and they set all three without a hiccup. Every one passed inspection on the first visit. That doesn't happen often.",
    name: "Jordan P.", // PLACEHOLDER
    role: "Sales Manager, Placeholder Home Center", // PLACEHOLDER
    location: "Anytown, ST", // PLACEHOLDER
    rating: 5,
    photo: { src: "/placeholders/testimonial-headshot-dealer-manager.svg", alt: "Headshot placeholder for a dealer sales manager", width: 96, height: 96 },
  },
  {
    quote:
      "They walked the lots before delivery and caught a grading issue that would've cost us a month. Straight shooters and they answer the phone.",
    name: "Casey R.", // PLACEHOLDER
    role: "Land Developer, Placeholder Land Co.", // PLACEHOLDER
    location: "Sampleville, ST", // PLACEHOLDER
    rating: 5,
    photo: { src: "/placeholders/testimonial-headshot-land-developer.svg", alt: "Headshot placeholder for a land developer", width: 96, height: 96 },
  },
  {
    quote:
      "First home we ever bought. They explained every step, the house is dead level, and the doors close like they should. Couldn't ask for more.",
    name: "Taylor & Sam M.", // PLACEHOLDER
    role: "Homeowners", // PLACEHOLDER
    location: "Exampletown, ST", // PLACEHOLDER
    rating: 5,
    photo: { src: "/placeholders/testimonial-headshot-homeowners.svg", alt: "Headshot placeholder for homeowners", width: 96, height: 96 },
  },
];

// PLACEHOLDER — ALL short quotes below are invented examples.
export const testimonialsWall: Testimonial[] = [
  { quote: "On time, on budget, and the marriage line is tight. Our go-to crew now.", name: "Alex D.", role: "Dealer Owner", location: "Anytown, ST", rating: 5 },
  { quote: "Set a 4-home infill project in under two weeks. Inspector had nothing to write up.", name: "Morgan T.", role: "Investor", location: "Sampleville, ST", rating: 5 },
  { quote: "They sent photos of every pier and anchor. Made the bank and the inspector happy.", name: "Riley K.", role: "Project Manager", location: "Exampletown, ST", rating: 5 },
  { quote: "Honest quote, no surprise add-ons. That alone earns my repeat business.", name: "Jamie L.", role: "Homeowner", location: "Testburg, ST", rating: 5 },
  { quote: "Skirting and steps looked factory-finished. Buyers noticed.", name: "Drew H.", role: "Community Manager", location: "Anytown, ST", rating: 5 },
  { quote: "Weather pushed our delivery twice and they rolled with it. Zero drama.", name: "Quinn B.", role: "Land Developer", location: "Sampleville, ST", rating: 5 },
  { quote: "Re-leveled a home another crew set crooked. Doors finally close.", name: "Avery S.", role: "Homeowner", location: "Exampletown, ST", rating: 5 },
  { quote: "Clear communication from quote to walkthrough. They just get it done.", name: "Parker W.", role: "Dealer Sales Rep", location: "Testburg, ST", rating: 4 },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const servicesSection = {
  eyebrow: "Services",
  heading: "Everything it takes to set a home right.",
  intro: "One point of contact from quote to trim-out. We scope and coordinate; the licensed work is performed by Shark Management Group, LLC.",
  note: "Installation and on-site work listed above is performed by our licensed fulfillment partner, Shark Management Group, LLC. Mobile Home Setup Pros provides quoting, scheduling, and project coordination.",
};

export const services: { icon: IconName; title: string; body: string }[] = [
  { icon: "home", title: "Single & multi-section setup", body: "Singlewides, doublewides, and triples set by licensed crews to the manufacturer's manual and local code." },
  { icon: "level", title: "Blocking & leveling", body: "Laser-leveled blocking with proper pier spacing so the home stays square for decades." },
  { icon: "anchor", title: "Piers, anchors & tie-downs", body: "Engineered piers, ground anchors, and straps rated for your soil and wind zone." },
  { icon: "link", title: "Marriage line", body: "Halves joined, fastened, and sealed — roof, floor, and walls — so it's tight and weatherproof." },
  { icon: "plug", title: "Utility hookup coordination", body: "We line up and coordinate water, sewer, and electric connections with the appropriately licensed trades." },
  { icon: "skirting", title: "Skirting", body: "Vinyl, metal, or faux-stone skirting with ventilation, installed clean and straight." },
  { icon: "steps", title: "Steps & decks", body: "Code-compliant steps, landings, and decks so the home is ready to walk into." },
  { icon: "clipboard", title: "Trim-out & inspection-ready", body: "Interior and exterior trim-out, punch list, and documentation ready for the inspector." },
];

// ---------------------------------------------------------------------------
// Process
// ---------------------------------------------------------------------------
export const processSteps = {
  eyebrow: "How it works",
  heading: "From quote to keys in five steps.",
  // `by` shows which company handles each step ("Shark crew" = Shark Management Group, LLC's licensed setup crew).
  steps: [
    { title: "Request a quote", by: "MHSP", body: "Tell us about the home and the site. We reply within one business day and assign your project coordinator." },
    { title: "Site check", by: "MHSP", body: "Your coordinator confirms the pad, access, and permit requirements with you before the home ships." },
    { title: "Set & level", by: "Shark crew", body: "The licensed setup crew places, blocks, levels, and anchors the home. Multi-sections are married and sealed." },
    { title: "Finish work", by: "Shark crew", body: "Skirting, steps, and trim-out by the field crew, while your coordinator keeps utilities and the schedule on track." },
    { title: "Final walkthrough", by: "MHSP + Shark", body: "Your coordinator and the crew lead walk it with you, close the punch list, and hand over photos for the inspector." },
  ],
};

// ---------------------------------------------------------------------------
// Project gallery
// ---------------------------------------------------------------------------
// Real job photos (Sept–Nov 2026), stored in /public/images/work.
export const gallery = {
  eyebrow: "Recent work",
  heading: "Recent setups.",
  intro: "Projects coordinated by Mobile Home Setup Pros and installed by the licensed crews of Shark Management Group, LLC.",
  items: [
    { src: "/images/work/01-finished-charcoal-white-gravel-drive.webp", alt: "Finished charcoal and white manufactured home with block skirting, wood entry steps and a gravel driveway", caption: "Finished: skirted, stepped & gravel drive", width: 1448, height: 1086 },
    { src: "/images/work/02-finished-blue-white-skirted-steps.webp", alt: "Blue and white manufactured home with block skirting and new wood steps on a cleared lot", caption: "Turnkey: set, skirted & stepped", width: 1448, height: 1086 },
    { src: "/images/work/03-finished-sage-green-landscaped.webp", alt: "Sage green and white manufactured home with skirting, wood stairs, new shrubs and a gravel driveway", caption: "Turnkey finish with landscaping", width: 1448, height: 1086 },
    { src: "/images/work/04-white-home-new-wood-steps.webp", alt: "White manufactured home with black shutters set on block piers with new pressure-treated steps", caption: "New wood steps & landing", width: 1448, height: 1086 },
    { src: "/images/work/05-piers-and-tie-down-straps.webp", alt: "Stacked block piers and steel tie-down straps over a vapor barrier under a gray manufactured home", caption: "Piers & tie-down straps", width: 1448, height: 1086 },
    { src: "/images/work/06-high-piers-sloped-lot.webp", alt: "Manufactured home set on tall block piers over a vapor barrier on a sloped wooded lot", caption: "High piers on a sloped lot", width: 1448, height: 1086 },
    { src: "/images/work/07-block-piers-vapor-barrier.webp", alt: "Beige manufactured home on stacked block piers with a vapor barrier underneath", caption: "Block piers over vapor barrier", width: 1448, height: 1086 },
    { src: "/images/work/08-charcoal-home-set-on-piers.webp", alt: "Charcoal manufactured home set and leveled on block piers on a cleared wooded lot", caption: "Set & leveled on block piers", width: 1448, height: 1086 },
    { src: "/images/work/09-green-home-graded-lot.webp", alt: "Dark green and beige manufactured home set on a freshly graded lot", caption: "Set on a freshly graded lot", width: 1448, height: 1086 },
    { src: "/images/work/10-white-home-newly-set.webp", alt: "White manufactured home with black shutters newly set on block piers", caption: "Just set, ready for finishing", width: 1448, height: 1086 },
    { src: "/images/work/11-green-home-piers-going-in.webp", alt: "Light green manufactured home on block piers with vapor barrier going down", caption: "Piers & vapor barrier going in", width: 1448, height: 1086 },
    { src: "/images/work/12-white-home-sandy-lot.webp", alt: "White manufactured home with black shutters set on piers on a sandy lot", caption: "Set on a sandy lot", width: 1448, height: 1086 },
  ],
};

// ---------------------------------------------------------------------------
// Video testimonial (no real video yet)
// ---------------------------------------------------------------------------
export const video = {
  eyebrow: "Hear it from a customer",
  heading: "“They made it easy.”",
  caption: "Video coming soon — a dealer walks through a recent multi-section set.", // PLACEHOLDER
  // PLACEHOLDER — when a real video exists, set `embedUrl` (e.g. a YouTube/Vimeo embed URL).
  embedUrl: "",
  poster: {
    src: "/placeholders/video-poster-dealer-testimonial.svg",
    alt: "Video thumbnail placeholder: dealer standing in front of a newly set home",
    width: 1280,
    height: 720,
  } satisfies ImageRef,
};

// ---------------------------------------------------------------------------
// Guarantee & badges
// ---------------------------------------------------------------------------
export const guarantee = {
  eyebrow: "Our promise",
  heading: "We stand behind every set.",
  items: [
    { icon: "shield", title: "Workmanship guarantee", body: "If something in the installation isn't right, your coordinator gets the licensed crew back out to make it right. 1-year workmanship guarantee." }, // PLACEHOLDER — confirm real terms AND which company issues the warranty
    { icon: "badge", title: "Licensed installation partner", body: "Every install is performed by Shark Management Group, LLC, our licensed manufactured-home setup contractor. License # PLACEHOLDER. Certificates of insurance on request." }, // PLACEHOLDER — Shark's license # and coverage
    { icon: "clipboard", title: "Inspection-ready promise", body: "Every set follows code and the manufacturer's installation manual. If something is missed on inspection, we get it corrected at no cost to you." }, // PLACEHOLDER — confirm real terms and who carries the obligation
  ] satisfies { icon: IconName; title: string; body: string }[],
  // PLACEHOLDER — certification badges are fake. Only show certifications actually held, and by whom
  // (installer licenses/certifications belong to Shark Management Group, not MHSP).
  badges: [
    { src: "/placeholders/badge-state-installer-license.svg", alt: "Placeholder for Shark Management Group's state installer license badge", width: 120, height: 120 },
    { src: "/placeholders/badge-industry-association-member.svg", alt: "Industry association membership badge placeholder", width: 120, height: 120 },
    { src: "/placeholders/badge-manufacturer-certified-installer.svg", alt: "Placeholder for Shark Management Group's manufacturer-certified installer badge", width: 120, height: 120 },
    { src: "/placeholders/badge-bbb-accredited.svg", alt: "Business accreditation badge placeholder", width: 120, height: 120 },
  ] satisfies ImageRef[],
};

// ---------------------------------------------------------------------------
// Service area
// ---------------------------------------------------------------------------
export const serviceArea = {
  eyebrow: "Service area",
  heading: "Where we work.",
  intro: "Based in Anytown, ST. We travel up to about 250 miles for multi-home projects. Not sure if you're in range? Ask.", // PLACEHOLDER
  // PLACEHOLDER — real states / regions go here.
  regions: [
    { name: "State One", detail: "Statewide" },
    { name: "State Two", detail: "Northern & central counties" },
    { name: "State Three", detail: "Metro areas" },
    { name: "State Four", detail: "Eastern region" },
    { name: "State Five", detail: "Multi-home projects only" },
    { name: "State Six", detail: "Multi-home projects only" },
  ],
  map: {
    src: "/placeholders/service-area-map.svg", // PLACEHOLDER — static map image of your coverage area
    alt: "Map placeholder showing the general service area",
    width: 900,
    height: 600,
  } satisfies ImageRef,
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export const faq = {
  eyebrow: "FAQ",
  heading: "Straight answers.",
  items: [
    { q: "How much does a mobile home setup cost?", a: "It depends on the number of sections, site conditions, distance, and what's included (skirting, steps, trim-out). Most single-section setups and multi-section setups are quoted as a flat price after we know the home and the site. Send us the details and we'll give you a real number, not a range." }, // PLACEHOLDER — add real pricing guidance if you want
    { q: "How long does a setup take?", a: "A typical single-section set is done in 1–2 days. Multi-sections usually take 2–4 days depending on the marriage line, weather, and finish work. We'll give you a schedule with your quote." }, // PLACEHOLDER — confirm timelines
    { q: "Who actually installs my home?", a: "Shark Management Group, LLC, our licensed manufactured-home setup contractor and fulfillment partner. Their licensed crews do the physical installation, blocking, leveling, anchoring, marriage-line, and other on-site work. Mobile Home Setup Pros handles your quote, onboarding, and scheduling, and assigns a project coordinator who stays your single point of contact." },
    { q: "Do you handle permits and inspections?", a: "Installations are performed by Shark Management Group's licensed crews to code and the manufacturer's installation manual, and your coordinator will work with your inspector. Permit requirements vary by county — we'll tell you what's needed and help line up permits with the licensed installer where allowed." },
    { q: "What's included in a standard setup?", a: "Placement, blocking and leveling, piers, anchors and tie-downs, and (for multi-sections) the marriage line. Skirting, steps/decks, trim-out, and utility coordination can be added — your quote spells out exactly what's in and what's not." },
    { q: "Can you handle multi-section homes?", a: "Yes — doublewides, triples, and larger. Shark Management Group's licensed crews join and seal the marriage line, one of the most important parts of the job and where experience shows." },
    { q: "How far will you travel?", a: "Our core area is listed above. We regularly travel farther for multi-home projects. If you're outside the area, ask — travel may be added to the quote." }, // PLACEHOLDER
    { q: "Do you work with dealers and developers on volume?", a: "Yes. We work with dealers, land developers, and investors on recurring and multi-lot projects, with scheduling built around your delivery dates." },
    { q: "Can you fix a home someone else set?", a: "Often, yes. Re-leveling, re-anchoring, and marriage-line repairs can be quoted through us and are performed by Shark Management Group's licensed crews. Send photos with your quote request and we'll tell you what we see." },
  ],
};

// ---------------------------------------------------------------------------
// CTA bands that repeat down the page
// ---------------------------------------------------------------------------
export const ctaBands = {
  afterStats: { heading: "Got a home on the way?", body: "Get a setup quote in one business day.", button: "Get a Quote" },
  afterTestimonials: { heading: "Join the dealers and developers who don't worry about setup.", body: "Tell us about the home and the site.", button: "Request My Quote" },
  afterProcess: { heading: "Ready to lock in your setup date?", body: "Schedules fill up fast in delivery season.", button: "Get a Quote" },
  afterWall: { heading: "Want this kind of review for your project?", body: "It starts with a quick quote request.", button: "Get My Setup Quote" },
  afterServiceArea: { heading: "In our area? Let's get you on the schedule.", body: "Quotes are free and there's no obligation.", button: "Get a Quote" },
};

// ---------------------------------------------------------------------------
// Quote form
// ---------------------------------------------------------------------------
export const quoteForm = {
  eyebrow: "Free setup quote",
  heading: "Get your setup quote.",
  intro: "Takes about a minute. We reply within one business day.",
  submitLabel: "Send My Quote Request",
  submittingLabel: "Sending…",
  successHeading: "We got your request — we'll reach out within one business day.",
  successBody: "Need us sooner? Give us a call.",
  errorMessage: "Something went wrong sending your request. Please try again or call us.",
  homeTypes: ["Single-section", "Multi-section", "Not sure yet"],
  smsConsentLabel:
    "I agree to receive text messages from Mobile Home Setup Pros about my quote and setup. Message & data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.", // PLACEHOLDER — have this reviewed for your SMS provider/TCPA
  privacyNote: "We never sell your info.",
  sideHeading: "Why customers pick us",
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export const footer = {
  blurb: "Quoting, onboarding, and project coordination for manufactured and mobile home setups — for dealers, developers, investors, and homeowners.",
  partnerHeading: "Licensed installation partner",
  // PLACEHOLDER — real links (privacy policy, terms, social) go here.
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Google Reviews", href: "#" },
  ],
};
