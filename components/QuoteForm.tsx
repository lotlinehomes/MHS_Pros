"use client";

import { useId, useRef, useState } from "react";
import { business, quoteForm } from "@/content/site";
import { emptyQuote, type QuoteErrors, type QuoteInput, validateQuote } from "@/lib/quote";
import { Icon } from "@/components/Icon";

type Status = "idle" | "submitting" | "success" | "error";
type ServiceKey = "installation" | "trimOut" | "deck" | "gradingLandscaping" | "driveway" | "mechanical" | "electrical" | "plumbing" | "demolition";

const inputCls =
  "mt-1.5 block w-full rounded-lg border-2 border-navy-900/40 bg-white px-3.5 py-3 text-base text-navy-950 placeholder:text-ink/60 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-brick/40 aria-[invalid=true]:border-red-700";
const pillCls =
  "flex cursor-pointer items-center gap-2.5 rounded-lg border-2 border-navy-900/40 bg-white px-3.5 py-3 text-base font-medium text-navy-900 has-[:checked]:border-navy-900 has-[:checked]:bg-cream-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brick";
const Req = () => (
  <span className="text-red-700" aria-hidden="true">
    *
  </span>
);
const Opt = () => <span className="font-normal text-ink">(optional)</span>;

export function QuoteForm() {
  const [values, setValues] = useState<QuoteInput>(emptyQuote);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;
  const o = quoteForm.options;
  const t = quoteForm.sections;

  function set<K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validateQuote(values);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: QuoteErrors };
      if (res.ok && data.ok) {
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        if (data.errors) setErrors(data.errors);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[28rem] flex-col items-center justify-center rounded-xl border-2 border-navy-900 bg-cream-50 p-8 text-center shadow-[6px_6px_0_0_var(--color-brick)] outline-none"
      >
        <span className="mb-5 grid h-16 w-16 place-items-center rounded-full border-2 border-navy-900 bg-brick text-cream-50">
          <Icon name="check" className="h-9 w-9" />
        </span>
        <p className="font-display text-2xl font-extrabold text-navy-900">{quoteForm.successHeading}</p>
        <p className="mt-3 text-lg text-ink">{quoteForm.successBody}</p>
        <a href={business.phoneHref} className="mt-5 inline-flex items-center gap-2 font-display text-xl font-extrabold text-brick underline-offset-4 hover:underline">
          <Icon name="phone" className="h-5 w-5" />
          {business.phoneDisplay}
        </a>
      </div>
    );
  }

  const errorText = (key: keyof QuoteInput) =>
    errors[key] ? (
      <p id={fid(`${key}-err`)} className="mt-1.5 text-sm font-medium text-red-700">
        {errors[key]}
      </p>
    ) : null;

  const field = (key: keyof QuoteInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div>
      <label htmlFor={fid(key)} className="block text-sm font-bold text-navy-900">
        {label} {optional ? <Opt /> : <Req />}
      </label>
      <input
        id={fid(key)}
        name={key}
        className={inputCls}
        value={values[key] as string}
        onChange={(e) => set(key, e.target.value as never)}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? fid(`${key}-err`) : undefined}
        aria-required={optional ? undefined : true}
        {...props}
      />
      {errorText(key)}
    </div>
  );

  /** Single-choice question rendered as tappable pills. */
  const radios = (key: keyof QuoteInput, legend: string, choices: readonly string[], hint?: string, cols = "sm:grid-cols-3") => (
    <fieldset aria-describedby={[hint ? fid(`${key}-hint`) : "", errors[key] ? fid(`${key}-err`) : ""].filter(Boolean).join(" ") || undefined}>
      <legend className="text-sm font-bold text-navy-900">
        {legend} <Req />
      </legend>
      {hint && (
        <p id={fid(`${key}-hint`)} className="mt-0.5 text-sm text-ink">
          {hint}
        </p>
      )}
      <div className={`mt-2 grid grid-cols-1 gap-2 ${cols}`}>
        {choices.map((c) => (
          <label key={c} className={pillCls}>
            <input type="radio" name={key} value={c} checked={values[key] === c} onChange={() => set(key, c as never)} className="h-4 w-4 shrink-0 accent-brick" />
            {c}
          </label>
        ))}
      </div>
      {errorText(key)}
    </fieldset>
  );

  const group = (title: string, step: number, children: React.ReactNode) => (
    <fieldset className="border-t-2 border-dashed border-navy-900/20 pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="float-left mb-4 flex w-full items-center gap-3 font-display text-lg font-extrabold text-navy-900">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-navy-900 bg-brick text-sm font-black italic text-cream-50" aria-hidden="true">
          {step}
        </span>
        {title}
      </legend>
      <div className="clear-left grid gap-5">{children}</div>
    </fieldset>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-xl border-2 border-navy-900 bg-cream-50 p-6 shadow-[6px_6px_0_0_var(--color-brick)] sm:p-8" aria-describedby={fid("intro")}>
      <p id={fid("intro")} className="mb-6 text-ink">
        {quoteForm.intro} <span className="text-sm">Fields marked <span className="text-red-700">*</span> are required.</span>
      </p>

      <div className="grid gap-8">
        {group(
          t.contact,
          1,
          <>
            {field("name", "Full name", { autoComplete: "name" })}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "(555) 555-5555" })}
              {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
            </div>
            {radios("customerType", "I am a…", o.customerType, undefined, "sm:grid-cols-3")}
          </>,
        )}

        {group(
          t.property,
          2,
          <>
            {field("street", "Street address", { autoComplete: "street-address" }, true)}
            <div className="grid gap-5 sm:grid-cols-[1fr_7rem_8rem]">
              {field("city", "City", { autoComplete: "address-level2" })}
              {field("state", "State", { autoComplete: "address-level1", maxLength: 40 })}
              {field("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
            </div>
          </>,
        )}

        {group(
          t.home,
          3,
          <>
            {radios("homeType", "Home type", o.homeType)}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("homeCount", "Number of homes", { type: "number", min: 1, max: 999, inputMode: "numeric" })}
              {field("homeSize", "Home size (W × L)", { placeholder: "e.g. 16 × 76 or 28 × 60" }, true)}
            </div>
            {radios("homeStatus", "Where is the home now?", o.homeStatus, undefined, "sm:grid-cols-2")}
          </>,
        )}

        {group(
          t.site,
          4,
          <>
            {radios("pad", "Do you need a pad built for the home?", o.pad, "A level, compacted pad the home sits on.")}
            {radios("foundation", "Foundation", o.foundation, "Standard pier blocking is included with installation. Some sites or lenders require concrete footers.")}
          </>,
        )}

        {group(
          t.services,
          5,
          <>
            {radios("skirting", "Skirting", o.skirting)}
            <fieldset>
              <legend className="text-sm font-bold text-navy-900">
                Services needed <Opt />
              </legend>
              <p className="mt-0.5 text-sm text-ink">Check everything you&apos;d like included in your quote.</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {quoteForm.services.map((svc) => {
                  const key = svc.key as ServiceKey;
                  return (
                    <label key={key} className={`${pillCls} items-start`}>
                      <input type="checkbox" name={key} checked={values[key]} onChange={(e) => set(key, e.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded accent-brick" />
                      <span>
                        <span className="block font-semibold">{svc.label}</span>
                        {"hint" in svc && svc.hint && <span className="block text-sm font-normal text-ink">{svc.hint}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {values.demolition &&
              field("demolitionSqFt", "Approx. square footage to demolish", { type: "number", min: 50, max: 20000, inputMode: "numeric", placeholder: "e.g. 1,100" })}
          </>,
        )}

        {group(
          t.timing,
          6,
          <>
            {field("targetDate", "Target setup date", { type: "date" }, true)}
            <div>
              <label htmlFor={fid("notes")} className="block text-sm font-bold text-navy-900">
                Notes <Opt />
              </label>
              <textarea
                id={fid("notes")}
                name="notes"
                rows={4}
                maxLength={2000}
                className={inputCls}
                placeholder="Make/model, lot access, slope, utilities on site (well/septic or city), anything else we should know."
                value={values.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
              <input type="checkbox" name="smsConsent" checked={values.smsConsent} onChange={(e) => set("smsConsent", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 rounded accent-brick" />
              <span>{quoteForm.smsConsentLabel}</span>
            </label>
          </>,
        )}

        {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={fid("company_website")}>Leave this field empty</label>
          <input id={fid("company_website")} name="company_website" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={(e) => set("company_website", e.target.value)} />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
          {quoteForm.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-navy-900 bg-brick px-6 py-4 font-display text-lg font-extrabold uppercase italic tracking-wide text-cream-50 shadow-retro-sm transition hover:bg-brick-dark disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? quoteForm.submittingLabel : quoteForm.submitLabel}
        {status !== "submitting" && <Icon name="arrow" className="h-5 w-5" />}
      </button>
      <p className="mt-3 text-center text-sm text-ink">{quoteForm.privacyNote}</p>
    </form>
  );
}
