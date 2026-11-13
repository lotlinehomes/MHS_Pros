"use client";

import { useId, useRef, useState } from "react";
import { business, quoteForm } from "@/content/site";
import { dataUrlBytes, emptyQuote, PHOTO_LIMITS, type QuoteErrors, type QuoteInput, validateQuote } from "@/lib/quote";
import { US_STATES } from "@/lib/us-states";
import { Icon } from "@/components/Icon";

type Status = "idle" | "submitting" | "success" | "error";
type ServiceKey = "installation" | "trimOut" | "deck" | "steps" | "gradingLandscaping" | "driveway" | "mechanical" | "electrical" | "plumbing" | "demolition";

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

/** Shrink a phone photo to a JPEG data URL under ~900 KB so it fits LotStack's limits. */
async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("unreadable"));
      i.src = url;
    });
    for (const [maxSide, quality] of [
      [1600, 0.72],
      [1280, 0.6],
      [960, 0.5],
    ] as const) {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/jpeg", quality);
      if (dataUrlBytes(data) <= 900_000) return data;
    }
    throw new Error("too large");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function QuoteForm() {
  const [values, setValues] = useState<QuoteInput>(emptyQuote);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [photoBusy, setPhotoBusy] = useState(false);
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

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setPhotoBusy(true);
    const next = [...values.photos];
    let problem = "";
    for (const file of Array.from(files)) {
      if (next.length >= PHOTO_LIMITS.count) {
        problem = `Up to ${PHOTO_LIMITS.count} photos.`;
        break;
      }
      try {
        const data = await compressImage(file);
        if (next.reduce((s, p) => s + dataUrlBytes(p), 0) + dataUrlBytes(data) > PHOTO_LIMITS.totalBytes) {
          problem = "That's as many photos as we can take at once.";
          break;
        }
        next.push(data);
      } catch {
        problem = `"${file.name}" couldn't be read as a photo.`;
      }
    }
    set("photos", next);
    if (problem) setErrors((e) => ({ ...e, photos: problem }));
    setPhotoBusy(false);
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (photoBusy) return;
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
  const radios = (key: keyof QuoteInput, legend: string, choices: readonly string[], opts: { hint?: string; cols?: string; optional?: boolean } = {}) => {
    const { hint, cols = "grid-cols-1 sm:grid-cols-3", optional = false } = opts;
    return (
      <fieldset aria-describedby={[hint ? fid(`${key}-hint`) : "", errors[key] ? fid(`${key}-err`) : ""].filter(Boolean).join(" ") || undefined}>
        <legend className="text-sm font-bold text-navy-900">
          {legend} {optional ? <Opt /> : <Req />}
        </legend>
        {hint && (
          <p id={fid(`${key}-hint`)} className="mt-0.5 text-sm text-ink">
            {hint}
          </p>
        )}
        <div className={`mt-2 grid gap-2 ${cols}`}>
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
  };

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

  const isBusiness = values.customerType !== "" && values.customerType !== "Homeowner";

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
            {radios("customerType", "I am a…", o.customerType, { cols: "grid-cols-2 lg:grid-cols-3" })}
            {isBusiness && field("company", "Company", { autoComplete: "organization" }, true)}
          </>,
        )}

        {group(
          t.property,
          2,
          <>
            {field("street", "Street address", { autoComplete: "street-address" }, true)}
            <div className="grid gap-5 sm:grid-cols-[1fr_9rem_8rem]">
              {field("city", "City", { autoComplete: "address-level2" })}
              <div>
                <label htmlFor={fid("state")} className="block text-sm font-bold text-navy-900">
                  State <Req />
                </label>
                <select
                  id={fid("state")}
                  name="state"
                  autoComplete="address-level1"
                  className={inputCls}
                  value={values.state}
                  onChange={(e) => set("state", e.target.value)}
                  aria-invalid={errors.state ? true : undefined}
                  aria-describedby={errors.state ? fid("state-err") : undefined}
                  aria-required
                >
                  <option value="">Choose…</option>
                  {US_STATES.map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
                {errorText("state")}
              </div>
              {field("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {field("county", "County", { placeholder: "Permits go by county" }, true)}
              {field("parcelId", "Parcel ID", {}, true)}
            </div>
          </>,
        )}

        {group(
          t.home,
          3,
          <>
            {radios("homeType", "Home type", o.homeType, { cols: "grid-cols-2" })}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("homeCount", "Number of homes", { type: "number", min: 1, max: 999, inputMode: "numeric" })}
              {field("homeSize", "Home size (W × L)", { placeholder: "e.g. 16 × 76 or 28 × 60" }, true)}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {field("manufacturer", "Manufacturer / model", {}, true)}
              {field("deliveryDate", "Expected delivery date", { type: "date" }, true)}
            </div>
            {radios("homeStatus", "Where is the home now?", o.homeStatus, { cols: "grid-cols-2" })}
            {radios("needHome", "Do you still need to buy the home?", o.needHome, { cols: "grid-cols-2" })}
            {values.needHome === "Yes" && (
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
                <input type="checkbox" name="needHomeConsent" checked={values.needHomeConsent} onChange={(e) => set("needHomeConsent", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 rounded accent-brick" />
                <span>{quoteForm.needHomeConsentLabel}</span>
              </label>
            )}
          </>,
        )}

        {group(
          t.site,
          4,
          <>
            {radios("pad", "Do you need a pad built for the home?", o.pad, { hint: "A level, compacted pad the home sits on.", cols: "grid-cols-3" })}
            {radios("foundation", "Foundation", o.foundation, { hint: "Standard pier blocking is included with installation. Some sites or lenders require concrete footers." })}
            <p className="text-sm text-ink">A few quick site questions help us quote accurately. Skip any you don&apos;t know.</p>
            {radios("landCleared", "Is the land cleared and level?", o.yesNoUnsure, { optional: true, cols: "grid-cols-3" })}
            {radios("truckAccess", "Can a truck pulling the home reach the site?", o.yesNoUnsure, { optional: true, cols: "grid-cols-3" })}
            {radios("power", "Is power available at the site?", o.yesNoUnsure, { optional: true, cols: "grid-cols-3" })}
            {radios("water", "Water", o.water, { optional: true, cols: "grid-cols-2 lg:grid-cols-4" })}
            {radios("sewer", "Sewer", o.sewer, { optional: true, cols: "grid-cols-2 lg:grid-cols-4" })}
            {radios("permitStarted", "Has a permit been started?", o.yesNoUnsure, { optional: true, cols: "grid-cols-3" })}
          </>,
        )}

        {group(
          t.services,
          5,
          <>
            {radios("skirting", "Skirting", o.skirting, { cols: "grid-cols-2 sm:grid-cols-4" })}
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
            {(values.deck || values.demolition) && (
              <div className="grid gap-5 sm:grid-cols-2">
                {values.deck && field("deckSqFt", "Deck size (sq ft)", { type: "number", min: 10, max: 5000, inputMode: "numeric", placeholder: "e.g. 120" }, true)}
                {values.demolition &&
                  field("demolitionSqFt", "Square footage to demolish", { type: "number", min: 50, max: 20000, inputMode: "numeric", placeholder: "e.g. 1,100" })}
              </div>
            )}
          </>,
        )}

        {group(
          t.timing,
          6,
          <>
            {radios("timeframe", "When do you need it?", o.timeframe, { hint: "Our team will reach out to schedule your exact install date.", cols: "grid-cols-2 sm:grid-cols-3" })}
            {field("heardFrom", "How did you hear about us?", {}, true)}

            <div>
              <label htmlFor={fid("photos")} className="block text-sm font-bold text-navy-900">
                Site or home photos <Opt />
              </label>
              <p className="mt-0.5 text-sm text-ink">{quoteForm.photosHint}</p>
              <input
                id={fid("photos")}
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/*"
                multiple
                disabled={photoBusy || values.photos.length >= PHOTO_LIMITS.count}
                onChange={(e) => {
                  void addPhotos(e.target.files);
                  e.target.value = "";
                }}
                aria-describedby={errors.photos ? fid("photos-err") : undefined}
                className="mt-2 block w-full text-sm text-ink file:mr-3 file:cursor-pointer file:rounded-lg file:border-2 file:border-navy-900 file:bg-white file:px-4 file:py-2 file:font-display file:font-extrabold file:italic file:text-navy-900 disabled:opacity-60"
              />
              {photoBusy && <p className="mt-1.5 text-sm text-ink">Preparing photos…</p>}
              {values.photos.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected photos">
                  {values.photos.map((src, i) => (
                    <li key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                      <img src={src} alt={`Selected photo ${i + 1}`} className="h-20 w-20 rounded-md border-2 border-navy-900 object-cover" />
                      <button
                        type="button"
                        onClick={() => set("photos", values.photos.filter((_, j) => j !== i))}
                        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-navy-900 bg-brick text-cream-50"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <Icon name="x" className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {errorText("photos")}
            </div>

            <div>
              <label htmlFor={fid("notes")} className="block text-sm font-bold text-navy-900">
                Notes <Opt />
              </label>
              <textarea
                id={fid("notes")}
                name="notes"
                rows={4}
                maxLength={1200}
                className={inputCls}
                placeholder="Anything else we should know about the home, the lot, or your timeline."
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
        disabled={status === "submitting" || photoBusy}
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-navy-900 bg-brick px-6 py-4 font-display text-lg font-extrabold uppercase italic tracking-wide text-cream-50 shadow-retro-sm transition hover:bg-brick-dark disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? quoteForm.submittingLabel : quoteForm.submitLabel}
        {status !== "submitting" && <Icon name="arrow" className="h-5 w-5" />}
      </button>
      <p className="mt-3 text-center text-sm text-ink">{quoteForm.privacyNote}</p>
    </form>
  );
}
