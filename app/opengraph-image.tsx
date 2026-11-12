import { ImageResponse } from "next/og";
import { business, hero, seo } from "@/content/site";

// Auto-generated Open Graph / social share image, built from the content file.
// To use a real photo instead, delete this file and add app/opengraph-image.jpg (1200×630).
export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1c3150 0%, #0b1726 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "#f97316" }} />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 1 }}>{business.name.toUpperCase()}</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>{hero.headline}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#f97316", fontWeight: 700 }}>
          Get a setup quote · {business.phoneDisplay}
        </div>
      </div>
    ),
    size,
  );
}
