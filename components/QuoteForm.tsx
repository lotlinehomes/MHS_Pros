"use client";

import { useId, useRef, useState } from "react";
import { business, quoteForm } from "@/content/site";
import { emptyQuote, HOME_TYPES, type QuoteErrors, type QuoteInput, validateQuote } from "@/lib/quote";
import { Icon } from "@/components/Icon";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-navy-950 shadow-sm placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 aria-[invalid=true]:border-red-600";

export function QuoteForm() {
  const [values, setValues] = useState<QuoteInput>(emptyQuote);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fid = (k: string) => `${uid}-${k}`;

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
        className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl outline-none"
      >
        <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
          <Icon name="check" className="h-9 w-9" />
        </span>
        <p className="text-2xl font-extrabold text-navy-900">{quoteForm.successHeading}</p>
        <p className="mt-3 text-lg text-slate-600">{quoteForm.successBody}</p>
        <a href={business.phoneHref} className="mt-5 inline-flex items-center gap-2 text-lg font-bold text-orange-700 underline-offset-4 hover:underline">
          <Icon name="phone" className="h-5 w-5" />
          {business.phoneDisplay}
        </a>
      </div>
    );
  }

  const field = (
    key: keyof QuoteInput,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    optional = false,
  ) => (
    <div>
      <label htmlFor={fid(key)} className="block text-sm font-semibold text-navy-900">
        {label} {optional ? <span className="font-normal text-slate-500">(optional)</span> : <span className="text-red-700" aria-hidden="true">*</span>}
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
      {errors[key] && (
        <p id={fid(`${key}-err`)} className="mt-1.5 text-sm font-medium text-red-700">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-2xl bg-white p-6 shadow-xl sm:p-8" aria-describedby={fid("intro")}>
      <p id={fid("intro")} className="mb-6 text-slate-600">
        {quoteForm.intro} <span className="text-sm">Fields marked <span className="text-red-700">*</span> are required.</span>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">{field("name", "Full name", { autoComplete: "name" })}</div>
        {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "(555) 555-5555" })}
        {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}

        <fieldset className="sm:col-span-2" aria-describedby={errors.homeType ? fid("homeType-err") : undefined}>
          <legend className="text-sm font-semibold text-navy-900">
            Home type <span className="text-red-700" aria-hidden="true">*</span>
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {HOME_TYPES.map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-300 px-3.5 py-3 text-base font-medium text-navy-900 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
              >
                <input type="radio" name="homeType" required value={t} checked={values.homeType === t} onChange={() => set("homeType", t)} className="h-4 w-4 accent-orange-600" />
                {t}
              </label>
            ))}
          </div>
          {errors.homeType && (
            <p id={fid("homeType-err")} className="mt-1.5 text-sm font-medium text-red-700">
              {errors.homeType}
            </p>
          )}
        </fieldset>

        {field("homeCount", "Number of homes", { type: "number", min: 1, max: 999, inputMode: "numeric" })}
        {field("targetDate", "Target setup date", { type: "date" }, true)}
        {field("city", "Property city", { autoComplete: "address-level2" })}
        <div className="grid grid-cols-2 gap-4">
          {field("state", "State", { autoComplete: "address-level1", maxLength: 40 })}
          {field("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fid("notes")} className="block text-sm font-semibold text-navy-900">
            Notes <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id={fid("notes")}
            name="notes"
            rows={4}
            maxLength={2000}
            className={inputCls}
            placeholder="Make/model, site access, skirting or steps needed, anything else we should know."
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={fid("company_website")}>Leave this field empty</label>
          <input id={fid("company_website")} name="company_website" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={(e) => set("company_website", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
            <input
              type="checkbox"
              name="smsConsent"
              checked={values.smsConsent}
              onChange={(e) => set("smsConsent", e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 rounded accent-orange-600"
            />
            <span>{quoteForm.smsConsentLabel}</span>
          </label>
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
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-lg font-extrabold text-navy-950 shadow-lg shadow-orange-900/20 transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? quoteForm.submittingLabel : quoteForm.submitLabel}
        {status !== "submitting" && <Icon name="arrow" className="h-5 w-5" />}
      </button>
      <p className="mt-3 text-center text-sm text-slate-500">{quoteForm.privacyNote}</p>
    </form>
  );
}
