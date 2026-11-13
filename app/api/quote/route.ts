import { NextResponse } from "next/server";
import { normalizeQuote, validateQuote } from "@/lib/quote";
import { buildLotStackRequest, lotstackEnabled, sendToLotStack } from "@/lib/lotstack";

export const runtime = "nodejs";

/**
 * POST /api/quote — receives the quote form.
 *
 * 1. Validates the answers (same rules as the browser form, see lib/quote.ts).
 * 2. Sends the request to LotStack (lib/lotstack.ts), which creates the customer, drafts a
 *    quote priced from the Mobile Home Setup Pros Pricebook, and emails the team.
 * 3. Always logs the lead too (Vercel → Project → Logs, search "[quote]"), so nothing is lost
 *    if LotStack is down or rejects the request.
 *
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

  const payload = buildLotStackRequest(quote);

  // Always keep a copy in the logs (photos summarized, not dumped).
  console.log("[quote] new lead", JSON.stringify({ ...payload, photos: `${payload.photos.length} photo(s)` }));

  if (lotstackEnabled()) {
    try {
      await sendToLotStack(payload);
      console.log("[quote] sent to LotStack:", payload.email);
    } catch (err) {
      // Don't fail the visitor's submission — the lead is in the logs above.
      console.error("[quote] LotStack send FAILED — follow up manually:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("[quote] LOTSTACK_DISABLED=1 — lead logged only, not sent to LotStack.");
  }

  return NextResponse.json({ ok: true });
}
