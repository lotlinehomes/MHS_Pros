// Shared quote-form schema + validation. Used by the browser form AND the API
// route, so the rules can never drift apart. No dependencies on purpose.

import { quoteForm } from "@/content/site";

export const HOME_TYPES: readonly string[] = quoteForm.homeTypes;

export type QuoteInput = {
  name: string;
  phone: string;
  email: string;
  homeType: string;
  homeCount: string;
  city: string;
  state: string;
  zip: string;
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
  homeType: "",
  homeCount: "1",
  city: "",
  state: "",
  zip: "",
  targetDate: "",
  notes: "",
  smsConsent: false,
  company_website: "",
};

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Coerce unknown JSON into a QuoteInput with trimmed, length-capped strings. */
export function normalizeQuote(raw: unknown): QuoteInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name, 120),
    phone: str(r.phone, 40),
    email: str(r.email, 160),
    homeType: str(r.homeType, 40),
    homeCount: str(r.homeCount, 6),
    city: str(r.city, 100),
    state: str(r.state, 40),
    zip: str(r.zip, 10),
    targetDate: str(r.targetDate, 20),
    notes: str(r.notes, 2000),
    smsConsent: r.smsConsent === true,
    company_website: str(r.company_website, 200),
  };
}

export function validateQuote(q: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};
  if (q.name.length < 2) e.name = "Please enter your name.";
  const digits = q.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) e.phone = "Please enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q.email)) e.email = "Please enter a valid email address.";
  if (!HOME_TYPES.includes(q.homeType)) e.homeType = "Please pick a home type.";
  const n = Number(q.homeCount);
  if (!Number.isInteger(n) || n < 1 || n > 999) e.homeCount = "Enter a number from 1 to 999.";
  if (q.city.length < 2) e.city = "Please enter the property city.";
  if (q.state.length < 2) e.state = "Please enter the state.";
  if (!/^\d{5}(-\d{4})?$/.test(q.zip)) e.zip = "Please enter a 5-digit ZIP code.";
  if (q.targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(q.targetDate)) e.targetDate = "Please pick a valid date.";
  return e;
}
