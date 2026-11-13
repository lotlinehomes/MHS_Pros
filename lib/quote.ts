// Shared quote-form schema + validation. Used by the browser form AND the API
// route, so the rules can never drift apart. No dependencies on purpose.

import { quoteForm } from "@/content/site";
import type { PricingInput } from "@/lib/pricing";

const o = quoteForm.options;

export type QuoteInput = {
  // Contact
  name: string;
  phone: string;
  email: string;
  customerType: string;
  // Property
  street: string;
  city: string;
  state: string;
  zip: string;
  // Home
  homeType: string;
  homeCount: string;
  homeSize: string;
  homeStatus: string;
  // Site & foundation
  pad: string;
  foundation: string;
  // Services
  installation: boolean;
  trimOut: boolean;
  skirting: string;
  deck: boolean;
  gradingLandscaping: boolean;
  driveway: boolean;
  mechanical: boolean;
  electrical: boolean;
  plumbing: boolean;
  demolition: boolean;
  demolitionSqFt: string;
  // Timing & notes
  targetDate: string;
  notes: string;
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
  street: "",
  city: "",
  state: "",
  zip: "",
  homeType: "",
  homeCount: "1",
  homeSize: "",
  homeStatus: "",
  pad: "",
  foundation: "",
  installation: true,
  trimOut: false,
  skirting: "",
  deck: false,
  gradingLandscaping: false,
  driveway: false,
  mechanical: false,
  electrical: false,
  plumbing: false,
  demolition: false,
  demolitionSqFt: "",
  targetDate: "",
  notes: "",
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
    email: str(r.email, 160),
    customerType: str(r.customerType, 40),
    street: str(r.street, 160),
    city: str(r.city, 100),
    state: str(r.state, 40),
    zip: str(r.zip, 10),
    homeType: str(r.homeType, 40),
    homeCount: str(r.homeCount, 6),
    homeSize: str(r.homeSize, 40),
    homeStatus: str(r.homeStatus, 60),
    pad: str(r.pad, 20),
    foundation: str(r.foundation, 40),
    installation: bool(r.installation),
    trimOut: bool(r.trimOut),
    skirting: str(r.skirting, 20),
    deck: bool(r.deck),
    gradingLandscaping: bool(r.gradingLandscaping),
    driveway: bool(r.driveway),
    mechanical: bool(r.mechanical),
    electrical: bool(r.electrical),
    plumbing: bool(r.plumbing),
    demolition: bool(r.demolition),
    demolitionSqFt: str(r.demolitionSqFt, 8),
    targetDate: str(r.targetDate, 20),
    notes: str(r.notes, 2000),
    smsConsent: bool(r.smsConsent),
    company_website: str(r.company_website, 200),
  };
}

const oneOf = (v: string, list: readonly string[]) => list.includes(v);

export function validateQuote(q: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};
  if (q.name.length < 2) e.name = "Please enter your name.";
  const digits = q.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) e.phone = "Please enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q.email)) e.email = "Please enter a valid email address.";
  if (!oneOf(q.customerType, o.customerType)) e.customerType = "Please pick one.";
  if (q.city.length < 2) e.city = "Please enter the property city.";
  if (q.state.length < 2) e.state = "Please enter the state.";
  if (!/^\d{5}(-\d{4})?$/.test(q.zip)) e.zip = "Please enter a 5-digit ZIP code.";
  if (!oneOf(q.homeType, o.homeType)) e.homeType = "Please pick a home type.";
  const n = Number(q.homeCount);
  if (!Number.isInteger(n) || n < 1 || n > 999) e.homeCount = "Enter a number from 1 to 999.";
  if (!oneOf(q.homeStatus, o.homeStatus)) e.homeStatus = "Please pick one.";
  if (!oneOf(q.pad, o.pad)) e.pad = "Please pick one.";
  if (!oneOf(q.foundation, o.foundation)) e.foundation = "Please pick one.";
  if (!oneOf(q.skirting, o.skirting)) e.skirting = "Please pick a skirting option.";
  if (q.demolition) {
    const sq = Number(q.demolitionSqFt);
    if (!Number.isInteger(sq) || sq < 50 || sq > 20000) e.demolitionSqFt = "Enter the approximate square footage (50–20,000).";
  }
  if (q.targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(q.targetDate)) e.targetDate = "Please pick a valid date.";
  return e;
}

/** Map validated form answers to the pricing engine's input. */
export function toPricingInput(q: QuoteInput): PricingInput {
  return {
    homeType: q.homeType,
    homeCount: Number(q.homeCount) || 1,
    needsPad: q.pad === "Yes",
    padUnsure: q.pad === "Not sure",
    foundation: q.foundation,
    installation: q.installation,
    trimOut: q.trimOut,
    skirting: q.skirting,
    deck: q.deck,
    gradingLandscaping: q.gradingLandscaping,
    driveway: q.driveway,
    mechanical: q.mechanical,
    electrical: q.electrical,
    plumbing: q.plumbing,
    demolition: q.demolition,
    demolitionSqFt: q.demolition ? Number(q.demolitionSqFt) || 0 : 0,
  };
}
