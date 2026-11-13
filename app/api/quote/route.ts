import { NextResponse } from "next/server";
import { normalizeQuote, toPricingInput, validateQuote } from "@/lib/quote";
import { estimateQuote, usd } from "@/lib/pricing";
import { addRow, smartsheetConfigured } from "@/lib/smartsheet";

export const runtime = "nodejs";

/**
 * POST /api/quote — receives the quote form.
 *
 * 1. Validates the answers (same rules as the browser form, see lib/quote.ts).
 * 2. Builds an instant internal estimate from the partner price list (lib/pricing.ts).
 * 3. Writes everything to the "MHS Pros" Smartsheet (lib/smartsheet.ts).
 * 4. Always logs the lead too (Vercel → Project → Logs, search "[quote]"), so nothing
 *    is lost if Smartsheet is down or not configured yet.
 *
 * The estimate is for the team only — it's never returned to the visitor.
 * Secrets come from env vars only (see .env.example). Never hardcode them.
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

  const estimate = estimateQuote(toPricingInput(quote));
  const now = new Date();

  const row = {
    Name: quote.name,
    Status: "New",
    "Submitted (UTC)": now.toISOString().slice(0, 16).replace("T", " "),
    "Estimate Low": estimate.total.low,
    "Estimate High": estimate.total.high,
    "Estimate Per Home": `${usd(estimate.perHome.low)} – ${usd(estimate.perHome.high)}${estimate.homeCount > 1 ? ` × ${estimate.homeCount} homes` : ""}${estimate.lineItems.some((i) => i.perProject) ? " + one-time items" : ""}`,
    "Needs Review": estimate.needsReview,
    "Review Notes": estimate.reviewReasons.join(" "),
    "Line Items": estimate.lineItems.map((i) => `${i.service}: ${i.low === i.high ? usd(i.low) : `${usd(i.low)}–${usd(i.high)}`}`).join("\n"),
    Phone: quote.phone,
    Email: quote.email,
    "Customer Type": quote.customerType,
    Street: quote.street,
    City: quote.city,
    State: quote.state,
    ZIP: quote.zip,
    "Home Type": quote.homeType,
    "# Homes": estimate.homeCount,
    "Home Size": quote.homeSize,
    "Home Status": quote.homeStatus,
    "Pad Needed": quote.pad,
    Foundation: quote.foundation,
    Installation: quote.installation,
    "Trim Out": quote.trimOut,
    Skirting: quote.skirting,
    Deck: quote.deck,
    "Grading / Landscaping": quote.gradingLandscaping,
    Driveway: quote.driveway,
    Mechanical: quote.mechanical,
    Electrical: quote.electrical,
    Plumbing: quote.plumbing,
    Demolition: quote.demolition,
    "Demolition Sq Ft": quote.demolition ? Number(quote.demolitionSqFt) : undefined,
    "Target Setup Date": quote.targetDate || undefined,
    Notes: quote.notes,
    "SMS Consent": quote.smsConsent,
    "Price List": `${estimate.priceListVersion}${estimate.markupPercent ? ` (+${estimate.markupPercent}% markup)` : ""}`,
    Source: "mobilehomesetuppros.com",
  };

  // Always keep a copy in the logs.
  console.log("[quote] new lead", JSON.stringify(row));

  if (smartsheetConfigured()) {
    try {
      await addRow(row);
    } catch (err) {
      // Don't fail the visitor's submission — the lead is in the logs above.
      console.error("[quote] Smartsheet write failed:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("[quote] SMARTSHEET_ACCESS_TOKEN not set — lead logged only.");
  }

  // TODO(lotstack): once the LotStack quoting API is ready, forward `quote` + `estimate` here too.
  //   Read LOTSTACK_API_URL / LOTSTACK_API_KEY from env vars; never hardcode or expose to the browser.

  return NextResponse.json({ ok: true });
}
