import type { SVGProps } from "react";

// Lightweight inline icon set (no icon library dependency).
const paths = {
  home: <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10M10 20v-5h4v5" />,
  level: (
    <>
      <rect x="2" y="9" width="20" height="6" rx="1.5" />
      <circle cx="12" cy="12" r="1.6" />
      <path d="M9 9v6M15 9v6" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13M8 11h8M5 14c0 3.5 3 6 7 6s7-2.5 7-6M5 14l-2 1.5M19 14l2 1.5" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  plug: <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" />,
  skirting: (
    <>
      <path d="M3 9h18M3 9v11h18V9" />
      <path d="M7 9v11M11 9v11M15 9v11M19 9v11M8 4h8l2 5H6l2-5Z" />
    </>
  ),
  steps: <path d="M3 20h18M3 20v-4h5v-4h5V8h5V4h3" />,
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 12l2 2 4-4" />
    </>
  ),
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM8.5 12l2.5 2.5 4.5-5" />,
  badge: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5 7.5 21 12 18.5 16.5 21 15 14.5M9.5 9l1.8 1.8L14.8 7.3" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  check: <path d="M5 12.5 10 17.5 19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  alert: <path d="M12 3 2 20h20L12 3ZM12 10v4M12 17h.01" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  play: <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-6 w-6", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export function Stars({ rating, className = "h-5 w-5", tone = "light" }: { rating: number; className?: string; tone?: "light" | "dark" }) {
  const full = Math.round(rating);
  const on = tone === "dark" ? "text-cream-50" : "text-brick";
  const off = tone === "dark" ? "text-navy-700" : "text-cream-300";
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={`${className} ${i < full ? on : off}`}>
          <path
            fill="currentColor"
            d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
          />
        </svg>
      ))}
    </span>
  );
}
