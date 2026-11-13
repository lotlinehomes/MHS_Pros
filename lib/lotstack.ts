/**
 * LotStack integration — sends each website quote request to LotStack's set-up quote API.
 *
 * LotStack is the system of record: it creates the customer, drafts a quote priced from the
 * Mobile Home Setup Pros Pricebook, emails the team, and handles signing, booking, and jobs.
 * Prices live ONLY in LotStack — the website never prices anything itself.
 *
 * Request format mirrors LotStack's own validator (/api/setup/quote-requests):
 *   name, email, phone, state (2-letter), zip | address+city, customerType, homeWidth,
 *   timeframe, preferredDate, services (Pricebook item IDs), needsHome, homeConsent,
 *   photos (data URLs), heardFrom, message (≤2000), source, website (honeypot, must be empty).
 *
 * Env vars (server-only):
 *   LOTSTACK_API_KEY   server key issued by LotStack (sent as "Authorization: Bearer …").
 *                      Requests are only sent when this is set.
 *   LOTSTACK_API_URL   defaults to https://lotstack.ai/api/setup/quote-requests
 */
import type { QuoteInput } from "@/lib/quote";

const API_URL = () => process.env.LOTSTACK_API_URL || "https://lotstack.ai/api/setup/quote-requests";
export const lotstackConfigured = () => Boolean(process.env.LOTSTACK_API_KEY);

/** Mobile Home Setup Pros Pricebook item IDs in LotStack (setup_pricebook_items). */
export const SERVICE_IDS = {
  pad: "85a195dc-623e-4b9f-8def-a7b244569fe6", // Manufactured Home Pad
  concreteFooters: "59e1fbde-0345-4b91-aee3-d4c2557feccc", // Concrete Footers
  setupSingle: "45bf10d3-ecb9-46ee-b12a-03a45a049935", // Single-wide set-up
  setupDouble: "f9275159-2e21-4f09-8299-a468a4fba255", // Double-wide set-up
  trimDouble: "1acb5ec0-b076-4559-97db-4c9f3c5ff99b", // Trim-out / Marriage Line - Double Wide
  trimSingle: "eee45b91-2404-44db-a056-f7013d3dbffa", // Trim-out - Single Wide
  driveway: "4d7236ed-3e93-43aa-9583-11673f2f5b2f", // Driveway
  grading: "cc0f2f02-2bf3-4247-976b-214cf0fefe8c", // Final Grading / Landscaping
  brickSkirting: "b82803c2-1fdf-4566-8793-d0418b165d7e", // Brick Skirting
  vinylSingle: "02ffdb0d-7dcb-4ea6-8f47-f475cc974a50", // Vinyl Skirting - Single Wide
  vinylDouble: "b80500ab-b0ae-4ad5-bade-7bec472405c6", // Vinyl Skirting - Double Wide
  blockSkirting: "61cf4428-f8c0-4f0c-b14f-aeb2fc45f8ab", // Block skirting
  deck: "899b1cde-b539-4324-b7c9-0514032fc6d9", // Deck
  steps: "58148bae-ce28-4e95-88d7-e83c1ae74488", // Steps with 5x5 Landing
  hvac: "c34779d8-8200-4237-ae4c-6ce41e05cdaa", // HVAC
  plumbing: "739e2c50-706f-45cd-af85-98ea1d087150", // Plumbing, Sewer and Water Hook-Up
  electrical: "12d619e8-9d7b-4ea4-8215-9d3a66564b6a", // Electrical Hook-Up
  demolition: "89476389-4992-4d51-a7d9-c77d648aaf73", // Demolition Services (per sq ft)
} as const;

/** Our answer labels → LotStack's fixed values. */
const CUSTOMER_TYPE: Record<string, string> = {
  Homeowner: "Homeowner",
  "Dealer / retailer": "Retailer",
  Developer: "Developer",
  "Park / community": "Park",
  Manufacturer: "Manufacturer",
  Investor: "Other",
  Other: "Other",
};
const HOME_WIDTH: Record<string, "single" | "double" | "triple" | "unknown"> = {
  "Single wide": "single",
  "Double wide": "double",
  "Triple wide or larger": "triple",
  "Not sure yet": "unknown",
};

export type LotStackPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  customerType: string;
  homeWidth: string;
  timeframe: string;
  preferredDate: string;
  services: string[];
  needsHome: boolean;
  homeConsent: boolean;
  photos: string[];
  heardFrom: string;
  message: string;
  source: string;
  website: string;
};

const MESSAGE_MAX = 2000;
const DAY = 86_400_000;

/** LotStack's timeframe buckets, derived from the target setup date. */
function timeframeFor(targetDate: string, now: Date): string {
  if (!targetDate) return "Not sure yet";
  const days = (Date.parse(targetDate) - now.getTime()) / DAY;
  if (Number.isNaN(days)) return "Not sure yet";
  if (days <= 30) return "Within 30 days";
  if (days <= 90) return "1–3 months";
  return "3+ months";
}

/** LotStack accepts a preferred date from tomorrow up to ~18 months out. */
function preferredDateFor(targetDate: string, now: Date): string {
  if (!targetDate) return "";
  const t = Date.parse(targetDate);
  return t >= now.getTime() && t <= now.getTime() + 540 * DAY ? targetDate : "";
}

/** Map validated form answers to LotStack's request. Anything without a field of its own goes in `message`. */
export function buildLotStackRequest(q: QuoteInput, now = new Date()): LotStackPayload {
  const width = HOME_WIDTH[q.homeType] ?? "unknown";
  const ids: string[] = [];
  const notes: string[] = [];
  const S = SERVICE_IDS;

  if (q.pad === "Yes") ids.push(S.pad);
  if (q.foundation === "Concrete footers") ids.push(S.concreteFooters);
  if (q.installation) {
    if (width === "single") ids.push(S.setupSingle);
    else if (width === "double") ids.push(S.setupDouble);
    else notes.push(`Installation requested (${q.homeType.toLowerCase()} — no matching set-up item; price manually).`);
  }
  if (q.trimOut) {
    if (width === "single") ids.push(S.trimSingle);
    else if (width === "double") ids.push(S.trimDouble);
    else notes.push(`Trim out requested (${q.homeType.toLowerCase()} — price manually).`);
  }
  if (q.skirting === "Vinyl") {
    if (width === "single") ids.push(S.vinylSingle);
    else if (width === "double") ids.push(S.vinylDouble);
    else notes.push(`Vinyl skirting requested (${q.homeType.toLowerCase()} — price manually).`);
  }
  if (q.skirting === "Brick") ids.push(S.brickSkirting);
  if (q.skirting === "Block") ids.push(S.blockSkirting);
  if (q.deck) ids.push(S.deck);
  if (q.steps) ids.push(S.steps);
  if (q.gradingLandscaping) ids.push(S.grading);
  if (q.driveway) ids.push(S.driveway);
  if (q.mechanical) ids.push(S.hvac);
  if (q.electrical) ids.push(S.electrical);
  if (q.plumbing) ids.push(S.plumbing);
  if (q.demolition) ids.push(S.demolition);

  const preferredDate = preferredDateFor(q.targetDate, now);
  const details: [string, string][] = [
    ["Customer type", q.customerType],
    ["Homes", q.homeCount],
    ["Home type", q.homeType],
    ["Home size (W×L)", q.homeSize],
    ["Manufacturer", q.manufacturer],
    ["Home status", q.homeStatus],
    ["Expected delivery", q.deliveryDate],
    ["County", q.county],
    ["Parcel ID", q.parcelId],
    ["Pad needed", q.pad],
    ["Foundation", q.foundation],
    ["Land cleared & level", q.landCleared],
    ["Truck access", q.truckAccess],
    ["Power on site", q.power],
    ["Water", q.water],
    ["Sewer", q.sewer],
    ["Permit started", q.permitStarted],
    ["Skirting", q.skirting],
    ["Deck size (sq ft)", q.deck ? q.deckSqFt : ""],
    ["Demolition (sq ft)", q.demolition ? q.demolitionSqFt : ""],
    ["Target setup date", q.targetDate && !preferredDate ? q.targetDate : ""],
    ["SMS consent", q.smsConsent ? "Yes" : "No"],
  ];
  const header = [
    "Submitted via mobilehomesetuppros.com",
    ...details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    ...notes,
  ].join("\n");
  const customerNotes = q.notes ? `\n\nCustomer notes:\n${q.notes}` : "";
  const message = (header + customerNotes).slice(0, MESSAGE_MAX);

  const needsHome = q.needHome === "Yes";
  return {
    name: q.name,
    company: q.company,
    email: q.email,
    phone: q.phone,
    address: q.street,
    city: q.city,
    state: q.state,
    zip: q.zip,
    customerType: CUSTOMER_TYPE[q.customerType] ?? "Other",
    homeWidth: width,
    timeframe: timeframeFor(q.targetDate, now),
    preferredDate,
    services: [...new Set(ids)],
    needsHome,
    homeConsent: needsHome && q.needHomeConsent,
    photos: q.photos,
    heardFrom: q.heardFrom,
    message,
    source: "mobilehomesetuppros.com",
    website: "",
  };
}

// --- Live service list (cached) so a retired Pricebook item never makes LotStack reject the request.
let offered: { ids: Set<string>; at: number } | null = null;
async function offeredServiceIds(): Promise<Set<string> | null> {
  if (offered && Date.now() - offered.at < 10 * 60_000) return offered.ids;
  try {
    const res = await fetch(API_URL(), { signal: AbortSignal.timeout(8_000), cache: "no-store" });
    const data = (await res.json()) as { services?: { items?: { id: string }[] }[] };
    const ids = new Set((data.services ?? []).flatMap((g) => (g.items ?? []).map((i) => i.id)));
    if (!ids.size) return null;
    offered = { ids, at: Date.now() };
    return ids;
  } catch {
    return null; // can't check — send as-is
  }
}

/** POST the request to LotStack. Throws with LotStack's error message on failure. */
export async function sendToLotStack(payload: LotStackPayload): Promise<void> {
  if (!lotstackConfigured()) throw new Error("LOTSTACK_API_KEY is not set");

  const live = await offeredServiceIds();
  let body = payload;
  if (live) {
    const dropped = payload.services.filter((id) => !live.has(id));
    if (dropped.length) {
      const names = Object.entries(SERVICE_IDS).filter(([, id]) => dropped.includes(id)).map(([k]) => k);
      body = {
        ...payload,
        services: payload.services.filter((id) => live.has(id)),
        message: `${payload.message}\n\nAlso requested (no longer on the online price list): ${names.join(", ")}`.slice(0, MESSAGE_MAX),
      };
    }
  }

  const res = await fetch(API_URL(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.LOTSTACK_API_KEY}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
    throw new Error(`LotStack ${res.status}: ${err.error ?? "request failed"}${err.field ? ` (field: ${err.field})` : ""}`);
  }
}
