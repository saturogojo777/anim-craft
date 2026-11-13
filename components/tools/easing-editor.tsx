"use client";

import { useMemo, useRef, useState } from "react";
import {
  bezierToString,
  defaultBezier,
  easingPresets,
  parseEasing,
  type BezierPoints,
} from "@/lib/easings";
import { clamp, cn, round } from "@/lib/utils";
import { CopyButton } from "../copy-button";
import { Panel, Range } from "../ui";
import { SnippetTabs } from "../snippet-tabs";

const SIZE = 320;
const PAD = 34;
const PLOT = SIZE - PAD * 2;
const Y_MIN = -0.7;
const Y_MAX = 1.7;

const toSvgX = (x: number) => PAD + x * PLOT;
const toSvgY = (y: number) => PAD + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT;
const fromSvgX = (x: number) => (x - PAD) / PLOT;
const fromSvgY = (y: number) => Y_MAX - ((y - PAD) / PLOT) * (Y_MAX - Y_MIN);

export function EasingEditor() {
  const [points, setPoints] = useState<BezierPoints>(defaultBezier);
  const [duration, setDuration] = useState(600);
  const [dragging, setDragging] = useState<1 | 2 | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const easing = bezierToString(points);
  const compactEasing = easing.replace(/\s+/g, "");

  const snippets = useMemo(
    () => [
      {
        id: "transition",
        label: "CSS",
        language: "css" as const,
        filename: "easing.css",
        code: `.ease-custom {\n  transition-timing-function: ${easing};\n  transition-duration: ${duration}ms;\n}\n\n/* or inside a shorthand */\n.animated {\n  transition: transform ${duration}ms ${easing};\n}`,
      },
      {
        id: "variable",
        label: "CSS variable",
        language: "css" as const,
        filename: "tokens.css",
        code: `:root {\n  --ease-custom: ${easing};\n}\n\n.element {\n  transition: transform ${duration}ms var(--ease-custom);\n}`,
      },
      {
        id: "tailwind",
        label: "Tailwind",
        language: "html" as const,
        filename: "markup",
        code: `<!-- Tailwind CSS v4 arbitrary value -->\n<div class="transition-transform duration-[${duration}ms] ease-[${compactEasing}] hover:translate-y-[-4px]">\n  Hover me\n</div>`,
      },
      {
        id: "js",
        label: "JavaScript",
        language: "js" as const,
        filename: "motion.js",
        code: `const easing = "${easing}";\n\nconst animation = element.animate(keyframes, {\n  duration: ${duration},\n  easing,\n  fill: "both",\n});`,
      },
    ],
    [easing, compactEasing, duration],
  );

  const applyPreset = (value: string) => {
    const parsed = parseEasing(value);
    if (parsed) setPoints(parsed);
  };

  const updatePoint = (key: keyof BezierPoints, value: number) => {
    setPoints((previous) => ({ ...previous, [key]: value }));
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * SIZE;
    const svgY = ((event.clientY - rect.top) / rect.height) * SIZE;
    const x = round(clamp(fromSvgX(svgX), 0, 1), 2);
    const y = round(clamp(fromSvgY(svgY), Y_MIN + 0.1, Y_MAX - 0.1), 2);
    setPoints((previous) =>
      dragging === 1 ? { ...previous, x1: x, y1: y } : { ...previous, x2: x, y2: y },
    );
  };

  const startDrag = (handle: 1 | 2) => (event: React.PointerEvent<SVGCircleElement>) => {
    event.preventDefault();
    svgRef.current?.setPointerCapture(event.pointerId);
    setDragging(handle);
  };

  const endDrag = () => setDragging(null);

  const p1x = toSvgX(points.x1);
  const p1y = toSvgY(points.y1);
  const p2x = toSvgX(points.x2);
  const p2y = toSvgY(points.y2);
  const startX = toSvgX(0);
  const startY = toSvgY(0);
  const endX = toSvgX(1);
  const endY = toSvgY(1);

  const curvePath = `M ${startX} ${startY} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${endX} ${endY}`;

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <Panel className="relative overflow-hidden">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Cubic-bézier curve</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Drag the two control points — X is time, Y is progress.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-xs text-fg-soft">
                {easing}
              </code>
              <CopyButton value={easing} label="Copy" ariaLabel="Copy easing value" />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface-2/40 p-2">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className={cn(
                "w-full touch-none select-none",
                dragging ? "cursor-grabbing" : "cursor-crosshair",
              )}
              onPointerMove={handleMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="img"
              aria-label={`Cubic bezier curve with control points ${points.x1}, ${points.y1} and ${points.x2}, ${points.y2}`}
            >
              <defs>
                <linearGradient id="easing-stroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>

              {/* area outside the unit square */}
              <rect
                x={PAD}
                y={PAD}
                width={PLOT}
                height={toSvgY(1) - PAD}
                fill="var(--surface)"
                opacity="0.65"
              />
              <rect
                x={PAD}
                y={toSvgY(0)}
                width={PLOT}
                height={PAD + PLOT - toSvgY(0)}
                fill="var(--surface)"
                opacity="0.65"
              />

              {/* unit square */}
              <rect
                x={PAD}
                y={toSvgY(1)}
                width={PLOT}
                height={toSvgY(0) - toSvgY(1)}
                fill="none"
                stroke="var(--line-strong)"
                strokeDasharray="3 4"
              />

              {/* grid */}
              {[0.25, 0.5, 0.75].map((tick) => (
                <g key={tick}>
                  <line
                    x1={toSvgX(tick)}
                    y1={toSvgY(1)}
                    x2={toSvgX(tick)}
                    y2={toSvgY(0)}
                    stroke="var(--line)"
                  />
                  <line
                    x1={PAD}
                    y1={toSvgY(tick)}
                    x2={PAD + PLOT}
                    y2={toSvgY(tick)}
                    stroke="var(--line)"
                  />
                </g>
              ))}

              {/* axis labels */}
              <text x={PAD} y={PAD + PLOT + 22} fontSize="10" fill="var(--muted)" fontFamily="var(--font-code)">
                0
              </text>
              <text
                x={PAD + PLOT}
                y={PAD + PLOT + 22}
                fontSize="10"
                fill="var(--muted)"
                textAnchor="end"
                fontFamily="var(--font-code)"
              >
                time
              </text>
              <text x={PAD - 12} y={toSvgY(1) + 4} fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-code)">
                1
              </text>
              <text x={PAD - 12} y={toSvgY(0) + 4} fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-code)">
                0
              </text>

              {/* handle guides */}
              <line x1={startX} y1={startY} x2={p1x} y2={p1y} stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="1.25" />
              <line x1={endX} y1={endY} x2={p2x} y2={p2y} stroke="var(--accent-2)" strokeOpacity="0.45" strokeWidth="1.25" />

              {/* curve */}
              <path d={curvePath} fill="none" stroke="url(#easing-stroke)" strokeWidth="3" strokeLinecap="round" />

              {/* anchors */}
              <circle cx={startX} cy={startY} r="4" fill="var(--muted)" />
              <circle cx={endX} cy={endY} r="4" fill="var(--muted)" />

              {/* control points */}
              <g className="cursor-grab">
                <circle
                  cx={p1x}
                  cy={p1y}
                  r="18"
                  fill="var(--accent)"
                  fillOpacity="0.12"
                  onPointerDown={startDrag(1)}
                />
                <circle
                  cx={p1x}
                  cy={p1y}
                  r="7"
                  fill="var(--accent)"
                  stroke="var(--bg)"
                  strokeWidth="2"
                  onPointerDown={startDrag(1)}
                />
                <circle
                  cx={p2x}
                  cy={p2y}
                  r="18"
                  fill="var(--accent-2)"
                  fillOpacity="0.12"
                  onPointerDown={startDrag(2)}
                />
                <circle
                  cx={p2x}
                  cy={p2y}
                  r="7"
                  fill="var(--accent-2)"
                  stroke="var(--bg)"
                  strokeWidth="2"
                  onPointerDown={startDrag(2)}
                />
              </g>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {easingPresets.map((preset) => {
              const parsed = parseEasing(preset.value);
              const active =
                parsed !== null &&
                bezierToString(parsed) === bezierToString(points);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset.value)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    active
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Feel it">
          <div className="space-y-3">
            <Lane label="Linear" easing="linear" duration={duration} tone="muted" />
            <Lane label="Ease out" easing="ease-out" duration={duration} tone="muted" />
            <Lane label="Your curve" easing={easing} duration={duration} tone="accent" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <Range
              label="Preview duration"
              value={duration}
              min={120}
              max={2000}
              step={20}
              unit="ms"
              onChange={setDuration}
            />
            <div className="rounded-lg border border-line bg-surface-2/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Duration</p>
              <p className="font-mono text-sm text-fg">{duration}ms</p>
            </div>
          </div>
          <style>{`@keyframes ac-ease-lane { from { left: 0%; } to { left: calc(100% - 0.75rem); } }`}</style>
        </Panel>

        <Panel title="Snippet">
          <SnippetTabs snippets={snippets} />
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Control points">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["x1", "P1 · X", 0, 1],
                ["y1", "P1 · Y", Y_MIN, Y_MAX],
                ["x2", "P2 · X", 0, 1],
                ["y2", "P2 · Y", Y_MIN, Y_MAX],
              ] as const
            ).map(([key, label, min, max]) => (
              <label key={key} className="space-y-1">
                <span className="text-xs font-medium text-fg-soft">{label}</span>
                <input
                  type="number"
                  step={0.01}
                  min={min}
                  max={max}
                  value={points[key]}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next)) updatePoint(key, round(clamp(next, min, max), 3));
                  }}
                  className="w-full rounded-lg border border-line bg-surface-2 px-2.5 py-2 font-mono text-xs outline-none transition-colors focus:border-accent"
                />
              </label>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            X values must stay between 0 and 1. Y values may overshoot for anticipation and
            elastic effects — that&apos;s where the personality lives.
          </p>
        </Panel>

        <Panel title="Reading the curve">
          <ul className="space-y-2.5 text-[11px] leading-relaxed text-muted">
            <li>
              <span className="text-fg-soft">Flat start</span> = slow out of the gate; the element
              eases in.
            </li>
            <li>
              <span className="text-fg-soft">Flat end</span> = a soft landing; the element decelerates.
            </li>
            <li>
              <span className="text-fg-soft">Steep middle</span> = speed. Keep UI motion between
              150–400ms.
            </li>
            <li>
              <span className="text-fg-soft">Below zero</span> = anticipation: the element pulls back
              before it moves.
            </li>
          </ul>
        </Panel>

        <Panel title="Good defaults">
          <div className="space-y-2 text-[11px]">
            {[
              ["Entrances", "cubic-bezier(0.16, 1, 0.3, 1)"],
              ["Exits", "cubic-bezier(0.4, 0, 1, 1)"],
              ["On-screen moves", "cubic-bezier(0.4, 0, 0.2, 1)"],
              ["Playful", "cubic-bezier(0.34, 1.56, 0.64, 1)"],
            ].map(([label, value]) => (
              <button
                key={label}
                type="button"
                onClick={() => applyPreset(value)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-surface-2/50 px-2.5 py-2 text-left transition-colors hover:border-line-strong"
              >
                <span className="text-fg-soft">{label}</span>
                <code className="font-mono text-[10px] text-muted">{value.replace(/cubic-bezier|\(|\)/g, "").replace(/, /g, " ")}</code>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Lane({
  label,
  easing,
  duration,
  tone,
}: {
  label: string;
  easing: string;
  duration: number;
  tone: "muted" | "accent";
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-muted">{label}</span>
        <code className="font-mono text-[10px] text-muted/80">{easing}</code>
      </div>
      <div className="relative h-8 rounded-lg border border-line bg-surface-2/60">
        <span
          className={cn(
            "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full",
            tone === "accent" ? "bg-accent shadow-[0_0_16px_rgba(139,123,255,0.8)]" : "bg-muted/60",
          )}
          style={{
            animation: `ac-ease-lane ${duration}ms ${easing} 0ms infinite alternate`,
          }}
        />
      </div>
    </div>
  );
}
