import { NextResponse } from "next/server";
import { normalizeQuote, validateQuote } from "@/lib/quote";

export const runtime = "nodejs";

/**
 * POST /api/quote — receives the quote form.
 *
 * Today: validates and logs the lead (visible in Vercel → Project → Logs), returns success.
 *
 * Secrets are read from env vars ONLY (set them in Vercel → Settings → Environment Variables,
 * and in .env.local for local dev). See .env.example for the full list.
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const quote = normalizeQuote(raw);

  // Honeypot tripped → pretend success so bots don't learn anything, but drop the lead.
  if (quote.company_website) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateQuote(quote);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    source: "website-quote-form",
    name: quote.name,
    phone: quote.phone,
    email: quote.email,
    homeType: quote.homeType,
    homeCount: Number(quote.homeCount),
    property: { city: quote.city, state: quote.state, zip: quote.zip },
    targetDate: quote.targetDate || null,
    notes: quote.notes || null,
    smsConsent: quote.smsConsent,
    smsConsentAt: quote.smsConsent ? new Date().toISOString() : null,
  };

  console.log("[quote] new lead", JSON.stringify(lead));

  // TODO(email): Send a notification email for each lead.
  //   - Read the recipient from process.env.QUOTE_NOTIFY_EMAIL
  //   - Read the provider key from process.env.EMAIL_PROVIDER_API_KEY (e.g. Resend, Postmark, SendGrid)
  //   - Skip silently if either is missing so local dev keeps working.

  // TODO(lotstack): Forward the lead to the LotStack CRM API.
  //   - Base URL: process.env.LOTSTACK_API_URL
  //   - Auth:     process.env.LOTSTACK_API_KEY (send as a header; NEVER hardcode or expose to the browser)
  //   - Map `lead` above to LotStack's contact/lead payload, and decide whether a CRM failure
  //     should still return success to the visitor (recommended: yes, but log + alert).

  return NextResponse.json({ ok: true });
}
