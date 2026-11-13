"use client";

import { useMemo, useState } from "react";
import { hexToRgb, hslToHex, normalizeHex, randomId, readableTextColor, rgbToHex } from "@/lib/color";
import { clamp, cn } from "@/lib/utils";
import { CopyButton } from "../copy-button";
import { Panel, Range, Segmented, TextInput } from "../ui";
import { SnippetTabs } from "../snippet-tabs";
import { DropletIcon, RefreshIcon } from "../icons";

type GradientType = "linear" | "radial" | "conic";

interface Stop {
  id: string;
  color: string;
  position: number;
}

const initialStops: Stop[] = [
  { id: "stop-a", color: "#8b7bff", position: 0 },
  { id: "stop-b", color: "#22d3ee", position: 52 },
  { id: "stop-c", color: "#f472b6", position: 100 },
];

const presets: { name: string; type: GradientType; angle: number; colors: string[] }[] = [
  { name: "Craft", type: "linear", angle: 135, colors: ["#8b7bff", "#22d3ee", "#f472b6"] },
  { name: "Ocean", type: "linear", angle: 120, colors: ["#0ea5e9", "#22d3ee", "#a7f3d0"] },
  { name: "Sunset", type: "linear", angle: 160, colors: ["#fb7185", "#fbbf24", "#7c3aed"] },
  { name: "Mint", type: "linear", angle: 110, colors: ["#34d399", "#22d3ee", "#818cf8"] },
  { name: "Aurora", type: "conic", angle: 180, colors: ["#8b7bff", "#22d3ee", "#f472b6", "#8b7bff"] },
  { name: "Spotlight", type: "radial", angle: 0, colors: ["#fef3c7", "#f59e0b", "#7c2d12"] },
];

function buildStops(colors: string[]): Stop[] {
  return colors.map((color, index) => ({
    id: `${color}-${index}-${randomId()}`,
    color,
    position: colors.length === 1 ? 0 : Math.round((index / (colors.length - 1)) * 100),
  }));
}

export function GradientStudio() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>(initialStops);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.position - b.position),
    [stops],
  );

  const stopString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
  const gradient =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stopString})`
      : type === "radial"
        ? `radial-gradient(circle at 50% 50%, ${stopString})`
        : `conic-gradient(from ${angle}deg at 50% 50%, ${stopString})`;

  const fallback = sortedStops[0]?.color ?? "#8b7bff";
  const compact = gradient.replace(/\s+/g, "_");
  const textColor = readableTextColor(fallback);

  const snippets = useMemo(
    () => [
      {
        id: "css",
        label: "CSS",
        language: "css" as const,
        filename: "gradient.css",
        code: `.gradient-surface {\n  background-color: ${fallback}; /* fallback */\n  background-image: ${gradient};\n}`,
      },
      {
        id: "value",
        label: "Value",
        language: "css" as const,
        filename: "background-image",
        code: `background-image: ${gradient};`,
      },
      {
        id: "tailwind",
        label: "Tailwind",
        language: "html" as const,
        filename: "markup",
        code: `<!-- Tailwind CSS v4 arbitrary value -->\n<div class="h-64 rounded-2xl bg-[${compact}]">\n  Gradient surface\n</div>`,
      },
      {
        id: "css-var",
        label: "CSS var",
        language: "css" as const,
        filename: "tokens.css",
        code: `:root {\n  --gradient-craft: ${gradient};\n}\n\n.hero {\n  background-image: var(--gradient-craft);\n}`,
      },
    ],
    [gradient, fallback, compact],
  );

  const updateStop = (id: string, patch: Partial<Stop>) => {
    setStops((previous) =>
      previous.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
    );
  };

  const addStop = () => {
    if (stops.length >= 6) return;
    const ordered = [...stops].sort((a, b) => a.position - b.position);
    let index = 0;
    let largestGap = -1;
    for (let i = 0; i < ordered.length - 1; i += 1) {
      const gap = ordered[i + 1].position - ordered[i].position;
      if (gap > largestGap) {
        largestGap = gap;
        index = i;
      }
    }
    const left = ordered[index];
    const right = ordered[index + 1] ?? ordered[index];
    const leftRgb = hexToRgb(left.color);
    const rightRgb = hexToRgb(right.color);
    const color =
      leftRgb && rightRgb
        ? rgbToHex({
            r: (leftRgb.r + rightRgb.r) / 2,
            g: (leftRgb.g + rightRgb.g) / 2,
            b: (leftRgb.b + rightRgb.b) / 2,
          })
        : "#ffffff";
    setStops((previous) => [
      ...previous,
      {
        id: randomId(),
        color,
        position: Math.round((left.position + (right.position ?? left.position)) / 2),
      },
    ]);
  };

  const removeStop = (id: string) => {
    setStops((previous) => (previous.length <= 2 ? previous : previous.filter((stop) => stop.id !== id)));
  };

  const shuffle = () => {
    const base = Math.random() * 360;
    setStops((previous) =>
      previous.map((stop, index) => ({
        ...stop,
        color: hslToHex(
          (base + index * 58) % 360,
          0.62 + Math.random() * 0.2,
          0.52 + Math.random() * 0.18,
        ),
      })),
    );
  };

  const applyPreset = (preset: (typeof presets)[number]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(buildStops(preset.colors));
  };

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <DropletIcon className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-[0.12em]">{type} gradient</span>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton value={gradient} label="Copy value" ariaLabel="Copy gradient value" />
            </div>
          </div>
          <div className="checker p-3 sm:p-4">
            <div
              className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl sm:h-80"
              style={{ backgroundImage: gradient }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div
                className="relative rounded-2xl border border-white/25 px-6 py-4 text-center shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: "rgba(10, 10, 18, 0.28)", color: "#fff" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-70">
                  background-image
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">AnimCraft</p>
                <p className="mt-1 text-[11px] opacity-70">{stops.length} colour stops</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-4 sm:grid-cols-3">
            <div
              className="flex h-14 items-center justify-center rounded-xl text-xs font-medium"
              style={{ backgroundImage: gradient, color: textColor }}
            >
              Button
            </div>
            <div
              className="flex h-14 items-center gap-2 rounded-xl px-3"
              style={{ backgroundImage: gradient }}
            >
              <span className="h-7 w-7 rounded-full border border-white/50 bg-white/30" />
              <span className="h-1.5 w-12 rounded-full bg-white/60" />
            </div>
            <div
              className="col-span-2 flex h-14 items-center justify-center rounded-xl text-xs font-medium sm:col-span-1"
              style={{ backgroundImage: gradient, color: textColor }}
            >
              Badge
            </div>
          </div>
        </div>

        <Panel title="Snippet">
          <SnippetTabs snippets={snippets} />
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel
          title="Gradient"
          action={
            <button
              type="button"
              onClick={shuffle}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-fg"
            >
              <RefreshIcon className="h-3 w-3" /> Shuffle
            </button>
          }
        >
          <div className="space-y-4">
            <Segmented
              label="Type"
              value={type}
              onChange={setType}
              options={[
                { label: "Linear", value: "linear" },
                { label: "Radial", value: "radial" },
                { label: "Conic", value: "conic" },
              ]}
            />
            {type !== "radial" && (
              <Range
                label="Angle"
                value={angle}
                min={0}
                max={360}
                step={1}
                unit="deg"
                onChange={setAngle}
              />
            )}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-fg-soft">Colour stops</span>
                <span className="font-mono text-[10px] text-muted">{stops.length}/6</span>
              </div>
              <div className="space-y-3">
                {stops.map((stop) => (
                  <div key={stop.id} className="rounded-xl border border-line bg-surface-2/60 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-line-strong">
                        <input
                          type="color"
                          value={normalizeHex(stop.color) ?? "#8b7bff"}
                          onChange={(event) => updateStop(stop.id, { color: event.target.value })}
                          aria-label="Stop colour"
                          className="absolute -inset-1 h-10 w-10 cursor-pointer"
                        />
                      </span>
                      <TextInput
                        label=""
                        value={stop.color}
                        mono
                        maxLength={7}
                        className="flex-1"
                        onChange={(value) => updateStop(stop.id, { color: value })}
                      />
                      <button
                        type="button"
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length <= 2}
                        aria-label="Remove colour stop"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      aria-label="Stop position"
                      onChange={(event) =>
                        updateStop(stop.id, { position: clamp(Number(event.target.value), 0, 100) })
                      }
                      className="mt-2 w-full"
                      style={{ "--range-progress": `${stop.position}%` } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStop}
                disabled={stops.length >= 6}
                className="mt-3 w-full rounded-lg border border-dashed border-line-strong py-2 text-xs font-medium text-muted transition-colors hover:border-accent/60 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Add colour stop
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Presets">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="group overflow-hidden rounded-xl border border-line bg-surface-2/60 p-1.5 text-left transition-colors hover:border-line-strong"
              >
                <span
                  className="block h-10 w-full rounded-lg"
                  style={{ backgroundImage: presetGradient(preset) }}
                />
                <span className="mt-1.5 block px-0.5 text-[11px] font-medium text-fg-soft group-hover:text-fg">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Notes">
          <p className="text-[11px] leading-relaxed text-muted">
            Colours are emitted in position order, so dragging a stop past another re-orders the
            CSS for you. Always keep a solid{" "}
            <code className="font-mono text-fg-soft">background-color</code> fallback for clients
            that skip gradients.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function presetGradient(preset: (typeof presets)[number]): string {
  const stops = preset.colors
    .map(
      (color, index) =>
        `${color} ${Math.round((index / Math.max(1, preset.colors.length - 1)) * 100)}%`,
    )
    .join(", ");
  if (preset.type === "radial") return `radial-gradient(circle at 50% 50%, ${stops})`;
  if (preset.type === "conic") return `conic-gradient(from ${preset.angle}deg, ${stops})`;
  return `linear-gradient(${preset.angle}deg, ${stops})`;
}
