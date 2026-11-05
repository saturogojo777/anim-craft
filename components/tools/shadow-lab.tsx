"use client";

import { useMemo, useState } from "react";
import { hexToRgba, normalizeHex, randomId } from "@/lib/color";
import { cn } from "@/lib/utils";
import { CopyButton } from "../copy-button";
import { Panel, Range } from "../ui";
import { SnippetTabs } from "../snippet-tabs";
import { LayersIcon } from "../icons";

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  alpha: number;
  inset: boolean;
}

const makeLayer = (patch: Partial<ShadowLayer> = {}): ShadowLayer => ({
  id: randomId(),
  x: 0,
  y: 12,
  blur: 28,
  spread: -12,
  color: "#080812",
  alpha: 0.45,
  inset: false,
  ...patch,
});

const presets: { name: string; radius: number; layers: Omit<ShadowLayer, "id">[] }[] = [
  {
    name: "Soft card",
    radius: 16,
    layers: [
      { x: 0, y: 1, blur: 2, spread: 0, color: "#080812", alpha: 0.06, inset: false },
      { x: 0, y: 14, blur: 30, spread: -12, color: "#080812", alpha: 0.35, inset: false },
    ],
  },
  {
    name: "Crisp",
    radius: 12,
    layers: [
      { x: 0, y: 1, blur: 0, spread: 0, color: "#080812", alpha: 0.14, inset: false },
      { x: 0, y: 4, blur: 10, spread: -3, color: "#080812", alpha: 0.18, inset: false },
    ],
  },
  {
    name: "Floating",
    radius: 22,
    layers: [
      { x: 0, y: 28, blur: 50, spread: -20, color: "#080812", alpha: 0.55, inset: false },
      { x: 0, y: 6, blur: 14, spread: -6, color: "#080812", alpha: 0.2, inset: false },
    ],
  },
  {
    name: "Neon glow",
    radius: 20,
    layers: [
      { x: 0, y: 0, blur: 26, spread: 0, color: "#8b7bff", alpha: 0.65, inset: false },
      { x: 0, y: 0, blur: 70, spread: 10, color: "#22d3ee", alpha: 0.35, inset: false },
    ],
  },
  {
    name: "Inner",
    radius: 18,
    layers: [
      { x: 0, y: 2, blur: 8, spread: 0, color: "#080812", alpha: 0.6, inset: true },
      { x: 0, y: 1, blur: 0, spread: 0, color: "#ffffff", alpha: 0.14, inset: true },
    ],
  },
];

export function ShadowLab() {
  const [layers, setLayers] = useState<ShadowLayer[]>(presets[0].layers.map(makeLayer));
  const [radius, setRadius] = useState(18);

  const shadowValue = useMemo(
    () =>
      layers
        .map(
          (layer) =>
            `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${hexToRgba(layer.color, layer.alpha)}`,
        )
        .join(", "),
    [layers],
  );

  const prettyShadow = useMemo(
    () =>
      layers
        .map(
          (layer, index) =>
            `    ${index === 0 ? "" : " "}${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${hexToRgba(layer.color, layer.alpha)}${index === layers.length - 1 ? ";" : ","}`,
        )
        .join("\n")
        .replace(/^ {4} /gm, "    "),
    [layers],
  );

  const tailwindShadow = shadowValue.replace(/\s+/g, "_");

  const snippets = useMemo(
    () => [
      {
        id: "css",
        label: "CSS",
        language: "css" as const,
        filename: "elevation.css",
        code: `.elevated {\n  border-radius: ${radius}px;\n  box-shadow:\n${prettyShadow}\n}`,
      },
      {
        id: "value",
        label: "Value",
        language: "css" as const,
        filename: "box-shadow",
        code: `box-shadow: ${shadowValue};`,
      },
      {
        id: "tailwind",
        label: "Tailwind",
        language: "html" as const,
        filename: "markup",
        code: `<!-- Tailwind CSS v4 arbitrary values -->\n<div class="rounded-[${radius}px] shadow-[${tailwindShadow}]">\n  Elevated surface\n</div>`,
      },
      {
        id: "variable",
        label: "CSS var",
        language: "css" as const,
        filename: "tokens.css",
        code: `:root {\n  --shadow-elevated: ${shadowValue};\n}\n\n.card {\n  box-shadow: var(--shadow-elevated);\n}`,
      },
    ],
    [radius, prettyShadow, shadowValue, tailwindShadow],
  );

  const updateLayer = (id: string, patch: Partial<ShadowLayer>) => {
    setLayers((previous) =>
      previous.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)),
    );
  };

  const addLayer = () => {
    if (layers.length >= 4) return;
    setLayers((previous) => [...previous, makeLayer({ y: 8, blur: 18, alpha: 0.25 })]);
  };

  const removeLayer = (id: string) => {
    setLayers((previous) => (previous.length <= 1 ? previous : previous.filter((layer) => layer.id !== id)));
  };

  const applyPreset = (preset: (typeof presets)[number]) => {
    setLayers(preset.layers.map(makeLayer));
    setRadius(preset.radius);
  };

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <LayersIcon className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-[0.12em]">
                {layers.length} layer{layers.length === 1 ? "" : "s"}
              </span>
            </div>
            <CopyButton value={shadowValue} label="Copy value" ariaLabel="Copy box-shadow value" />
          </div>
          <div className="dot-grid relative flex min-h-[360px] items-center justify-center bg-bg-soft p-8">
            <div
              className="relative flex h-44 w-64 flex-col justify-between border border-line bg-surface p-4"
              style={{ borderRadius: `${radius}px`, boxShadow: shadowValue }}
            >
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]" />
                <div className="space-y-1">
                  <span className="block h-1.5 w-20 rounded-full bg-line-strong" />
                  <span className="block h-1.5 w-12 rounded-full bg-line" />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="block h-2 w-full rounded-full bg-line" />
                <span className="block h-2 w-4/5 rounded-full bg-line" />
                <span className="block h-2 w-2/3 rounded-full bg-line" />
              </div>
              <span className="self-start rounded-md border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                elevation
              </span>
            </div>
          </div>
        </div>

        <Panel title="Snippet">
          <SnippetTabs snippets={snippets} />
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Surface">
          <Range
            label="Corner radius"
            value={radius}
            min={0}
            max={48}
            unit="px"
            onChange={setRadius}
          />
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="Layers"
          action={
            <button
              type="button"
              onClick={addLayer}
              disabled={layers.length >= 4}
              className="rounded-lg border border-line bg-surface-2 px-2 py-1 text-[11px] font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
            >
              + Add layer
            </button>
          }
        >
          <div className="space-y-3">
            {layers.map((layer, index) => (
              <div key={layer.id} className="rounded-xl border border-line bg-surface-2/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Layer {index + 1} {layer.inset ? "· inset" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLayer(layer.id)}
                    disabled={layers.length <= 1}
                    aria-label={`Remove layer ${index + 1}`}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <Range label="X" value={layer.x} min={-40} max={40} unit="px" onChange={(value) => updateLayer(layer.id, { x: value })} />
                  <Range label="Y" value={layer.y} min={-40} max={80} unit="px" onChange={(value) => updateLayer(layer.id, { y: value })} />
                  <Range label="Blur" value={layer.blur} min={0} max={100} unit="px" onChange={(value) => updateLayer(layer.id, { blur: value })} />
                  <Range label="Spread" value={layer.spread} min={-40} max={40} unit="px" onChange={(value) => updateLayer(layer.id, { spread: value })} />
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-line-strong">
                    <input
                      type="color"
                      value={normalizeHex(layer.color) ?? "#080812"}
                      onChange={(event) => updateLayer(layer.id, { color: event.target.value })}
                      aria-label="Shadow colour"
                      className="absolute -inset-1 h-10 w-10 cursor-pointer"
                    />
                  </span>
                  <div className="flex-1">
                    <Range
                      label="Opacity"
                      value={Math.round(layer.alpha * 100)}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(value) => updateLayer(layer.id, { alpha: value / 100 })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateLayer(layer.id, { inset: !layer.inset })}
                    aria-pressed={layer.inset}
                    className={cn(
                      "rounded-lg border px-2 py-1.5 text-[10px] font-medium transition-colors",
                      layer.inset
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-line text-muted hover:text-fg",
                    )}
                  >
                    Inset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Layering cheat sheet">
          <ul className="space-y-2 text-[11px] leading-relaxed text-muted">
            <li>
              <span className="text-fg-soft">Layer 1</span> — a tight, low-opacity shadow for the
              contact edge (1–3px blur).
            </li>
            <li>
              <span className="text-fg-soft">Layer 2</span> — the ambient shadow: large blur,
              negative spread, 20–40% opacity.
            </li>
            <li>
              <span className="text-fg-soft">Layer 3+</span> — optional colour glow to tie the
              surface to your accent.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
