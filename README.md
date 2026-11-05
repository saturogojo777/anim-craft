# AnimCraft

A modern toolkit of **copy-paste CSS & Tailwind animations**, **micro-interactions**, and **live design generators** — built as a single, statically-rendered Next.js app and ready to deploy on Vercel.

> Motion, crafted for the web.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What's inside

**Animation library — `/animations`**
- 40 hand-written keyframe animations across 7 categories: entrances, exits, emphasis, micro-interactions, loaders, backgrounds, and text effects.
- Search + category filters, live previews, per-card replay, and a global playback panel (duration, delay, easing, loop).
- Every card copies as a **complete CSS class**, a **Tailwind arbitrary utility**, or **HTML markup** — timed exactly like the preview.
- Generated snippets include a `@media (prefers-reduced-motion: reduce)` guard.

**Generators — `/tools`**
| Tool | What it does |
| --- | --- |
| [Easing editor](/tools/easing) | Draggable cubic-bézier curve, comparison lanes, CSS / Tailwind / JS output |
| [Gradient studio](/tools/gradient) | Multi-stop linear, radial, and conic gradients with live surface previews |
| [Shadow lab](/tools/shadow) | Layered `box-shadow` stacks with per-layer sliders and presets |
| [Glass forge](/tools/glass) | Glassmorphism with tint, blur, saturation, border and fallback CSS |

**Site quality**
- Dark + light themes with no flash of the wrong theme (inline pre-hydration script).
- Fully static output: no runtime data fetching, no API routes, no dependencies beyond React.
- Typed animation data (`lib/animations.ts`) that drives previews, CSS output, and SEO in one place.
- Accessible controls (labelled inputs, visible focus rings, keyboard support), skip link, `sitemap.xml`, `robots.txt`, web manifest, and a generated Open Graph image.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack, static prerendering)
- **React 19**
- **Tailwind CSS 4** (CSS-first `@theme` tokens, custom `@utility` layer)
- **TypeScript** in strict mode

There is no UI kit, icon package, or animation library. Icons are inline SVG; animations are plain CSS.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (type-checks + prerenders every route)
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20.9+ is recommended (Next.js 16 requirement).

---

## Deploy to Vercel

The repository is a zero-config Vercel project — no `vercel.json` and no environment variables are required.

### Option 1 — Dashboard

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Framework preset **Next.js** is detected automatically. Keep the default build command (`next build`) and output settings.
4. Click **Deploy**.

### Option 2 — CLI

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Optional: set the canonical URL

`lib/site.ts` uses `NEXT_PUBLIC_SITE_URL` when present, and otherwise falls back to `https://anim-craft.vercel.app`. Set it to your production domain so canonical URLs, `sitemap.xml`, and Open Graph metadata point at the right host:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# value: https://your-domain.com
```

---

## Project structure

```
app/
  layout.tsx              # metadata, theme bootstrap, header/footer shell
  page.tsx                # marketing home page
  globals.css             # design tokens, base layer, utilities, motion
  animations/page.tsx     # library
  tools/                  # tools index + 4 generator pages
  icon.svg                # favicon (auto-wired by Next.js)
  opengraph-image.tsx     # generated social card
  manifest.ts, robots.ts, sitemap.ts
components/
  animation-explorer.tsx  # search, filters, playback controls (client)
  animation-card.tsx      # preview + code drawer + copy actions (client)
  animation-preview.tsx   # the eight preview shapes
  animation-styles.tsx    # inlines all preview keyframes once
  tools/*                 # easing editor, gradient studio, shadow lab, glass forge
  ui.tsx                  # Range, Select, Segmented, Toggle, Panel, TextInput
lib/
  animations.ts           # typed dataset + CSS/Tailwind/HTML generators
  easings.ts, color.ts    # easing presets & parsing, colour maths
  highlight.ts            # tiny zero-dependency syntax highlighter
  site.ts                 # site metadata and tool registry
```

---

## Adding an animation

Everything is data-driven, so a new animation needs no component changes:

```ts
// lib/animations.ts
{
  slug: "slide-up-fade",
  name: "Slide up fade",
  category: "entrance",
  summary: "A short rise with a fade for inline content.",
  frames: [
    ["from", "opacity: 0; transform: translate3d(0, 14px, 0)"],
    ["to", "opacity: 1; transform: translate3d(0, 0, 0)"],
  ],
  preview: "box",          // box | card | text | ring | dot | ball | bar | skeleton | orb
  duration: 600,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  tags: ["content"],
}
```

The gallery, the injected preview stylesheet, the copyable snippets, and the counts on the home page all pick it up automatically.

---

## Accessibility notes

- All motion snippets ship with a `prefers-reduced-motion` override.
- Decorative page animation is disabled automatically when reduced motion is requested; library previews stay available because they are the product.
- Controls use native inputs with labels, and focus is always visible.
- Copy actions fall back to `document.execCommand` when the Clipboard API is unavailable.

---

## License

MIT © [saturogojo777](https://github.com/saturogojo777)
