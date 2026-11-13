"use client";

import { useMemo, useState } from "react";
import { hexToRgba, normalizeHex } from "@/lib/color";
import { Panel, Range } from "../ui";
import { SnippetTabs } from "../snippet-tabs";
import { CopyButton } from "../copy-button";
import { GridIcon } from "../icons";

const backdrops = [
  {
    id: "aurora",
    label: "Aurora",
    style:
      "radial-gradient(60% 60% at 20% 20%, #8b7bff 0%, transparent 60%), radial-gradient(50% 50% at 80% 30%, #22d3ee 0%, transparent 60%), radial-gradient(60% 60% at 60% 90%, #f472b6 0%, transparent 65%), #0b0b16",
  },
  {
    id: "citrus",
    label: "Citrus",
    style:
      "radial-gradient(55% 55% at 15% 25%, #fbbf24 0%, transparent 60%), radial-gradient(60% 60% at 85% 20%, #fb7185 0%, transparent 60%), radial-gradient(70% 70% at 60% 95%, #34d399 0%, transparent 65%), #111014",
  },
  {
    id: "ocean",
    label: "Ocean",
    style:
      "radial-gradient(60% 60% at 25% 15%, #0ea5e9 0%, transparent 62%), radial-gradient(70% 70% at 80% 70%, #6366f1 0%, transparent 62%), #060d16",
  },
  {
    id: "mono",
    label: "Studio",
    style:
      "radial-gradient(60% 60% at 30% 20%, #475569 0%, transparent 60%), radial-gradient(50% 50% at 80% 80%, #1e293b 0%, transparent 60%), #0f172a",
  },
] as const;

export function GlassForge() {
  const [backdrop, setBackdrop] = useState<(typeof backdrops)[number]>(backdrops[0]);
  const [tint, setTint] = useState("#ffffff");
  const [tintOpacity, setTintOpacity] = useState(8);
  const [blur, setBlur] = useState(18);
  const [saturation, setSaturation] = useState(150);
  const [borderOpacity, setBorderOpacity] = useState(16);
  const [radius, setRadius] = useState(22);
  const [glow, setGlow] = useState(true);

  const background = hexToRgba(tint, tintOpacity / 100);
  const border = hexToRgba(tint, borderOpacity / 100);
  const backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;

  const boxShadows = useMemo(() => {
    const layers = [`inset 0 1px 0 ${hexToRgba("#ffffff", Math.min(0.35, borderOpacity / 60))}`];
    if (glow) layers.push("0 24px 48px -24px rgba(0, 0, 0, 0.65)");
    return layers.join(", ");
  }, [borderOpacity, glow]);

  const cssClass = `.glass-panel {\n  background-color: ${background};\n  -webkit-backdrop-filter: ${backdropFilter};\n  backdrop-filter: ${backdropFilter};\n  border: 1px solid ${border};\n  border-radius: ${radius}px;\n  box-shadow: ${boxShadows};\n}\n\n/* graceful fallback for browsers without backdrop-filter */\n@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n  .glass-panel {\n    background-color: rgba(12, 12, 22, 0.88);\n  }\n}`;

  const tailwind = `<div class="rounded-[${radius}px] border border-[${border.replace(/\s+/g, "")}] bg-[${background.replace(/\s+/g, "")}] shadow-[${boxShadows.replace(/\s+/g, "_")}] backdrop-blur-[${blur}px] backdrop-saturate-[${saturation}%]">\n  Frosted panel\n</div>`;

  const snippets = [
    { id: "css", label: "CSS", language: "css" as const, filename: "glass.css", code: cssClass },
    { id: "tailwind", label: "Tailwind", language: "html" as const, filename: "markup", code: tailwind },
    {
      id: "filter",
      label: "Filter value",
      language: "css" as const,
      filename: "backdrop-filter",
      code: `backdrop-filter: ${backdropFilter};\n-webkit-backdrop-filter: ${backdropFilter};`,
    },
    {
      id: "token",
      label: "CSS var",
      language: "css" as const,
      filename: "tokens.css",
      code: `:root {\n  --glass-bg: ${background};\n  --glass-border: ${border};\n  --glass-blur: ${backdropFilter};\n}`,
    },
  ];

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <GridIcon className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-[0.12em]">glass preview</span>
            </div>
            <CopyButton value={cssClass} label="Copy CSS" ariaLabel="Copy glass CSS" />
          </div>
          <div className="relative overflow-hidden p-5 sm:p-8">
            <div className="absolute inset-0" style={{ background: backdrop.style }} />
            <div className="relative flex min-h-[320px] items-center justify-center">
              <div
                className="w-full max-w-sm p-5"
                style={{
                  backgroundColor: background,
                  backdropFilter,
                  WebkitBackdropFilter: backdropFilter,
                  border: `1px solid ${border}`,
                  borderRadius: `${radius}px`,
                  boxShadow: boxShadows,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                    >
                      A
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">Frosted panel</p>
                      <p className="text-[11px] text-white/70">blur · saturate · border</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/80">
                    live
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <span className="block h-2 w-full rounded-full bg-white/30" />
                  <span className="block h-2 w-5/6 rounded-full bg-white/20" />
                  <span className="block h-2 w-2/3 rounded-full bg-white/15" />
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="mt-5 w-full rounded-xl border border-white/25 bg-white/15 py-2 text-xs font-medium text-white backdrop-blur-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <Panel title="Snippet">
          <SnippetTabs snippets={snippets} />
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Backdrop">
          <div className="grid grid-cols-2 gap-2">
            {backdrops.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBackdrop(option)}
                aria-pressed={backdrop.id === option.id}
                className={`overflow-hidden rounded-xl border p-1 text-left transition-colors ${
                  backdrop.id === option.id
                    ? "border-accent/60"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <span className="block h-12 w-full rounded-lg" style={{ background: option.style }} />
                <span className="mt-1 block px-0.5 text-[11px] font-medium text-fg-soft">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Material">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-line-strong">
                <input
                  type="color"
                  value={normalizeHex(tint) ?? "#ffffff"}
                  onChange={(event) => setTint(event.target.value)}
                  aria-label="Tint colour"
                  className="absolute -inset-1 h-11 w-11 cursor-pointer"
                />
              </span>
              <label className="flex-1 space-y-1">
                <span className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-fg-soft">Tint · {tint}</span>
                  <span className="font-mono text-[11px] text-muted">{tintOpacity}%</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={tintOpacity}
                  aria-label="Tint opacity"
                  onChange={(event) => setTintOpacity(Number(event.target.value))}
                  className="w-full"
                  style={{ "--range-progress": `${(tintOpacity / 40) * 100}%` } as React.CSSProperties}
                />
              </label>
            </div>

            <Range label="Blur" value={blur} min={0} max={40} unit="px" onChange={setBlur} />
            <Range
              label="Saturation"
              value={saturation}
              min={100}
              max={220}
              unit="%"
              onChange={setSaturation}
            />
            <Range
              label="Border opacity"
              value={borderOpacity}
              min={0}
              max={50}
              unit="%"
              onChange={setBorderOpacity}
            />
            <Range label="Radius" value={radius} min={0} max={48} unit="px" onChange={setRadius} />
            <label className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-2/60 px-3 py-2">
              <span className="text-xs font-medium text-fg-soft">Outer shadow</span>
              <input
                type="checkbox"
                checked={glow}
                onChange={(event) => setGlow(event.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
            </label>
          </div>
        </Panel>

        <Panel title="Getting glass right">
          <ul className="space-y-2 text-[11px] leading-relaxed text-muted">
            <li>Glass needs something behind it. Flat backgrounds make it invisible.</li>
            <li>Keep the border at 12–20% opacity; it defines the edge without a hard stroke.</li>
            <li>
              Blur above ~30px is expensive on mobile — combine a lower blur with a slightly
              stronger tint.
            </li>
            <li>
              Pair with a reduced-transparency fallback; the CSS snippet includes a{" "}
              <code className="font-mono text-fg-soft">@supports</code> guard.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
