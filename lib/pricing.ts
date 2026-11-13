/**
 * ============================================================================
 *  PRICING — instant quote engine
 * ============================================================================
 *  Source: fulfillment partner's "Mobile Home Turnkey Services | Price List"
 *  (Nov 9). Every number below comes straight from that sheet. Update this
 *  table when a new price list comes in — the quote form and the estimate
 *  sent to Smartsheet both read from it.
 *
 *  The estimate is INTERNAL. It is written to Smartsheet for the team and is
 *  never shown to the customer by this site.
 *
 *  Price list note: "Prices are estimates and may vary based on home size,
 *  site conditions, materials, and project scope. Final pricing is subject
 *  to a project-specific quote."
 * ============================================================================
 */

export type Range = readonly [low: number, high: number];
export type HomeSize = "single" | "double";

/** Partner price list, Nov 9. [low, high] in USD. */
export const PRICE_LIST = {
  pad: [1200, 2000], // "Mobile Home Pad (based on home size)"
  concreteFooters: [6000, 8500],
  installation: { single: [6000, 7000], double: [9500, 12000] }, // includes blocking, leveling, tie-downs, vapor barrier, joining DW sections, roof cap
  trimOut: { single: [1800, 1800], double: [3500, 4200] },
  deck: [4500, 8500],
  vinylSkirting: { single: [2500, 3200], double: [3500, 4500] },
  brickSkirting: [8500, 12500],
  gradingLandscaping: [4500, 6500],
  driveway: [3500, 8500],
  mechanical: [8500, 9500],
  electrical: [3500, 4500],
  plumbing: [3800, 4800],
  demolitionPerSqFt: [8, 12],
} as const satisfies Record<string, Range | Record<HomeSize, Range>>;

export const PRICE_LIST_VERSION = "Partner turnkey price list — Nov 9";

/**
 * Margin added on top of the partner's price before the estimate is recorded.
 * 0 = pass-through. Set this to your markup (e.g. 15 for 15%) once decided.
 */
export const MARKUP_PERCENT = 0;

/** What the quote form asks for that affects price. */
export type PricingInput = {
  homeType: string; // "Single wide" | "Double wide" | "Triple wide or larger"
  homeCount: number;
  needsPad: boolean;
  padUnsure: boolean;
  foundation: string; // "Standard piers (included)" | "Concrete footers" | "Not sure"
  installation: boolean;
  trimOut: boolean;
  skirting: string; // "None" | "Vinyl" | "Brick"
  deck: boolean;
  gradingLandscaping: boolean;
  driveway: boolean;
  mechanical: boolean;
  electrical: boolean;
  plumbing: boolean;
  demolition: boolean;
  demolitionSqFt: number; // 0 when not needed
};

/** `perProject` items are charged once for the whole job (not multiplied by the number of homes). */
export type LineItem = { service: string; low: number; high: number; perProject?: boolean };

export type Estimate = {
  lineItems: LineItem[];
  /** Sum of the per-home items (excludes one-time project items like demolition). */
  perHome: { low: number; high: number };
  total: { low: number; high: number };
  homeCount: number;
  /** Instant estimate could not be fully priced — a person should review. */
  needsReview: boolean;
  reviewReasons: string[];
  priceListVersion: string;
  markupPercent: number;
};

const sizeFor = (homeType: string): HomeSize | null =>
  homeType === "Single wide" ? "single" : homeType === "Double wide" ? "double" : null;

const withMarkup = (n: number) => Math.round(n * (1 + MARKUP_PERCENT / 100));

/** Build an instant estimate (low–high range) from the form answers. */
export function estimateQuote(input: PricingInput): Estimate {
  const P = PRICE_LIST;
  const items: LineItem[] = [];
  const reasons: string[] = [];
  const add = (service: string, [low, high]: Range, perProject = false) =>
    items.push({ service, low: withMarkup(low), high: withMarkup(high), ...(perProject ? { perProject } : {}) });

  // Triple-wide and larger aren't on the price list. Price as double-wide (the closest
  // tier) so there's still a starting number, and flag it for a person to adjust.
  let size = sizeFor(input.homeType);
  if (!size) {
    size = "double";
    reasons.push(`"${input.homeType}" isn't on the price list — priced at double-wide rates; adjust manually.`);
  }
  const sizeLabel = size === "single" ? "Single Wide" : "Double Wide";

  if (input.needsPad) add("Mobile home pad", P.pad);
  if (input.padUnsure) reasons.push("Customer isn't sure whether a pad is needed — confirm on site ($1,200–$2,000 if so).");
  if (input.foundation === "Concrete footers") add("Concrete footers", P.concreteFooters);
  if (input.foundation === "Not sure") reasons.push("Customer isn't sure about the foundation type — confirm whether concrete footers are needed.");
  if (input.installation) add(`Installation – ${sizeLabel}`, P.installation[size]);
  if (input.trimOut) add(`Trim out – ${sizeLabel}`, P.trimOut[size]);
  if (input.skirting === "Vinyl") add(`Vinyl skirting – ${sizeLabel}`, P.vinylSkirting[size]);
  if (input.skirting === "Brick") add("Brick skirting", P.brickSkirting);
  if (input.deck) add("Deck", P.deck);
  if (input.gradingLandscaping) add("Final grading / landscaping", P.gradingLandscaping);
  if (input.driveway) add("Driveway", P.driveway);
  if (input.mechanical) add("Mechanical", P.mechanical);
  if (input.electrical) add("Electrical", P.electrical);
  if (input.plumbing) add("Plumbing", P.plumbing);
  if (input.demolition) {
    if (input.demolitionSqFt > 0) {
      const [lo, hi] = P.demolitionPerSqFt;
      // Square footage is the total to demolish, so it's a one-time project item.
      add(`Demolition (${input.demolitionSqFt.toLocaleString("en-US")} sq ft, one-time)`, [lo * input.demolitionSqFt, hi * input.demolitionSqFt], true);
    } else {
      reasons.push("Demolition requested but no square footage given — price manually ($8–$12/sq ft).");
    }
  }
  if (items.length === 0) reasons.push("No priced services selected.");

  const sum = (list: LineItem[], k: "low" | "high") => list.reduce((s, i) => s + i[k], 0);
  const homeItems = items.filter((i) => !i.perProject);
  const projectItems = items.filter((i) => i.perProject);
  const perHome = { low: sum(homeItems, "low"), high: sum(homeItems, "high") };
  const homeCount = Math.max(1, Math.floor(input.homeCount) || 1);
  return {
    lineItems: items,
    perHome,
    total: {
      low: perHome.low * homeCount + sum(projectItems, "low"),
      high: perHome.high * homeCount + sum(projectItems, "high"),
    },
    homeCount,
    needsReview: reasons.length > 0,
    reviewReasons: reasons,
    priceListVersion: PRICE_LIST_VERSION,
    markupPercent: MARKUP_PERCENT,
  };
}

export const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
