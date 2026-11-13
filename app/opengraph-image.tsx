import { ImageResponse } from "next/og";

export const alt = "AnimCraft — motion, crafted for the web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#07070c",
          backgroundImage:
            "radial-gradient(900px 500px at 15% 0%, rgba(139,123,255,0.42), transparent 65%), radial-gradient(700px 480px at 92% 10%, rgba(34,211,238,0.22), transparent 60%), radial-gradient(700px 500px at 70% 100%, rgba(244,114,182,0.18), transparent 65%)",
          padding: "72px",
          color: "#f3f3f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                height: 58,
                width: 58,
                borderRadius: 16,
                backgroundImage: "linear-gradient(135deg, #8b7bff, #22d3ee 55%, #f472b6)",
              }}
            />
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
              AnimCraft
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#9a9aae",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            CSS · Tailwind · Zero dependencies
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            Motion, crafted
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
              color: "#a5b4fc",
            }}
          >
            for the web.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 28, color: "#b9b9c8" }}>
            Copy-paste keyframes, micro-interactions, and generators.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["40 animations", "4 generators", "Reduced-motion safe", "MIT licensed"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#e3e3ec",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: "12px 22px",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
