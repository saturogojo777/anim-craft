export interface EasingPreset {
  name: string;
  value: string;
  group: "Basics" | "Product" | "Playful";
}

export const easingPresets: readonly EasingPreset[] = [
  { name: "Linear", value: "linear", group: "Basics" },
  { name: "Ease", value: "ease", group: "Basics" },
  { name: "Ease in", value: "ease-in", group: "Basics" },
  { name: "Ease out", value: "ease-out", group: "Basics" },
  { name: "Ease in-out", value: "ease-in-out", group: "Basics" },
  { name: "Smooth", value: "cubic-bezier(0.4, 0, 0.2, 1)", group: "Product" },
  { name: "Snappy", value: "cubic-bezier(0.16, 1, 0.3, 1)", group: "Product" },
  { name: "Swift", value: "cubic-bezier(0.22, 1, 0.36, 1)", group: "Product" },
  { name: "Sharp", value: "cubic-bezier(0.4, 0, 1, 1)", group: "Product" },
  { name: "Back out", value: "cubic-bezier(0.34, 1.56, 0.64, 1)", group: "Playful" },
  { name: "Anticipate", value: "cubic-bezier(0.36, 0, 0.66, -0.56)", group: "Playful" },
  { name: "Elastic", value: "cubic-bezier(0.68, -0.6, 0.32, 1.6)", group: "Playful" },
];

export const EASING = {
  snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  swift: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  standard: "ease",
  in: "ease-in",
  out: "ease-out",
  inOut: "ease-in-out",
  linear: "linear",
} as const;

export const KEYWORD_EASINGS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"] as const;

export interface BezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const defaultBezier: BezierPoints = { x1: 0.16, y1: 1, x2: 0.3, y2: 1 };

const keywordMap: Record<string, BezierPoints> = {
  linear: { x1: 0, y1: 0, x2: 1, y2: 1 },
  ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
  "ease-in": { x1: 0.42, y1: 0, x2: 1, y2: 1 },
  "ease-out": { x1: 0, y1: 0, x2: 0.58, y2: 1 },
  "ease-in-out": { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
};

/** Parse a CSS easing value into cubic-bezier control points. */
export function parseEasing(value: string): BezierPoints | null {
  const trimmed = value.trim();
  if (trimmed in keywordMap) return keywordMap[trimmed];
  const match = trimmed.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);
  if (!match) return null;
  const [, x1, y1, x2, y2] = match;
  return { x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2) };
}

/** Format control points as a compact CSS easing value. */
export function bezierToString(points: BezierPoints, precision = 3): string {
  const trim = (n: number) => {
    const fixed = Number(n.toFixed(precision));
    return String(fixed);
  };
  return `cubic-bezier(${trim(points.x1)}, ${trim(points.y1)}, ${trim(points.x2)}, ${trim(points.y2)})`;
}

/** Human readable name for a preset value, falling back to the raw value. */
export function easingLabel(value: string): string {
  const preset = easingPresets.find(
    (item) => item.value.replace(/\s+/g, "") === value.replace(/\s+/g, ""),
  );
  return preset?.name ?? value;
}

/** Meter-friendly free-form easing for the gallery select control. */
export function easingValue(value: string): string {
  return parseEasing(value) ? value : "ease";
}
