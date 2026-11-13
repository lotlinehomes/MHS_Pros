import { business } from "@/content/site";
import { Icon } from "@/components/Icon";

export const QUOTE_ANCHOR = "#quote";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  className = "",
  labelledBy,
  children,
}: {
  id?: string;
  className?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** ——— ★ ——— divider, like the rules on the logo. */
export function StarRule({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const line = tone === "dark" ? "bg-cream/40" : "bg-brick";
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className={`h-0.5 w-10 rounded-full sm:w-14 ${line}`} />
      <span className={`text-sm ${tone === "dark" ? "text-cream-300" : "text-brick"}`}>★</span>
      <span className={`text-base ${tone === "dark" ? "text-cream" : "text-brick"}`}>★</span>
      <span className={`text-sm ${tone === "dark" ? "text-cream-300" : "text-brick"}`}>★</span>
      <span className={`h-0.5 w-10 rounded-full sm:w-14 ${line}`} />
    </div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  heading,
  intro,
  tone = "light",
  align = "center",
}: {
  id: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div className={`mb-10 max-w-3xl sm:mb-12 ${center ? "mx-auto text-center" : ""}`} data-reveal>
      {eyebrow && (
        <p className={`font-script text-3xl leading-none sm:text-4xl ${dark ? "text-cream-300" : "text-brick"}`}>{eyebrow}</p>
      )}
      <h2
        id={id}
        className={`mt-2 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl ${dark ? "text-cream-50" : "text-navy-900"}`}
      >
        {heading}
      </h2>
      <StarRule tone={tone} className={`mt-4 ${center ? "" : "justify-start"}`} />
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-cream-200" : "text-ink"}`}>{intro}</p>}
    </div>
  );
}

const btnBase =
  "inline-flex min-h-12 items-center justify-center gap-2 text-center sm:whitespace-nowrap rounded-lg border-2 px-5 sm:px-6 py-3 font-display text-base font-extrabold uppercase italic tracking-wide transition duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5";

export function QuoteButton({
  children,
  className = "",
  size = "md",
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  /** "onBrick" = cream button for use on a red background. */
  tone?: "light" | "dark" | "onBrick";
}) {
  const styles =
    tone === "onBrick"
      ? "border-navy-900 bg-cream-50 text-navy-900 shadow-retro-sm hover:bg-white"
      : tone === "dark"
        ? "border-cream-50 bg-brick text-cream-50 shadow-[3px_3px_0_0_var(--color-cream-50)] hover:bg-brick-dark"
        : "border-navy-900 bg-brick text-cream-50 shadow-retro-sm hover:bg-brick-dark";
  return (
    <a href={QUOTE_ANCHOR} className={`${btnBase} ${styles} ${size === "lg" ? "text-lg sm:px-8" : ""} ${className}`}>
      {children}
      <Icon name="arrow" className="h-5 w-5" />
    </a>
  );
}

export function CallButton({ tone = "light", className = "", label }: { tone?: "dark" | "light"; className?: string; label?: string }) {
  const styles =
    tone === "dark"
      ? "border-cream-50/70 text-cream-50 hover:border-cream-50 hover:bg-cream-50/10"
      : "border-navy-900 bg-cream-50 text-navy-900 shadow-retro-sm hover:bg-white";
  return (
    <a href={business.phoneHref} className={`${btnBase} ${styles} ${className}`}>
      <Icon name="phone" className="h-5 w-5" />
      {label ?? business.phoneDisplay}
    </a>
  );
}

/** Repeating "Get a Quote" band between sections — styled like the logo's red ribbon. */
export function CtaBand({ heading, body, button }: { heading: string; body: string; button: string }) {
  return (
    <aside aria-label="Request a quote" className="border-y-4 border-navy-900 bg-brick">
      <div className="border-y-2 border-dashed border-cream/35">
        <Container className="flex flex-col items-start gap-6 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div data-reveal>
            <p className="font-display text-2xl font-extrabold italic text-cream-50 sm:text-3xl">
              <span aria-hidden="true" className="mr-2 text-cream-300">★</span>
              {heading}
            </p>
            <p className="mt-2 text-lg text-cream-200">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <QuoteButton tone="onBrick">{button}</QuoteButton>
            <CallButton tone="dark" />
          </div>
        </Container>
      </div>
    </aside>
  );
}
