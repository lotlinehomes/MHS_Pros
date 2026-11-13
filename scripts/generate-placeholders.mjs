// Generates the labeled SVG placeholder graphics in /public/placeholders.
// Run with: node scripts/generate-placeholders.mjs
// These are stand-ins only. Replace them with real photos/logos (see README).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "placeholders");
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function photo(name, w, h, label, scene = "house") {
  const cx = w / 2;
  const s = Math.min(w, h) / 600;
  // Simple house-on-piers silhouette so it reads as "photo of a home goes here".
  const house =
    scene === "house"
      ? `<g transform="translate(${cx - 230 * s} ${h * 0.34}) scale(${s})" opacity="0.55">
          <rect x="0" y="60" width="460" height="130" rx="6" fill="#3b5577"/>
          <polygon points="-10,62 230,0 470,62" fill="#2c4462"/>
          <rect x="40" y="95" width="70" height="50" rx="3" fill="#9fb0c6"/>
          <rect x="350" y="95" width="70" height="50" rx="3" fill="#9fb0c6"/>
          <rect x="200" y="100" width="56" height="90" rx="3" fill="#a8231d"/>
          ${[30, 120, 210, 300, 390].map((x) => `<rect x="${x}" y="190" width="30" height="40" fill="#5c7391"/>`).join("")}
          <rect x="-40" y="230" width="540" height="8" fill="#5c7391"/>
        </g>`
      : `<g transform="translate(${cx - 40 * s} ${h * 0.36}) scale(${s})" opacity="0.6">
          <circle cx="40" cy="40" r="40" fill="#a8231d"/>
          <polygon points="30,22 30,58 62,40" fill="#0b1a2c"/>
        </g>`;
  const fs = Math.max(14, Math.round(Math.min(w, h) / 22));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Placeholder: ${esc(label)}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d3557"/><stop offset="1" stop-color="#13263f"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${house}
  <text x="${cx}" y="${h - fs * 3.2}" fill="#ffffff" font-family="system-ui, sans-serif" font-size="${fs}" font-weight="700" text-anchor="middle">PHOTO PLACEHOLDER</text>
  <text x="${cx}" y="${h - fs * 1.8}" fill="#efdfc5" font-family="system-ui, sans-serif" font-size="${Math.round(fs * 0.8)}" text-anchor="middle">${esc(label)}</text>
  <text x="${cx}" y="${h - fs * 0.7}" fill="#9fb0c6" font-family="ui-monospace, monospace" font-size="${Math.round(fs * 0.6)}" text-anchor="middle">${esc(name)} · ${w}×${h}</text>
</svg>`;
}

function partnerLogo(n) {
  const shapes = [
    `<rect x="8" y="12" width="24" height="24" rx="4"/>`,
    `<circle cx="20" cy="24" r="13"/>`,
    `<polygon points="20,8 34,36 6,36"/>`,
    `<path d="M6 34 L20 12 L34 34 Z M14 34 V26 H26 V34" />`,
    `<rect x="6" y="14" width="28" height="20" rx="10"/>`,
    `<path d="M8 12 H32 V20 H16 V28 H32 V36 H8 Z"/>`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48" role="img" aria-label="Partner logo placeholder ${n}">
  <g fill="#6b7280">${shapes[(n - 1) % shapes.length]}</g>
  <text x="44" y="23" fill="#6b7280" font-family="system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="1">PARTNER ${n}</text>
  <text x="44" y="37" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="9" letter-spacing="1.5">LOGO PLACEHOLDER</text>
</svg>`;
}

function headshot(label, initials) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="Headshot placeholder: ${esc(label)}">
  <rect width="96" height="96" fill="#efdfc5"/>
  <circle cx="48" cy="38" r="17" fill="#9fb0c6"/>
  <path d="M14 96 C16 70 32 60 48 60 C64 60 80 70 82 96 Z" fill="#9fb0c6"/>
  <text x="48" y="44" fill="#13263f" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">${initials}</text>
</svg>`;
}

function badge(line1, line2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Badge placeholder: ${esc(line1)} ${esc(line2)}">
  <circle cx="60" cy="60" r="56" fill="#fcf6ec" stroke="#13263f" stroke-width="4"/>
  <circle cx="60" cy="60" r="46" fill="none" stroke="#a8231d" stroke-width="2" stroke-dasharray="4 4"/>
  <path d="M60 24 l6 12 13 2 -9.5 9 2.3 13 -11.8 -6.2 -11.8 6.2 2.3 -13 -9.5 -9 13 -2 Z" fill="#a8231d"/>
  <text x="60" y="80" fill="#13263f" font-family="system-ui, sans-serif" font-size="10" font-weight="800" text-anchor="middle">${esc(line1)}</text>
  <text x="60" y="93" fill="#475569" font-family="system-ui, sans-serif" font-size="8" font-weight="600" text-anchor="middle">${esc(line2)}</text>
</svg>`;
}

function map() {
  const dots = [
    [300, 220], [380, 260], [460, 210], [520, 300], [420, 340], [340, 320], [580, 240], [250, 300],
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600" role="img" aria-label="Service area map placeholder">
  <rect width="900" height="600" fill="#f3e6cf"/>
  <g stroke="#e2caa5" stroke-width="1">${Array.from({ length: 17 }, (_, i) => `<line x1="${i * 56}" y1="0" x2="${i * 56}" y2="600"/>`).join("")}${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 56}" x2="900" y2="${i * 56}"/>`).join("")}</g>
  <path d="M160 140 L360 110 L520 130 L700 170 L740 300 L690 430 L520 470 L330 450 L190 400 L140 280 Z" fill="#ead7b8" stroke="#13263f" stroke-width="3" stroke-dasharray="10 6"/>
  <circle cx="420" cy="280" r="190" fill="#a8231d" fill-opacity="0.12" stroke="#a8231d" stroke-width="3"/>
  ${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#13263f"/>`).join("")}
  <circle cx="420" cy="280" r="12" fill="#a8231d" stroke="#fff" stroke-width="3"/>
  <rect x="250" y="520" width="400" height="56" rx="10" fill="#13263f"/>
  <text x="450" y="545" fill="#fff" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle">MAP PLACEHOLDER</text>
  <text x="450" y="566" fill="#efdfc5" font-family="ui-monospace, monospace" font-size="12" text-anchor="middle">service-area-map.svg · 900×600</text>
</svg>`;
}

const files = {
  "hero-crew-setting-home.svg": photo("hero-crew-setting-home", 1600, 1100, "Crew setting a multi-section home on piers"),
  "video-poster-dealer-testimonial.svg": photo("video-poster-dealer-testimonial", 1280, 720, "Video thumbnail: dealer in front of a newly set home", "video"),
  "gallery-doublewide-before-pad-prep.svg": photo("gallery-doublewide-before-pad-prep", 800, 600, "Before: pad prepped for a doublewide"),
  "gallery-doublewide-after-set.svg": photo("gallery-doublewide-after-set", 800, 600, "After: doublewide set, skirted & stepped"),
  "gallery-marriage-line-sealed.svg": photo("gallery-marriage-line-sealed", 800, 600, "Marriage line sealed & trimmed"),
  "gallery-piers-and-tie-downs.svg": photo("gallery-piers-and-tie-downs", 800, 600, "Piers & tie-downs under the home"),
  "gallery-singlewide-community-lot.svg": photo("gallery-singlewide-community-lot", 800, 600, "Singlewide on a community lot"),
  "gallery-skirting-and-deck.svg": photo("gallery-skirting-and-deck", 800, 600, "Skirting & deck finish"),
  "gallery-triple-wide-rural-acreage.svg": photo("gallery-triple-wide-rural-acreage", 800, 600, "Triple-section on rural acreage"),
  "gallery-laser-leveling-crew.svg": photo("gallery-laser-leveling-crew", 800, 600, "Crew laser-leveling the frame"),
  "gallery-final-walkthrough.svg": photo("gallery-final-walkthrough", 800, 600, "Final walkthrough with homeowner"),
  "logo-partner-dealer-1.svg": partnerLogo(1),
  "logo-partner-dealer-2.svg": partnerLogo(2),
  "logo-partner-developer-3.svg": partnerLogo(3),
  "logo-partner-community-4.svg": partnerLogo(4),
  "logo-partner-investor-5.svg": partnerLogo(5),
  "logo-partner-manufacturer-6.svg": partnerLogo(6),
  "testimonial-headshot-dealer-manager.svg": headshot("dealer sales manager", "JP"),
  "testimonial-headshot-land-developer.svg": headshot("land developer", "CR"),
  "testimonial-headshot-homeowners.svg": headshot("homeowners", "TM"),
  "badge-state-installer-license.svg": badge("STATE LICENSED", "PLACEHOLDER"),
  "badge-industry-association-member.svg": badge("ASSOC. MEMBER", "PLACEHOLDER"),
  "badge-manufacturer-certified-installer.svg": badge("CERTIFIED", "PLACEHOLDER"),
  "badge-bbb-accredited.svg": badge("ACCREDITED", "PLACEHOLDER"),
  "service-area-map.svg": map(),
};

for (const [file, svg] of Object.entries(files)) writeFileSync(join(OUT, file), svg + "\n");
console.log(`Wrote ${Object.keys(files).length} placeholders to ${OUT}`);
