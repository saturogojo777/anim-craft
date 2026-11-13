import { EASING, easingLabel } from "./easings";
import { ms } from "./utils";

export type AnimationCategory =
  | "entrance"
  | "exit"
  | "emphasis"
  | "hover"
  | "loader"
  | "background"
  | "text";

export type PreviewKind =
  | "box"
  | "card"
  | "text"
  | "ring"
  | "dot"
  | "ball"
  | "bar"
  | "skeleton"
  | "orb";

export type AnimationTrigger = "load" | "hover";

export interface AnimationDef {
  slug: string;
  name: string;
  category: AnimationCategory;
  summary: string;
  /** [offset, declarations] pairs, in order. */
  frames: ReadonlyArray<readonly [string, string]>;
  /** Declarations that must live on the element itself. */
  base?: string;
  preview: PreviewKind;
  duration: number;
  delay?: number;
  easing: string;
  iterations?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fill?: "none" | "forwards" | "backwards" | "both";
  trigger?: AnimationTrigger;
  tags?: readonly string[];
}

export interface MotionSettings {
  duration: number;
  delay: number;
  easing: string;
  iterations: number | "infinite";
}

export const defaultMotion: MotionSettings = {
  duration: 700,
  delay: 0,
  easing: EASING.snappy,
  iterations: 1,
};

export const categories: ReadonlyArray<{
  id: AnimationCategory;
  label: string;
  blurb: string;
}> = [
  { id: "entrance", label: "Entrances", blurb: "Bring elements on screen with intent." },
  { id: "exit", label: "Exits", blurb: "Leave the stage gracefully." },
  { id: "emphasis", label: "Emphasis", blurb: "Draw the eye without shouting." },
  { id: "hover", label: "Micro-interactions", blurb: "Reward every pointer movement." },
  { id: "loader", label: "Loaders", blurb: "Make waiting feel shorter." },
  { id: "background", label: "Backgrounds", blurb: "Ambient motion for surfaces." },
  { id: "text", label: "Text effects", blurb: "Type that refuses to sit still." },
];

export const categoryLabel = (id: AnimationCategory): string =>
  categories.find((category) => category.id === id)?.label ?? id;

const SHEEN_GRADIENT =
  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)";

export const animations: readonly AnimationDef[] = [
  /* ------------------------------------------------------------- entrances */
  {
    slug: "fade-up",
    name: "Fade up",
    category: "entrance",
    summary: "The dependable default for content appearing below the fold.",
    frames: [
      ["from", "opacity: 0; transform: translate3d(0, 18px, 0)"],
      ["to", "opacity: 1; transform: translate3d(0, 0, 0)"],
    ],
    preview: "box",
    duration: 620,
    easing: EASING.snappy,
    tags: ["subtle", "content"],
  },
  {
    slug: "fade-in",
    name: "Fade in",
    category: "entrance",
    summary: "A pure opacity transition — the least distracting entrance there is.",
    frames: [
      ["from", "opacity: 0"],
      ["to", "opacity: 1"],
    ],
    preview: "box",
    duration: 480,
    easing: EASING.out,
    tags: ["subtle", "essential"],
  },
  {
    slug: "scale-in",
    name: "Scale in",
    category: "entrance",
    summary: "Grows into place from 92% for dialogs, popovers, and cards.",
    frames: [
      ["from", "opacity: 0; transform: scale(0.92)"],
      ["to", "opacity: 1; transform: scale(1)"],
    ],
    preview: "box",
    duration: 520,
    easing: EASING.snappy,
    tags: ["ui", "dialog"],
  },
  {
    slug: "slide-in-left",
    name: "Slide in left",
    category: "entrance",
    summary: "Slides in from the start edge — made for drawers and toasts.",
    frames: [
      ["from", "opacity: 0; transform: translate3d(-28px, 0, 0)"],
      ["to", "opacity: 1; transform: translate3d(0, 0, 0)"],
    ],
    preview: "box",
    duration: 560,
    easing: EASING.swift,
    tags: ["toast", "drawer"],
  },
  {
    slug: "slide-in-right",
    name: "Slide in right",
    category: "entrance",
    summary: "Enters from the end edge; pairs well with slide-out-right.",
    frames: [
      ["from", "opacity: 0; transform: translate3d(28px, 0, 0)"],
      ["to", "opacity: 1; transform: translate3d(0, 0, 0)"],
    ],
    preview: "box",
    duration: 560,
    easing: EASING.swift,
    tags: ["toast", "drawer"],
  },
  {
    slug: "blur-in",
    name: "Blur in",
    category: "entrance",
    summary: "Resolves out of a soft focus. Use sparingly, and never on text-heavy pages.",
    frames: [
      ["from", "opacity: 0; filter: blur(14px); transform: scale(1.02)"],
      ["to", "opacity: 1; filter: blur(0); transform: scale(1)"],
    ],
    preview: "box",
    duration: 720,
    easing: EASING.snappy,
    tags: ["cinematic"],
  },
  {
    slug: "flip-in-x",
    name: "Flip in X",
    category: "entrance",
    summary: "A 3D card flip built entirely with transforms — no libraries.",
    frames: [
      ["from", "opacity: 0; transform: perspective(900px) rotateX(-70deg)"],
      ["to", "opacity: 1; transform: perspective(900px) rotateX(0deg)"],
    ],
    base: "transform-origin: 50% 100%",
    preview: "box",
    duration: 680,
    easing: EASING.snappy,
    tags: ["3d"],
  },
  {
    slug: "rotate-in",
    name: "Rotate in",
    category: "entrance",
    summary: "A slight rotation and scale that feels hand-placed.",
    frames: [
      ["from", "opacity: 0; transform: rotate(-10deg) scale(0.9)"],
      ["to", "opacity: 1; transform: rotate(0deg) scale(1)"],
    ],
    preview: "box",
    duration: 620,
    easing: EASING.spring,
    tags: ["playful"],
  },
  {
    slug: "pop-in",
    name: "Pop in",
    category: "entrance",
    summary: "Overshoots slightly before settling — perfect for badges and avatars.",
    frames: [
      ["0%", "opacity: 0; transform: scale(0.6)"],
      ["60%", "opacity: 1; transform: scale(1.08)"],
      ["100%", "opacity: 1; transform: scale(1)"],
    ],
    preview: "box",
    duration: 560,
    easing: EASING.snappy,
    tags: ["playful", "badge"],
  },
  {
    slug: "drop-in",
    name: "Drop in",
    category: "entrance",
    summary: "Falls in with a soft bounce, like a notification landing.",
    frames: [
      ["0%", "opacity: 0; transform: translate3d(0, -48px, 0)"],
      ["65%", "opacity: 1; transform: translate3d(0, 6px, 0)"],
      ["100%", "opacity: 1; transform: translate3d(0, 0, 0)"],
    ],
    preview: "box",
    duration: 700,
    easing: EASING.spring,
    tags: ["notification"],
  },

  /* ----------------------------------------------------------------- exits */
  {
    slug: "fade-out-up",
    name: "Fade out up",
    category: "exit",
    summary: "Lifts away as it fades — great for removing list rows.",
    frames: [
      ["from", "opacity: 1; transform: translate3d(0, 0, 0)"],
      ["to", "opacity: 0; transform: translate3d(0, -16px, 0)"],
    ],
    preview: "box",
    duration: 360,
    easing: EASING.in,
    iterations: 2,
    direction: "alternate",
    tags: ["list"],
  },
  {
    slug: "scale-out",
    name: "Scale out",
    category: "exit",
    summary: "Shrinks and fades; the tidy way to dismiss a popover.",
    frames: [
      ["from", "opacity: 1; transform: scale(1)"],
      ["to", "opacity: 0; transform: scale(0.92)"],
    ],
    preview: "box",
    duration: 320,
    easing: EASING.in,
    iterations: 2,
    direction: "alternate",
    tags: ["dialog"],
  },
  {
    slug: "slide-out-right",
    name: "Slide out right",
    category: "exit",
    summary: "Exits toward the end edge, mirroring slide-in-right.",
    frames: [
      ["from", "opacity: 1; transform: translate3d(0, 0, 0)"],
      ["to", "opacity: 0; transform: translate3d(28px, 0, 0)"],
    ],
    preview: "box",
    duration: 360,
    easing: EASING.in,
    iterations: 2,
    direction: "alternate",
    tags: ["drawer"],
  },
  {
    slug: "blur-out",
    name: "Blur out",
    category: "exit",
    summary: "Dissolves into a blur for cinematic section changes.",
    frames: [
      ["from", "opacity: 1; filter: blur(0); transform: scale(1)"],
      ["to", "opacity: 0; filter: blur(10px); transform: scale(0.98)"],
    ],
    preview: "box",
    duration: 420,
    easing: EASING.in,
    iterations: 2,
    direction: "alternate",
    tags: ["cinematic"],
  },

  /* ------------------------------------------------------------- emphasis */
  {
    slug: "pulse",
    name: "Pulse",
    category: "emphasis",
    summary: "A gentle scale breath that keeps a status badge alive.",
    frames: [
      ["0%, 100%", "transform: scale(1)"],
      ["50%", "transform: scale(1.06)"],
    ],
    preview: "box",
    duration: 1600,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["status", "loop"],
  },
  {
    slug: "heartbeat",
    name: "Heartbeat",
    category: "emphasis",
    summary: "Double-thump scale, sampled from a healthy ventricle.",
    frames: [
      ["0%", "transform: scale(1)"],
      ["14%", "transform: scale(1.12)"],
      ["28%", "transform: scale(1)"],
      ["42%", "transform: scale(1.12)"],
      ["70%", "transform: scale(1)"],
      ["100%", "transform: scale(1)"],
    ],
    preview: "box",
    duration: 1500,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["like", "loop"],
  },
  {
    slug: "shake",
    name: "Shake",
    category: "emphasis",
    summary: "The universal 'that input is invalid' nudge.",
    frames: [
      ["0%, 100%", "transform: translate3d(0, 0, 0)"],
      ["20%", "transform: translate3d(-6px, 0, 0)"],
      ["40%", "transform: translate3d(6px, 0, 0)"],
      ["60%", "transform: translate3d(-4px, 0, 0)"],
      ["80%", "transform: translate3d(4px, 0, 0)"],
    ],
    preview: "card",
    duration: 500,
    easing: EASING.inOut,
    iterations: 2,
    tags: ["error", "form"],
  },
  {
    slug: "wobble",
    name: "Wobble",
    category: "emphasis",
    summary: "A loose rotation that suggests 'give me a nudge'.",
    frames: [
      ["0%, 100%", "transform: rotate(0deg)"],
      ["25%", "transform: rotate(-5deg)"],
      ["75%", "transform: rotate(5deg)"],
    ],
    preview: "box",
    duration: 1000,
    easing: EASING.inOut,
    iterations: 2,
    tags: ["playful"],
  },
  {
    slug: "jello",
    name: "Jello",
    category: "emphasis",
    summary: "Skew-based elastic squish with a very satisfying landing.",
    frames: [
      ["0%, 100%", "transform: skew(0deg, 0deg)"],
      ["22%", "transform: skew(-9deg, -9deg)"],
      ["33%", "transform: skew(7deg, 7deg)"],
      ["44%", "transform: skew(-5deg, -5deg)"],
      ["55%", "transform: skew(3deg, 3deg)"],
      ["66%", "transform: skew(-2deg, -2deg)"],
    ],
    preview: "box",
    duration: 900,
    easing: EASING.inOut,
    iterations: 2,
    tags: ["playful"],
  },
  {
    slug: "float",
    name: "Float",
    category: "emphasis",
    summary: "Slow vertical drift for hero art and empty-state illustrations.",
    frames: [
      ["0%, 100%", "transform: translate3d(0, 0, 0)"],
      ["50%", "transform: translate3d(0, -10px, 0)"],
    ],
    preview: "box",
    duration: 3000,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["ambient", "loop"],
  },
  {
    slug: "glow",
    name: "Glow",
    category: "emphasis",
    summary: "An expanding box-shadow halo for primary actions.",
    frames: [
      ["0%, 100%", "box-shadow: 0 0 0 0 rgba(139, 123, 255, 0.55)"],
      ["70%", "box-shadow: 0 0 0 18px rgba(139, 123, 255, 0)"],
    ],
    preview: "box",
    duration: 1800,
    easing: EASING.out,
    iterations: "infinite",
    tags: ["cta", "loop"],
  },
  {
    slug: "swing",
    name: "Swing",
    category: "emphasis",
    summary: "Pivot-based sway with a transform-origin at the top edge.",
    frames: [
      ["0%, 100%", "transform: rotate(0deg)"],
      ["20%", "transform: rotate(8deg)"],
      ["40%", "transform: rotate(-6deg)"],
      ["60%", "transform: rotate(4deg)"],
      ["80%", "transform: rotate(-2deg)"],
    ],
    base: "transform-origin: 50% 0%",
    preview: "box",
    duration: 1200,
    easing: EASING.inOut,
    iterations: 2,
    tags: ["playful"],
  },

  /* ------------------------------------------------------ micro-interactions */
  {
    slug: "hover-lift",
    name: "Lift",
    category: "hover",
    summary: "Rises with a deeper shadow on hover — the classic card affordance.",
    frames: [
      ["from", "transform: translateY(0); box-shadow: 0 0 0 rgba(0, 0, 0, 0)"],
      ["to", "transform: translateY(-6px); box-shadow: 0 16px 30px -18px rgba(0, 0, 0, 0.65)"],
    ],
    base:
      "transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease; will-change: transform",
    preview: "card",
    duration: 220,
    easing: EASING.snappy,
    trigger: "hover",
    tags: ["card", "micro"],
  },
  {
    slug: "hover-pop",
    name: "Pop",
    category: "hover",
    summary: "A quick spring scale for icon buttons and tags.",
    frames: [
      ["from", "transform: scale(1)"],
      ["to", "transform: scale(1.08)"],
    ],
    base: "transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1); will-change: transform",
    preview: "box",
    duration: 200,
    easing: EASING.spring,
    trigger: "hover",
    tags: ["icon", "micro"],
  },
  {
    slug: "hover-tilt",
    name: "Tilt",
    category: "hover",
    summary: "A three-degree lean that adds tactility to flat surfaces.",
    frames: [
      ["from", "transform: rotate(0deg) scale(1)"],
      ["to", "transform: rotate(-3deg) scale(1.02)"],
    ],
    base: "transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1); will-change: transform",
    preview: "card",
    duration: 240,
    easing: EASING.snappy,
    trigger: "hover",
    tags: ["card", "micro"],
  },
  {
    slug: "hover-sheen",
    name: "Sheen",
    category: "hover",
    summary: "A light sweep across the surface — no extra DOM required.",
    frames: [
      ["from", `background-position: 160% 0, 0 0`],
      ["to", `background-position: -60% 0, 0 0`],
    ],
    base: `background-image: ${SHEEN_GRADIENT}, linear-gradient(135deg, #8b7bff, #22d3ee); background-size: 250% 100%, 100% 100%; background-repeat: no-repeat`,
    preview: "card",
    duration: 700,
    easing: EASING.smooth,
    trigger: "hover",
    tags: ["button", "shine"],
  },
  {
    slug: "hover-ring",
    name: "Focus ring",
    category: "hover",
    summary: "An animated halo that signals focus without moving a pixel.",
    frames: [
      ["from", "box-shadow: 0 0 0 0 rgba(139, 123, 255, 0.6)"],
      ["to", "box-shadow: 0 0 0 12px rgba(139, 123, 255, 0)"],
    ],
    preview: "box",
    duration: 700,
    easing: EASING.out,
    trigger: "hover",
    tags: ["focus", "accessibility"],
  },
  {
    slug: "hover-underline",
    name: "Underline sweep",
    category: "hover",
    summary: "A gradient underline that draws itself from left to right.",
    frames: [
      ["from", "background-size: 0% 2px"],
      ["to", "background-size: 100% 2px"],
    ],
    base:
      "display: inline-block; background-image: linear-gradient(90deg, var(--accent, #8b7bff), var(--accent-2, #22d3ee)); background-repeat: no-repeat; background-position: 0 100%; transition: background-size 260ms cubic-bezier(0.16, 1, 0.3, 1); padding-bottom: 4px",
    preview: "text",
    duration: 260,
    easing: EASING.snappy,
    trigger: "hover",
    tags: ["link", "micro"],
  },
  {
    slug: "hover-bounce",
    name: "Bounce",
    category: "hover",
    summary: "A short hop for playful download and cart buttons.",
    frames: [
      ["0%", "transform: translateY(0)"],
      ["40%", "transform: translateY(-8px)"],
      ["70%", "transform: translateY(-3px)"],
      ["100%", "transform: translateY(0)"],
    ],
    preview: "box",
    duration: 520,
    easing: EASING.inOut,
    trigger: "hover",
    tags: ["button", "playful"],
  },

  /* --------------------------------------------------------------- loaders */
  {
    slug: "spin",
    name: "Spin",
    category: "loader",
    summary: "The canonical indeterminate spinner, one ring and one keyframe.",
    frames: [
      ["from", "transform: rotate(0deg)"],
      ["to", "transform: rotate(360deg)"],
    ],
    base: "border-radius: 999px",
    preview: "ring",
    duration: 900,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["spinner", "loop"],
  },
  {
    slug: "ping",
    name: "Ping",
    category: "loader",
    summary: "A radar-like pulse for live indicators and unread dots.",
    frames: [
      ["0%", "transform: scale(1); opacity: 0.8"],
      ["75%, 100%", "transform: scale(2.4); opacity: 0"],
    ],
    preview: "dot",
    duration: 1400,
    easing: "cubic-bezier(0, 0, 0.2, 1)",
    iterations: "infinite",
    tags: ["live", "loop"],
  },
  {
    slug: "bounce-loader",
    name: "Bouncing ball",
    category: "loader",
    summary: "A soft bounce with easing tuned to feel physical, not metronomic.",
    frames: [
      ["0%, 100%", "transform: translateY(0); animation-timing-function: cubic-bezier(0.5, 0, 1, 1)"],
      ["50%", "transform: translateY(-16px); animation-timing-function: cubic-bezier(0, 0, 0.5, 1)"],
    ],
    preview: "ball",
    duration: 1000,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["loop"],
  },
  {
    slug: "skeleton-shimmer",
    name: "Skeleton shimmer",
    category: "loader",
    summary: "A moving highlight that makes placeholder blocks feel intentional.",
    frames: [
      ["from", "background-position: 200% 0"],
      ["to", "background-position: -200% 0"],
    ],
    base:
      "background-image: linear-gradient(90deg, rgba(148, 148, 170, 0.12) 25%, rgba(148, 148, 170, 0.32) 50%, rgba(148, 148, 170, 0.12) 75%); background-size: 200% 100%",
    preview: "skeleton",
    duration: 1600,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["skeleton", "loop"],
  },
  {
    slug: "equalizer",
    name: "Equalizer",
    category: "loader",
    summary: "A single bar that breathes from the baseline; duplicate it for a full set.",
    frames: [
      ["0%, 100%", "transform: scaleY(0.35)"],
      ["50%", "transform: scaleY(1)"],
    ],
    base: "transform-origin: 50% 100%",
    preview: "bar",
    duration: 900,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["audio", "loop"],
  },
  {
    slug: "orbit",
    name: "Orbit",
    category: "loader",
    summary: "A dot circling its container — pair with a static track for depth.",
    frames: [
      ["from", "transform: rotate(0deg) translateX(22px) rotate(0deg)"],
      ["to", "transform: rotate(360deg) translateX(22px) rotate(-360deg)"],
    ],
    preview: "dot",
    duration: 1400,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["loop"],
  },

  /* ----------------------------------------------------------- backgrounds */
  {
    slug: "gradient-pan",
    name: "Gradient pan",
    category: "background",
    summary: "A slow drifting gradient that gives dark sections depth.",
    frames: [
      ["0%", "background-position: 0% 50%"],
      ["100%", "background-position: 100% 50%"],
    ],
    base:
      "background-image: linear-gradient(120deg, #8b7bff, #22d3ee, #f472b6, #8b7bff); background-size: 300% 300%",
    preview: "card",
    duration: 8000,
    easing: EASING.inOut,
    iterations: "infinite",
    direction: "alternate",
    tags: ["ambient", "loop"],
  },
  {
    slug: "aurora",
    name: "Aurora",
    category: "background",
    summary: "A rotating conic gradient that feels alive behind hero copy.",
    frames: [
      ["from", "transform: rotate(0deg)"],
      ["to", "transform: rotate(360deg)"],
    ],
    base:
      "background-image: conic-gradient(from 0deg, #8b7bff, #22d3ee, #f472b6, #8b7bff); filter: blur(2px)",
    preview: "orb",
    duration: 12000,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["ambient", "loop"],
  },
  {
    slug: "blob-morph",
    name: "Blob morph",
    category: "background",
    summary: "Squishy border-radius morphing for decorative shapes.",
    frames: [
      ["0%, 100%", "border-radius: 42% 58% 60% 40% / 45% 55% 45% 55%"],
      ["50%", "border-radius: 60% 40% 55% 45% / 35% 60% 40% 65%"],
    ],
    base:
      "background-image: linear-gradient(135deg, #8b7bff, #22d3ee); filter: blur(0.5px)",
    preview: "orb",
    duration: 8000,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["ambient", "loop"],
  },
  {
    slug: "grid-pan",
    name: "Grid pan",
    category: "background",
    summary: "An infinite engineering grid that scrolls without a canvas.",
    frames: [
      ["from", "background-position: 0 0, 0 0"],
      ["to", "background-position: 22px 22px, 22px 22px"],
    ],
    base:
      "background-image: linear-gradient(to right, rgba(139, 123, 255, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.3) 1px, transparent 1px); background-size: 22px 22px",
    preview: "card",
    duration: 2400,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["ambient", "loop"],
  },

  /* ------------------------------------------------------------------ text */
  {
    slug: "text-shimmer",
    name: "Text shimmer",
    category: "text",
    summary: "A gradient sweeping through clipped text — great for headlines.",
    frames: [
      ["from", "background-position: 0% 50%"],
      ["to", "background-position: 200% 50%"],
    ],
    base:
      "background-image: linear-gradient(100deg, #8b7bff, #22d3ee, #f472b6, #8b7bff); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent",
    preview: "text",
    duration: 4000,
    easing: EASING.linear,
    iterations: "infinite",
    tags: ["headline", "loop"],
  },
  {
    slug: "text-glow",
    name: "Text glow",
    category: "text",
    summary: "A breathing neon halo, rendered with text-shadow only.",
    frames: [
      ["0%, 100%", "text-shadow: 0 0 10px rgba(139, 123, 255, 0.35)"],
      ["50%", "text-shadow: 0 0 26px rgba(139, 123, 255, 0.9), 0 0 46px rgba(34, 211, 238, 0.45)"],
    ],
    preview: "text",
    duration: 2400,
    easing: EASING.inOut,
    iterations: "infinite",
    tags: ["neon", "loop"],
  },
  {
    slug: "typing",
    name: "Typing",
    category: "text",
    summary: "A steps() reveal with a blinking caret — pure CSS, no JavaScript.",
    frames: [
      ["from", "width: 0"],
      ["to", "width: 9ch"],
    ],
    base:
      'display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; overflow: hidden; white-space: nowrap; border-right: 2px solid #8b7bff; padding-right: 2px',
    preview: "text",
    duration: 1800,
    easing: "steps(9, end)",
    iterations: "infinite",
    direction: "alternate",
    tags: ["terminal", "loop"],
  },
  {
    slug: "tracking-in",
    name: "Tracking in",
    category: "text",
    summary: "Loosens letter-spacing into place — ideal for short labels.",
    frames: [
      ["from", "opacity: 0; letter-spacing: 0.4em"],
      ["to", "opacity: 1; letter-spacing: 0"],
    ],
    preview: "text",
    duration: 800,
    easing: EASING.swift,
    tags: ["label"],
  },
];

/* ---------------------------------------------------------------- helpers */

export const animationCount = animations.length;

export function findAnimation(slug: string): AnimationDef | undefined {
  return animations.find((item) => item.slug === slug);
}

function declarationLines(declarations: string, indent: number): string {
  return declarations
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `${" ".repeat(indent)}${part};`)
    .join("\n");
}

export function keyframesCss(def: AnimationDef, name = def.slug): string {
  const body = def.frames
    .map(([offset, declarations]) => `  ${offset} {\n${declarationLines(declarations, 4)}\n  }`)
    .join("\n");
  return `@keyframes ${name} {\n${body}\n}`;
}

export function animationShorthand(def: AnimationDef, settings?: MotionSettings): string {
  const duration = settings?.duration ?? def.duration;
  const delay = settings?.delay ?? def.delay ?? 0;
  const easing = settings?.easing ?? def.easing;
  const iterations = settings?.iterations ?? def.iterations ?? 1;
  const direction = def.direction ?? "normal";
  const fill = def.fill ?? "both";
  return `${def.slug} ${ms(duration)} ${easing} ${ms(delay)} ${iterations} ${direction} ${fill}`;
}

/** Full, self-contained CSS users can paste into their stylesheet. */
export function cssSnippet(def: AnimationDef, settings?: MotionSettings): string {
  const isHover = def.trigger === "hover";
  const base = def.base ? `${declarationLines(def.base, 2)}\n` : "";
  const rule = isHover
    ? `.${def.slug} {\n${base || ""}}\n\n.${def.slug}:hover {\n  animation: ${animationShorthand(def, settings)};\n}`
    : `.${def.slug} {\n${base}  animation: ${animationShorthand(def, settings)};\n}`;

  const reduce = isHover
    ? `@media (prefers-reduced-motion: reduce) {\n  .${def.slug}:hover {\n    animation: none;\n  }\n}`
    : `@media (prefers-reduced-motion: reduce) {\n  .${def.slug} {\n    animation: none;\n  }\n}`;

  return `/* ${def.name} — AnimCraft */\n${keyframesCss(def)}\n\n${rule}\n\n${reduce}`;
}

export function tailwindSnippet(def: AnimationDef, settings?: MotionSettings): string {
  const shorthand = animationShorthand(def, settings).replace(
    /cubic-bezier\(([^)]+)\)/g,
    (_, inner: string) => `cubic-bezier(${inner.replace(/\s+/g, "")})`,
  );
  const arbitrary = shorthand.replace(/\s+/g, "_");
  const utility = def.trigger === "hover" ? `hover:animate-[${arbitrary}]` : `animate-[${arbitrary}]`;
  const base = def.base ? `\n\n/* base styles for the element */\n.${def.slug} {\n${declarationLines(def.base, 2)}\n}` : "";

  return `/* Tailwind CSS v4 — add the keyframes to your global stylesheet */\n${keyframesCss(def)}${base}\n\n<div class="${def.slug} ${utility}">\n  Your content\n</div>`;
}

export function htmlSnippet(def: AnimationDef): string {
  return `<!-- ${def.name} -->\n<div class="${def.slug}">\n  Your content\n</div>`;
}

/**
 * Stylesheet injected once for every gallery preview. Everything is driven by
 * CSS custom properties so the toolbar can retune 40 previews without
 * re-rendering a single keyframe.
 */
export function previewStylesheet(): string {
  return animations
    .map((def) => {
      const animation = `animation: ac-${def.slug} var(--ac-duration, ${ms(def.duration)}) var(--ac-easing, ${def.easing}) var(--ac-delay, ${ms(def.delay ?? 0)}) var(--ac-iterations, ${def.iterations ?? 1}) var(--ac-direction, ${def.direction ?? "normal"}) var(--ac-fill, ${def.fill ?? "both"})`;
      const base = def.base ? `${def.base};` : "";
      const rule =
        def.trigger === "hover"
          ? `.ac-hover-${def.slug} { ${base} } .ac-hover-${def.slug}:hover { ${animation}; }`
          : `.ac-run-${def.slug} { ${base} ${animation}; }`;
      return `@keyframes ac-${def.slug} { ${def.frames
        .map(([offset, declarations]) => `${offset} { ${declarations}; }`)
        .join(" ")} }\n${rule}`;
    })
    .join("\n");
}

/** Compact label used in the gallery, e.g. "620ms · Snappy". */
export function animationBadge(def: AnimationDef): string {
  return `${def.duration}ms · ${easingLabel(def.easing)}`;
}

export function previewClassName(def: AnimationDef): string {
  return def.trigger === "hover" ? `ac-hover-${def.slug}` : `ac-run-${def.slug}`;
}
