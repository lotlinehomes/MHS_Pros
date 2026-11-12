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
  return (
    <div className={`mb-10 max-w-3xl sm:mb-12 ${align === "center" ? "mx-auto text-center" : ""}`} data-reveal>
      {eyebrow && (
        <p className={`mb-3 text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-accent" : "text-orange-700"}`}>{eyebrow}</p>
      )}
      <h2 id={id} className={`text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-navy-900"}`}>
        {heading}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{intro}</p>}
    </div>
  );
}

const btnBase =
  "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-base font-bold transition-colors duration-150 focus-visible:outline-offset-4";

export function QuoteButton({ children, className = "", size = "md" }: { children: React.ReactNode; className?: string; size?: "md" | "lg" }) {
  return (
    <a
      href={QUOTE_ANCHOR}
      className={`${btnBase} bg-accent text-navy-950 shadow-lg shadow-orange-900/20 hover:bg-accent-hover ${size === "lg" ? "px-8 text-lg" : ""} ${className}`}
    >
      {children}
      <Icon name="arrow" className="h-5 w-5" />
    </a>
  );
}

export function CallButton({ tone = "dark", className = "", label }: { tone?: "dark" | "light"; className?: string; label?: string }) {
  const styles =
    tone === "dark"
      ? "border-2 border-white/30 text-white hover:border-white hover:bg-white/10"
      : "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white";
  return (
    <a href={business.phoneHref} className={`${btnBase} ${styles} ${className}`}>
      <Icon name="phone" className="h-5 w-5" />
      {label ?? business.phoneDisplay}
    </a>
  );
}

/** Repeating "Get a Quote" band placed between sections. */
export function CtaBand({ heading, body, button }: { heading: string; body: string; button: string }) {
  return (
    <aside aria-label="Request a quote" className="bg-navy-900">
      <Container className="flex flex-col items-start gap-6 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
        <div data-reveal>
          <p className="text-2xl font-extrabold text-white sm:text-3xl">{heading}</p>
          <p className="mt-2 text-lg text-slate-300">{body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <QuoteButton>{button}</QuoteButton>
          <CallButton />
        </div>
      </Container>
    </aside>
  );
}
