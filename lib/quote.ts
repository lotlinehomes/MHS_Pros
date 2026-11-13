// Shared quote-form schema + validation. Used by the browser form AND the API
// route, so the rules can never drift apart. No dependencies on purpose.
// Limits mirror LotStack's own request validation so nothing we accept gets rejected there.

import { quoteForm } from "@/content/site";
import { US_STATE_CODES } from "@/lib/us-states";

const o = quoteForm.options;

/** Photo limits — same as LotStack's: up to 6, ≤1 MB each, ≤3 MB total (decoded). */
export const PHOTO_LIMITS = { count: 6, eachBytes: 1_000_000, totalBytes: 3_000_000 } as const;
const PHOTO_DATA_URL = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
export const dataUrlBytes = (d: string) => {
  const b64 = d.split(",")[1] ?? "";
  return Math.floor((b64.length * 3) / 4) - (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
};

export type QuoteInput = {
  // Contact
  name: string;
  phone: string;
  email: string;
  customerType: string;
  company: string;
  // Property
  street: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  parcelId: string;
  // Home
  homeType: string;
  homeCount: string;
  homeSize: string;
  manufacturer: string;
  homeStatus: string;
  deliveryDate: string;
  needHome: string;
  needHomeConsent: boolean;
  // Site & foundation
  pad: string;
  foundation: string;
  landCleared: string;
  truckAccess: string;
  power: string;
  water: string;
  sewer: string;
  permitStarted: string;
  // Services
  installation: boolean;
  trimOut: boolean;
  skirting: string;
  deck: boolean;
  deckSqFt: string;
  steps: boolean;
  gradingLandscaping: boolean;
  driveway: boolean;
  mechanical: boolean;
  electrical: boolean;
  plumbing: boolean;
  demolition: boolean;
  demolitionSqFt: string;
  // Timing & notes (the team schedules the date; the customer only says how soon)
  timeframe: string;
  heardFrom: string;
  notes: string;
  photos: string[];
  smsConsent: boolean;
  /** Honeypot — real people never fill this in. */
  company_website?: string;
};

export type QuoteErrors = Partial<Record<keyof QuoteInput, string>>;

export const emptyQuote: QuoteInput = {
  name: "",
  phone: "",
  email: "",
  customerType: "",
  company: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  county: "",
  parcelId: "",
  homeType: "",
  homeCount: "1",
  homeSize: "",
  manufacturer: "",
  homeStatus: "",
  deliveryDate: "",
  needHome: "",
  needHomeConsent: false,
  pad: "",
  foundation: "",
  landCleared: "",
  truckAccess: "",
  power: "",
  water: "",
  sewer: "",
  permitStarted: "",
  installation: true,
  trimOut: false,
  skirting: "",
  deck: false,
  deckSqFt: "",
  steps: false,
  gradingLandscaping: false,
  driveway: false,
  mechanical: false,
  electrical: false,
  plumbing: false,
  demolition: false,
  demolitionSqFt: "",
  timeframe: "",
  heardFrom: "",
  notes: "",
  photos: [],
  smsConsent: false,
  company_website: "",
};

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown) => v === true;

/** Coerce unknown JSON into a QuoteInput with trimmed, length-capped strings. */
export function normalizeQuote(raw: unknown): QuoteInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name, 120),
    phone: str(r.phone, 40),
    email: str(r.email, 160).toLowerCase(),
    customerType: str(r.customerType, 40),
    company: str(r.company, 160),
    street: str(r.street, 200),
    city: str(r.city, 80),
    state: str(r.state, 2).toUpperCase(),
    zip: str(r.zip, 10),
    county: str(r.county, 80),
    parcelId: str(r.parcelId, 60),
    homeType: str(r.homeType, 40),
    homeCount: str(r.homeCount, 6),
    homeSize: str(r.homeSize, 40),
    manufacturer: str(r.manufacturer, 80),
    homeStatus: str(r.homeStatus, 60),
    deliveryDate: str(r.deliveryDate, 10),
    needHome: str(r.needHome, 10),
    needHomeConsent: bool(r.needHomeConsent),
    pad: str(r.pad, 20),
    foundation: str(r.foundation, 40),
    landCleared: str(r.landCleared, 20),
    truckAccess: str(r.truckAccess, 20),
    power: str(r.power, 20),
    water: str(r.water, 20),
    sewer: str(r.sewer, 20),
    permitStarted: str(r.permitStarted, 20),
    installation: bool(r.installation),
    trimOut: bool(r.trimOut),
    skirting: str(r.skirting, 20),
    deck: bool(r.deck),
    deckSqFt: str(r.deckSqFt, 8),
    steps: bool(r.steps),
    gradingLandscaping: bool(r.gradingLandscaping),
    driveway: bool(r.driveway),
    mechanical: bool(r.mechanical),
    electrical: bool(r.electrical),
    plumbing: bool(r.plumbing),
    demolition: bool(r.demolition),
    demolitionSqFt: str(r.demolitionSqFt, 8),
    timeframe: str(r.timeframe, 40),
    heardFrom: str(r.heardFrom, 120),
    notes: str(r.notes, 2000),
    photos: Array.isArray(r.photos) ? r.photos.filter((p): p is string => typeof p === "string").slice(0, PHOTO_LIMITS.count + 1) : [],
    smsConsent: bool(r.smsConsent),
    company_website: str(r.company_website, 200),
  };
}

const oneOf = (v: string, list: readonly string[]) => list.includes(v);
const optionalOneOf = (v: string, list: readonly string[]) => v === "" || list.includes(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export function validateQuote(q: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};
  // About you
  if (q.name.length < 2) e.name = "Please enter your name.";
  const digits = q.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) e.phone = "Please enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q.email)) e.email = "Please enter a valid email address.";
  if (!oneOf(q.customerType, o.customerType)) e.customerType = "Please pick one.";
  // Property
  if (q.city.length < 2) e.city = "Please enter the property city.";
  if (!US_STATE_CODES.has(q.state)) e.state = "Please choose the state.";
  if (!/^\d{5}(-\d{4})?$/.test(q.zip)) e.zip = "Please enter a 5-digit ZIP code.";
  // Home
  if (!oneOf(q.homeType, o.homeType)) e.homeType = "Please pick a home type.";
  const n = Number(q.homeCount);
  if (!Number.isInteger(n) || n < 1 || n > 999) e.homeCount = "Enter a number from 1 to 999.";
  if (!oneOf(q.homeStatus, o.homeStatus)) e.homeStatus = "Please pick one.";
  if (q.deliveryDate && !isDate(q.deliveryDate)) e.deliveryDate = "Please pick a valid date.";
  if (!oneOf(q.needHome, o.needHome)) e.needHome = "Please pick one.";
  // Site & foundation (pad and foundation required; the rest optional)
  if (!oneOf(q.pad, o.pad)) e.pad = "Please pick one.";
  if (!oneOf(q.foundation, o.foundation)) e.foundation = "Please pick one.";
  for (const k of ["landCleared", "truckAccess", "power", "permitStarted"] as const) if (!optionalOneOf(q[k], o.yesNoUnsure)) e[k] = "Please pick one.";
  if (!optionalOneOf(q.water, o.water)) e.water = "Please pick one.";
  if (!optionalOneOf(q.sewer, o.sewer)) e.sewer = "Please pick one.";
  // Services
  if (!oneOf(q.skirting, o.skirting)) e.skirting = "Please pick a skirting option.";
  if (q.deck && q.deckSqFt) {
    const sq = Number(q.deckSqFt);
    if (!Number.isInteger(sq) || sq < 10 || sq > 5000) e.deckSqFt = "Enter the approximate square footage (10–5,000), or leave blank.";
  }
  if (q.demolition) {
    const sq = Number(q.demolitionSqFt);
    if (!Number.isInteger(sq) || sq < 50 || sq > 20000) e.demolitionSqFt = "Enter the approximate square footage (50–20,000).";
  }
  // Timing & details
  if (!oneOf(q.timeframe, o.timeframe)) e.timeframe = "Please pick one.";
  if (q.photos.length > PHOTO_LIMITS.count) e.photos = `Please send up to ${PHOTO_LIMITS.count} photos.`;
  else if (q.photos.some((p) => !PHOTO_DATA_URL.test(p))) e.photos = "One of the photos couldn't be read. Remove it and try again.";
  else if (q.photos.some((p) => dataUrlBytes(p) > PHOTO_LIMITS.eachBytes) || q.photos.reduce((s, p) => s + dataUrlBytes(p), 0) > PHOTO_LIMITS.totalBytes)
    e.photos = "Those photos are too large. Try fewer photos.";
  return e;
}
