import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { quoteForm } from "@/content/site";
import { buildLotStackRequest, SERVICE_IDS } from "@/lib/lotstack";
import { emptyQuote, enforceFoundationRule, normalizeQuote, validateQuote, type QuoteInput } from "@/lib/quote";

function filled(over: Partial<QuoteInput> = {}): QuoteInput {
  return {
    ...emptyQuote,
    name: "Dana Homeowner",
    phone: "5555550100",
    email: "dana@example.com",
    customerType: "Homeowner",
    city: "Anytown",
    state: "NC",
    zip: "27514",
    homeType: "Double wide",
    homeCount: "1",
    homeStatus: "Being delivered",
    needHome: "No",
    pad: "No",
    drywall: "no",
    foundation: "dirt_pad_abs",
    concreteReason: null,
    countyRequiresConcrete: false,
    skirting: "None",
    timeframe: "Within 30 days",
    installation: true,
    ...over,
  };
}

describe("drywall foundation rule", () => {
  it("keeps the standard dirt pad when the home is not drywall", () => {
    const q = enforceFoundationRule(filled({ drywall: "no" }));
    assert.equal(q.foundation, "dirt_pad_abs");
    assert.equal(q.concreteReason, null);
    assert.deepEqual(validateQuote(q), {});
    const payload = buildLotStackRequest(q);
    assert.equal(payload.drywall, "no");
    assert.equal(payload.foundation, "dirt_pad_abs");
    assert.equal(payload.concreteReason, null);
    assert.equal(payload.services.includes(SERVICE_IDS.concreteFooters), false);
    assert.equal(payload.services.includes(SERVICE_IDS.setupDouble), true);
    assert.match(payload.message, /Drywall: No/);
    assert.match(payload.message, /Foundation: Dirt pad with ABS pad footers/);
    assert.doesNotMatch(payload.message, /dirt_pad_abs|county_lender|\$/);
  });

  it("forces concrete footers when the home has drywall, even if the client asked for the dirt pad", () => {
    const raw = filled({ drywall: "yes", foundation: "dirt_pad_abs", concreteReason: null });
    assert.ok(validateQuote(raw).foundation);
    const q = enforceFoundationRule(normalizeQuote(raw));
    assert.equal(q.foundation, "concrete");
    assert.equal(q.concreteReason, "drywall");
    assert.deepEqual(validateQuote(q), {});
    const payload = buildLotStackRequest(q);
    assert.equal(payload.drywall, "yes");
    assert.equal(payload.foundation, "concrete");
    assert.equal(payload.concreteReason, "drywall");
    assert.equal(payload.services.includes(SERVICE_IDS.concreteFooters), true);
    assert.match(payload.message, /Drywall: Yes/);
    assert.match(payload.message, /Foundation: Concrete footers/);
    assert.match(payload.message, /Concrete reason: Required for drywall homes/);
    assert.doesNotMatch(payload.message, /\$\d/);
  });

  it("keeps the dirt pad when drywall is not sure, and says the team will confirm", () => {
    const q = enforceFoundationRule(filled({ drywall: "unsure" }));
    assert.equal(q.foundation, "dirt_pad_abs");
    assert.equal(q.concreteReason, null);
    assert.deepEqual(validateQuote(q), {});
    const payload = buildLotStackRequest(q);
    assert.equal(payload.drywall, "unsure");
    assert.equal(payload.foundation, "dirt_pad_abs");
    assert.equal(payload.concreteReason, null);
    assert.equal(payload.services.includes(SERVICE_IDS.concreteFooters), false);
    assert.match(payload.message, /Drywall: Not sure/);
    assert.match(payload.message, /Foundation: Dirt pad with ABS pad footers/);
    assert.match(payload.message, /We'll confirm, and if it's drywall, concrete footers will be added\./);
  });

  it("selects concrete when the county or lender requires it", () => {
    const q = enforceFoundationRule(filled({ drywall: "no", foundation: "dirt_pad_abs", countyRequiresConcrete: true }));
    assert.equal(q.foundation, "concrete");
    assert.equal(q.concreteReason, "county_lender");
    assert.equal(q.countyRequiresConcrete, true);
    assert.deepEqual(validateQuote(q), {});
    const payload = buildLotStackRequest(q);
    assert.equal(payload.foundation, "concrete");
    assert.equal(payload.concreteReason, "county_lender");
    assert.equal("countyRequiresConcrete" in payload, false);
    assert.equal(payload.services.includes(SERVICE_IDS.concreteFooters), true);
    assert.match(payload.message, /Concrete reason: County or lender requires it/);
  });

  it("records a concrete choice as the customer's preference", () => {
    const q = enforceFoundationRule(filled({ drywall: "no", foundation: "concrete" }));
    assert.equal(q.concreteReason, "customer");
    const payload = buildLotStackRequest(q);
    assert.equal(payload.concreteReason, "customer");
    assert.match(payload.message, /Concrete reason: Customer preference/);
    assert.equal(payload.services.filter((id) => id === SERVICE_IDS.concreteFooters).length, 1);
  });

  it("keeps drywall as the reason when a drywall home also has a county requirement", () => {
    const q = enforceFoundationRule(filled({ drywall: "yes", foundation: "dirt_pad_abs", countyRequiresConcrete: true, concreteReason: "customer" }));
    assert.equal(q.foundation, "concrete");
    assert.equal(q.concreteReason, "drywall");
    assert.equal(q.countyRequiresConcrete, true);
    const payload = buildLotStackRequest(q);
    assert.equal(payload.concreteReason, "drywall");
    assert.match(payload.message, /County or lender also requires concrete footers: Yes/);
  });

  it("still maps a requested pad to the pad item and leaves the dirt pad unpriced", () => {
    const withPad = buildLotStackRequest(enforceFoundationRule(filled({ drywall: "no", pad: "Yes" })));
    assert.equal(withPad.services.includes(SERVICE_IDS.pad), true);
    assert.equal(withPad.services.includes(SERVICE_IDS.concreteFooters), false);
    const noPad = buildLotStackRequest(enforceFoundationRule(filled({ drywall: "no", pad: "No" })));
    assert.equal(noPad.services.includes(SERVICE_IDS.pad), false);
    assert.equal(SERVICE_IDS.concreteFooters, "59e1fbde-0345-4b91-aee3-d4c2557feccc");
    assert.equal(SERVICE_IDS.pad, "85a195dc-623e-4b9f-8def-a7b244569fe6");
  });

  it("shows no prices on the drywall or foundation copy", () => {
    const copy = JSON.stringify({ drywall: quoteForm.drywall, foundation: quoteForm.foundation });
    assert.doesNotMatch(copy, /\$|price/i);
    assert.match(copy, /Standard, included/);
    assert.match(copy, /Upgrade/);
    assert.deepEqual(
      quoteForm.drywall.choices.map((c) => c.value),
      ["yes", "no", "unsure"],
    );
    assert.deepEqual(
      quoteForm.foundation.choices.map((c) => c.value),
      ["dirt_pad_abs", "concrete"],
    );
  });
});
