export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** Format a millisecond value for CSS output, e.g. 620 -> "620ms". */
export function ms(value: number): string {
  return `${Math.round(value)}ms`;
}

/** Simplify a cubic-bezier string when it matches a keyword easing. */
export function prettyEasing(value: string): string {
  const compact = value.replace(/\s+/g, "");
  const map: Record<string, string> = {
    "cubic-bezier(0.25,0.1,0.25,1)": "ease",
    "cubic-bezier(0.42,0,1,1)": "ease-in",
    "cubic-bezier(0,0,0.58,1)": "ease-out",
    "cubic-bezier(0.42,0,0.58,1)": "ease-in-out",
  };
  return map[compact] ?? value.replace(/\s+/g, " ").trim();
}

/** Convert a hyphenated CSS property list into a one-line declaration string. */
export function normalizeDeclarations(input: string): string {
  return input
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("; ");
}

/** `box-shadow` layers need commas between them, never inside a colour function. */
export function joinShadowLayers(layers: string[]): string {
  return layers.filter(Boolean).join(", ");
}
