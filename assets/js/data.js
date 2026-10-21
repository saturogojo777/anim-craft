/* ============================================================================
 * AnimCraft — data.js
 * ----------------------------------------------------------------------------
 * Every animation in the gallery lives here: metadata, preview markup, vanilla
 * CSS and Tailwind markup. `app.js` injects each item's `css` into a single
 * <style> tag, so the live preview and the code you copy can never drift apart.
 *
 * ADDING AN ANIMATION
 *   1. Pick a unique class prefix (the gallery shares one document).
 *   2. Append an object to ANIMATIONS with html / css / tw fields.
 *   3. Prefix every selector in `css` so it cannot leak into the site chrome.
 *   4. Use `motion: "hover"` for pointer-driven effects so touch users get a
 *      play button on the card. Use "loop" for self-running previews and
 *      "interactive" for controls that respond to real input.
 * ========================================================================== */

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "buttons", label: "Buttons" },
  { id: "loaders", label: "Loaders" },
  { id: "cards", label: "Cards" },
  { id: "hover", label: "Hover Effects" },
  { id: "text", label: "Text" },
  { id: "inputs", label: "Inputs & Controls" },
  { id: "notifications", label: "Notifications" },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

const ANIMATIONS = [
  /* ─────────────────────────────── BUTTONS ─────────────────────────────── */
  {
    id: "aurora-glow",
    title: "Aurora Glow",
    category: "buttons",
    description:
      "A soft, breathing gradient halo behind a button. The glow intensifies on hover without ever distracting from the label.",
    tags: ["glow", "gradient", "cta", "pulse"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<span class="acg-wrap">
  <button class="acg-btn" type="button">Aurora Glow</button>
</span>`,
    css: `/* Wrapper keeps the blurred halo behind the button itself. */
.acg-wrap {
  position: relative;
  display: inline-grid;
  isolation: isolate;
}

.acg-wrap::before {
  content: "";
  position: absolute;
  inset: -6px;
  z-index: -1;
  border-radius: 18px;
  background: linear-gradient(120deg, #8b5cf6, #22d3ee, #f472b6);
  filter: blur(18px);
  opacity: 0.55;
  animation: acg-pulse 3.2s ease-in-out infinite;
  transition: opacity 0.3s ease;
}

.acg-btn {
  position: relative;
  padding: 15px 32px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #b49bff, #22d3ee);
  color: #08080f;
  font: 600 15px/1 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: 0 14px 30px -16px rgba(34, 211, 238, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.acg-wrap:hover::before {
  opacity: 0.95;
}

.acg-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -18px rgba(139, 92, 246, 0.95);
}

.acg-btn:active {
  transform: translateY(0) scale(0.98);
}

@keyframes acg-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.98); }
  50%      { opacity: 0.9;  transform: scale(1.05); }
}`,
    tw: `<span class="relative inline-grid isolate">
  <span class="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-400 opacity-60 blur-xl animate-[acg-pulse_3.2s_ease-in-out_infinite]"></span>
  <button class="relative rounded-xl bg-gradient-to-br from-violet-300 to-cyan-400 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5">
    Aurora Glow
  </button>
</span>`,
    twExtra: `@keyframes acg-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.98); }
  50%      { opacity: 0.9;  transform: scale(1.05); }
}`,
  },
  {
    id: "sheen-sweep",
    title: "Sheen Sweep",
    category: "buttons",
    description:
      "A single highlight races across the surface on hover. Understated, expensive-looking, and perfect for primary actions.",
    tags: ["shimmer", "shine", "hover", "cta"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<button class="ash-btn" type="button">
  <span>Get started</span>
  <span class="ash-arrow" aria-hidden="true">→</span>
</button>`,
    css: `.ash-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  background: #12121d;
  color: #f4f4fa;
  font: 500 14px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s ease, color 0.3s ease;
}

/* The highlight itself: a skewed white slash parked off-canvas. */
.ash-btn::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 45%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.38), transparent);
  transform: skewX(-18deg);
  transition: left 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.ash-btn:hover {
  border-color: rgba(180, 155, 255, 0.6);
  color: #fff;
}

.ash-btn:hover::after {
  left: 120%;
}

.ash-arrow {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.ash-btn:hover .ash-arrow {
  transform: translateX(4px);
}

@media (prefers-reduced-motion: reduce) {
  .ash-btn::after { display: none; }
}`,
    tw: `<button class="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/15 bg-slate-900 px-6 py-3.5 text-sm font-medium text-slate-100 transition hover:border-violet-400/60">
  Get started
  <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
  <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-[left] duration-700 ease-out group-hover:left-[120%]"></span>
</button>`,
    twExtra: "",
  },
  {
    id: "slide-fill",
    title: "Slide Fill",
    category: "buttons",
    description:
      "An outlined button whose gradient fill rises from the bottom on hover, flipping the text colour in the same beat.",
    tags: ["fill", "gradient", "outline", "hover"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<button class="afb-btn" type="button">
  <span>Book a demo</span>
  <span class="afb-dot" aria-hidden="true"></span>
</button>`,
    css: `.afb-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  border: 1px solid rgba(180, 155, 255, 0.45);
  border-radius: 12px;
  background: transparent;
  color: #d9d0ff;
  font: 600 14px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.35s ease, border-color 0.35s ease;
}

.afb-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #8b5cf6, #22d3ee);
  transform: translateY(101%);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.afb-btn > span {
  position: relative;
  z-index: 1;
}

.afb-btn:hover {
  color: #08080f;
  border-color: transparent;
}

.afb-btn:hover::before {
  transform: translateY(0);
}

.afb-dot {
  width: 5px;
  height: 5px;
  margin-left: 9px;
  border-radius: 50%;
  background: currentColor;
}`,
    tw: `<button class="group relative inline-flex items-center overflow-hidden rounded-xl border border-violet-400/45 px-7 py-3.5 text-sm font-semibold text-violet-200 transition-colors duration-300 hover:border-transparent hover:text-slate-950">
  <span class="relative z-10">Book a demo</span>
  <span aria-hidden="true" class="relative z-10 ml-2 h-1 w-1 rounded-full bg-current"></span>
  <span aria-hidden="true" class="absolute inset-0 translate-y-full bg-gradient-to-br from-violet-500 to-cyan-400 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"></span>
</button>`,
    twExtra: "",
  },
  {
    id: "border-beam",
    title: "Border Beam",
    category: "buttons",
    description:
      "A conic-gradient light beam orbits inside the border of a button. Uses a registered CSS angle property for buttery rotation.",
    tags: ["border", "beam", "conic", "premium"],
    difficulty: "Intermediate",
    motion: "loop",
    html: `<span class="abb-wrap">
  <button class="abb-btn" type="button">Start building</button>
</span>`,
    css: `/* Typed custom properties make angle animation possible. */
@property --abb-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.abb-wrap {
  position: relative;
  display: inline-grid;
  padding: 1.5px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.09);
  overflow: hidden;
  isolation: isolate;
}

.abb-wrap::before {
  content: "";
  position: absolute;
  inset: -150%;
  z-index: -1;
  background: conic-gradient(
    from var(--abb-angle),
    transparent 0deg 250deg,
    #22d3ee 300deg,
    #b49bff 330deg,
    transparent 360deg
  );
  animation: abb-spin 3.4s linear infinite;
}

.abb-btn {
  position: relative;
  padding: 14px 30px;
  border: 0;
  border-radius: 13.5px;
  background: #0c0c14;
  color: #f4f4fa;
  font: 550 14px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: background 0.3s ease;
}

.abb-btn:hover {
  background: #161624;
}

@keyframes abb-spin {
  to { --abb-angle: 360deg; }
}

/* Browsers without @property still show a static gradient border. */
@supports not (background: conic-gradient(red, blue)) {
  .abb-wrap::before {
    background: linear-gradient(120deg, #b49bff, #22d3ee);
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Static gradient border for people who prefer less motion. */
  .abb-wrap::before { animation: none; }
}`,
    tw: `<span class="relative inline-grid overflow-hidden rounded-[15px] bg-white/10 p-[1.5px] isolate">
  <span aria-hidden="true" class="absolute -inset-[150%] -z-10 animate-[spin_3.4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg_250deg,#22d3ee_300deg,#b49bff_330deg,transparent_360deg)]"></span>
  <button class="relative rounded-[13.5px] bg-[#0c0c14] px-[30px] py-3.5 text-sm font-medium text-slate-100 transition-colors hover:bg-[#161624]">
    Start building
  </button>
</span>`,
    twExtra: `/* For a smooth, non-linear beam, register the angle property
   and animate it instead of using Tailwind's spin utility:
   @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
   @keyframes beam { to { --angle: 360deg; } } */`,
  },
  {
    id: "arrow-button",
    title: "Arrow Swap",
    category: "buttons",
    description:
      "The arrow exits stage left while a twin enters from the right. A tiny detail that makes any link feel responsive.",
    tags: ["arrow", "icon", "micro-interaction", "pill"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<button class="aar-btn" type="button">
  <span>Read the docs</span>
  <span class="aar-icon" aria-hidden="true"><span>→</span></span>
</button>`,
    css: `.aar-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 8px 8px 8px 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: #101018;
  color: #f4f4fa;
  font: 550 14px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.aar-btn:hover {
  border-color: rgba(139, 92, 246, 0.5);
  background: #14141f;
}

.aar-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b49bff, #22d3ee);
  color: #08080f;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

/* The visible arrow and its off-screen twin share the same box. */
.aar-icon > span,
.aar-icon::after {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.aar-icon::after {
  content: "→";
  transform: translateX(-150%);
}

.aar-btn:hover .aar-icon {
  transform: rotate(-8deg) scale(1.06);
}

.aar-btn:hover .aar-icon > span {
  transform: translateX(150%);
}

.aar-btn:hover .aar-icon::after {
  transform: translateX(0);
}`,
    tw: `<button class="group inline-flex items-center gap-3.5 rounded-full border border-white/15 bg-[#101018] py-2 pl-5 pr-2 text-sm font-medium text-slate-100 transition hover:border-violet-400/50">
  Read the docs
  <span aria-hidden="true" class="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-300 to-cyan-400 text-base font-bold text-slate-950 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
    <span class="transition-transform duration-300 group-hover:translate-x-10">→</span>
    <span class="absolute -translate-x-10 transition-transform duration-300 group-hover:translate-x-0">→</span>
  </span>
</button>`,
    twExtra: "",
  },

  /* ─────────────────────────────── LOADERS ─────────────────────────────── */
  {
    id: "orbit-dots",
    title: "Orbit Dots",
    category: "loaders",
    description:
      "Three glowing satellites orbit a shared centre in a single rotation. Smooth, weightless, and ideal for short waits.",
    tags: ["spinner", "dots", "orbit", "loading"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="aod-loader" role="status" aria-label="Loading">
  <span></span><span></span><span></span>
</div>`,
    css: `.aod-loader {
  position: relative;
  width: 56px;
  height: 56px;
  animation: aod-rotate 1.8s linear infinite;
}

.aod-loader span {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.aod-loader span:nth-child(1) {
  top: 0;
  left: 50%;
  margin-left: -5px;
  background: #b49bff;
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.9);
}

.aod-loader span:nth-child(2) {
  bottom: 5px;
  left: 5px;
  background: #22d3ee;
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.8);
  opacity: 0.9;
}

.aod-loader span:nth-child(3) {
  bottom: 5px;
  right: 5px;
  background: #f472b6;
  box-shadow: 0 0 16px rgba(244, 114, 182, 0.8);
  opacity: 0.8;
}

@keyframes aod-rotate {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .aod-loader { animation-duration: 4s; }
}`,
    tw: `<div role="status" aria-label="Loading" class="relative h-14 w-14 animate-[spin_1.8s_linear_infinite]">
  <span class="absolute left-1/2 top-0 -ml-[5px] h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_16px_rgba(139,92,246,.9)]"></span>
  <span class="absolute bottom-1 left-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,.8)]"></span>
  <span class="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_16px_rgba(244,114,182,.8)]"></span>
</div>`,
    twExtra: "",
  },
  {
    id: "typing-dots",
    title: "Typing Bubbles",
    category: "loaders",
    description:
      "The familiar chat typing indicator, rebuilt with staggered bounces and a single bubble. Perfect for assistant UIs.",
    tags: ["typing", "chat", "bubble", "dots"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="atd-bubble" role="status" aria-label="Assistant is typing">
  <span></span><span></span><span></span>
</div>`,
    css: `.atd-bubble {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 15px 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px 16px 16px 5px;
  background: #151522;
  box-shadow: 0 14px 30px -22px #000;
}

.atd-bubble span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b49bff;
  animation: atd-bounce 1.2s ease-in-out infinite;
}

.atd-bubble span:nth-child(2) {
  background: #8f9bff;
  animation-delay: 0.15s;
}

.atd-bubble span:nth-child(3) {
  background: #22d3ee;
  animation-delay: 0.3s;
}

@keyframes atd-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
  30%           { transform: translateY(-6px); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .atd-bubble span { animation: none; opacity: 0.8; }
}`,
    tw: `<div role="status" aria-label="Assistant is typing" class="flex items-center gap-1.5 rounded-2xl rounded-bl-[5px] border border-white/10 bg-[#151522] px-4 py-3.5">
  <span class="h-[7px] w-[7px] rounded-full bg-violet-300 animate-[bounce_1.2s_ease-in-out_infinite]"></span>
  <span class="h-[7px] w-[7px] rounded-full bg-indigo-300 animate-[bounce_1.2s_ease-in-out_.15s_infinite]"></span>
  <span class="h-[7px] w-[7px] rounded-full bg-cyan-400 animate-[bounce_1.2s_ease-in-out_.3s_infinite]"></span>
</div>`,
    twExtra: "",
  },
  {
    id: "gradient-ring",
    title: "Gradient Ring",
    category: "loaders",
    description:
      "A conic gradient clipped into a thin ring. One element, no SVG, no extra markup — just a clean infinite spinner.",
    tags: ["spinner", "ring", "gradient", "loading"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="agr-ring" role="status" aria-label="Loading"></div>`,
    css: `.agr-ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0% 18%,
    #8b5cf6 42%,
    #22d3ee 72%,
    #f472b6 100%
  );
  /* Clip the middle out to leave a 6px ring. */
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0);
  animation: agr-spin 0.9s linear infinite;
}

@keyframes agr-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  /* Keep a visible ring, drop the spin. */
  .agr-ring { animation-duration: 4s; }
}`,
    tw: `<div role="status" aria-label="Loading" class="h-14 w-14 animate-[spin_.9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_18%,#8b5cf6_42%,#22d3ee_72%,#f472b6)] [mask:radial-gradient(farthest-side,transparent_calc(100%-6px),#000_0)]"></div>`,
    twExtra: "",
  },
  {
    id: "equalizer-bars",
    title: "Equalizer Bars",
    category: "loaders",
    description:
      "Five bars bounce on offset timings to create a rhythmic audio-loader that feels alive but never frantic.",
    tags: ["audio", "bars", "equalizer", "wave"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="aeq-bars" role="status" aria-label="Loading">
  <span></span><span></span><span></span><span></span><span></span>
</div>`,
    css: `.aeq-bars {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 46px;
}

.aeq-bars span {
  width: 6px;
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(180deg, #b49bff, #22d3ee);
  transform-origin: center;
  animation: aeq-bounce 1s ease-in-out infinite;
}

.aeq-bars span:nth-child(2) { animation-delay: 0.12s; }
.aeq-bars span:nth-child(3) { animation-delay: 0.24s; }
.aeq-bars span:nth-child(4) { animation-delay: 0.36s; }
.aeq-bars span:nth-child(5) { animation-delay: 0.48s; }

@keyframes aeq-bounce {
  0%, 100% { transform: scaleY(0.22); opacity: 0.55; }
  50%      { transform: scaleY(1);    opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .aeq-bars span { animation: none; transform: scaleY(0.55); opacity: 0.8; }
}`,
    tw: `<div role="status" aria-label="Loading" class="flex h-11 items-center gap-1.5">
  <span class="h-full w-1.5 origin-center animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400"></span>
  <span class="h-full w-1.5 origin-center animate-[bounce_1s_ease-in-out_.12s_infinite] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400"></span>
  <span class="h-full w-1.5 origin-center animate-[bounce_1s_ease-in-out_.24s_infinite] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400"></span>
  <span class="h-full w-1.5 origin-center animate-[bounce_1s_ease-in-out_.36s_infinite] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400"></span>
  <span class="h-full w-1.5 origin-center animate-[bounce_1s_ease-in-out_.48s_infinite] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400"></span>
</div>`,
    twExtra: `/* Tailwind's bounce keyframe scales Y from 0 to 1; for an equalizer
   effect add your own: */
@keyframes aeq-bounce {
  0%, 100% { transform: scaleY(0.22); opacity: 0.55; }
  50%      { transform: scaleY(1);    opacity: 1; }
}`,
  },
  {
    id: "skeleton-shimmer",
    title: "Skeleton Shimmer",
    category: "loaders",
    description:
      "A content skeleton with a travelling highlight. Keeps layout stable while data loads instead of spinning aimlessly.",
    tags: ["skeleton", "shimmer", "placeholder", "loading"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="ask-card" role="status" aria-label="Loading content">
  <div class="ask-avatar"></div>
  <div class="ask-lines">
    <span></span><span></span><span></span>
  </div>
  <div class="ask-media"></div>
</div>`,
    css: `.ask-card {
  display: grid;
  gap: 12px;
  width: min(250px, 100%);
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  background: #101019;
}

.ask-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
}

.ask-lines {
  display: grid;
  gap: 7px;
}

.ask-lines span {
  height: 8px;
  border-radius: 99px;
}

.ask-lines span:nth-child(2) { width: 80%; }
.ask-lines span:nth-child(3) { width: 55%; }

.ask-media {
  height: 74px;
  border-radius: 10px;
}

/* One shared shimmer for every placeholder shape. */
.ask-avatar,
.ask-lines span,
.ask-media {
  background: linear-gradient(100deg, #1b1b2a 20%, #2c2c42 42%, #1b1b2a 64%);
  background-size: 220% 100%;
  animation: ask-shimmer 1.6s linear infinite;
}

@keyframes ask-shimmer {
  to { background-position: -120% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ask-avatar,
  .ask-lines span,
  .ask-media { animation: none; }
}`,
    tw: `<div role="status" aria-label="Loading content" class="grid w-[250px] max-w-full gap-3 rounded-2xl border border-white/10 bg-[#101019] p-4">
  <div class="h-10 w-10 animate-pulse rounded-full bg-white/10"></div>
  <div class="grid gap-2">
    <div class="h-2 animate-pulse rounded-full bg-white/10"></div>
    <div class="h-2 w-4/5 animate-pulse rounded-full bg-white/10"></div>
    <div class="h-2 w-1/2 animate-pulse rounded-full bg-white/10"></div>
  </div>
  <div class="h-[74px] animate-pulse rounded-xl bg-white/10"></div>
</div>`,
    twExtra: `/* For a directional shimmer, replace animate-pulse with an
   arbitrary gradient animation: */
@keyframes shimmer {
  to { background-position: -120% 0; }
}
/* class="bg-[linear-gradient(100deg,#1b1b2a_20%,#2c2c42_42%,#1b1b2a_64%)]
          bg-[length:220%_100%] animate-[shimmer_1.6s_linear_infinite]" */`,
  },
  {
    id: "blob-morph",
    title: "Morph Blob",
    category: "loaders",
    description:
      "A gradient blob that slowly changes its border radius while spinning. Organic, playful, and completely CSS-only.",
    tags: ["blob", "morph", "gradient", "organic"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="amb-blob" role="status" aria-label="Loading"></div>`,
    css: `.amb-blob {
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, #b49bff, #22d3ee);
  box-shadow: 0 0 36px -8px rgba(139, 92, 246, 0.85);
  animation:
    amb-morph 3s ease-in-out infinite,
    amb-spin 6s linear infinite;
}

@keyframes amb-morph {
  0%, 100% { border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
  50%      { border-radius: 40% 60% 35% 65% / 45% 60% 40% 55%; }
}

@keyframes amb-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .amb-blob { animation: none; border-radius: 42%; }
}`,
    tw: `<div role="status" aria-label="Loading" class="h-14 w-14 animate-[morph_3s_ease-in-out_infinite,spin_6s_linear_infinite] bg-gradient-to-br from-violet-300 to-cyan-400 shadow-[0_0_36px_-8px_rgba(139,92,246,.85)]"></div>`,
    twExtra: `@keyframes morph {
  0%, 100% { border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
  50%      { border-radius: 40% 60% 35% 65% / 45% 60% 40% 55%; }
}`,
  },
  /* ──────────────────────────────── CARDS ──────────────────────────────── */
  {
    id: "spotlight-card",
    title: "Spotlight Card",
    category: "cards",
    description:
      "A cursor-tracking glow blooms inside the card on hover, with a gentle lift and border highlight to match.",
    tags: ["spotlight", "glow", "glass", "feature"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<article class="asc-card">
  <span class="asc-glow" aria-hidden="true"></span>
  <span class="asc-icon" aria-hidden="true">✦</span>
  <h3>Spotlight Card</h3>
  <p>Tracks the cursor with a soft radial glow.</p>
  <span class="asc-link">Explore →</span>
</article>`,
    css: `.asc-card {
  position: relative;
  width: min(260px, 100%);
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  background: #0f0f18;
  font-family: ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.asc-card:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.45);
  box-shadow: 0 22px 40px -30px rgba(139, 92, 246, 0.9);
}

.asc-glow {
  position: absolute;
  top: -90px;
  left: 50%;
  width: 190px;
  height: 190px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.55), transparent 65%);
  filter: blur(18px);
  opacity: 0.55;
  transition: opacity 0.35s ease;
}

.asc-card:hover .asc-glow {
  opacity: 1;
}

.asc-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.16);
  color: #c4b5fd;
  font-size: 15px;
}

.asc-card h3 {
  position: relative;
  margin-top: 14px;
  color: #f4f4fa;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.asc-card p {
  position: relative;
  margin-top: 6px;
  color: #9a9ab0;
  font-size: 12px;
  line-height: 1.55;
}

.asc-link {
  position: relative;
  display: inline-block;
  margin-top: 14px;
  color: #b49bff;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.02em;
}`,
    tw: `<article class="group relative w-[260px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f18] p-5 transition hover:-translate-y-1 hover:border-violet-500/45 hover:shadow-[0_22px_40px_-30px_rgba(139,92,246,.9)]">
  <span aria-hidden="true" class="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-500/40 blur-2xl transition-opacity duration-300 group-hover:bg-violet-500/60"></span>
  <span class="relative grid h-9 w-9 place-items-center rounded-xl border border-violet-500/35 bg-violet-500/15 text-violet-300">✦</span>
  <h3 class="relative mt-3.5 text-sm font-semibold text-slate-50">Spotlight Card</h3>
  <p class="relative mt-1.5 text-xs leading-relaxed text-slate-400">Tracks the cursor with a soft radial glow.</p>
  <span class="relative mt-3.5 inline-block font-mono text-[11px] text-violet-300">Explore →</span>
</article>`,
    twExtra: "",
  },
  {
    id: "tilt-card",
    title: "3D Tilt Card",
    category: "cards",
    description:
      "A perspective tilt with a moving light sheen. Swap the static angles for pointer coordinates to make it fully interactive.",
    tags: ["3d", "tilt", "perspective", "depth"],
    difficulty: "Intermediate",
    motion: "hover",
    html: `<article class="atc-card">
  <div class="atc-inner">
    <span class="atc-kicker">PRO</span>
    <h3>3D Tilt</h3>
    <p>Depth that follows the pointer.</p>
  </div>
</article>`,
    css: `.atc-card {
  width: min(240px, 100%);
  perspective: 700px;
}

.atc-inner {
  position: relative;
  padding: 24px 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: linear-gradient(160deg, #171728, #0e0e17 60%);
  box-shadow: 0 22px 40px -26px #000;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
  will-change: transform;
}

.atc-inner::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.12), transparent 45%);
  opacity: 0.6;
  pointer-events: none;
}

.atc-card:hover .atc-inner {
  transform: rotateX(12deg) rotateY(-14deg) translateZ(10px);
  box-shadow: -18px 26px 50px -28px #000;
}

.atc-kicker {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.15);
  color: #67e8f9;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.atc-inner h3 {
  margin-top: 12px;
  color: #f4f4fa;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.atc-inner p {
  margin-top: 5px;
  color: #9a9ab0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}`,
    tw: `<article class="group w-[240px] max-w-full [perspective:700px]">
  <div class="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#171728] to-[#0e0e17] p-6 shadow-2xl transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(12deg)_rotateY(-14deg)_translateZ(10px)]">
    <span class="inline-block rounded-full border border-cyan-400/35 bg-cyan-400/15 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-widest text-cyan-300">PRO</span>
    <h3 class="mt-3 text-base font-semibold text-slate-50">3D Tilt</h3>
    <p class="mt-1.5 text-xs leading-relaxed text-slate-400">Depth that follows the pointer.</p>
    <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"></span>
  </div>
</article>`,
    twExtra: "",
  },
  {
    id: "reveal-card",
    title: "Reveal Card",
    category: "cards",
    description:
      "The artwork zooms while a hidden caption rises into place. A cinematic hover pattern for editorial and portfolio cards.",
    tags: ["image", "zoom", "caption", "editorial"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<article class="arc-card">
  <div class="arc-art" aria-hidden="true"></div>
  <div class="arc-content">
    <span class="arc-tag">Case study</span>
    <h3>Neon District</h3>
    <p>A city rebuilt in light.</p>
  </div>
</article>`,
    css: `.arc-card {
  position: relative;
  width: min(260px, 100%);
  height: 178px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: #0b0b12;
  overflow: hidden;
  cursor: pointer;
}

/* Replace this gradient with any background-image. */
.arc-art {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 72% 18%, #22d3ee 0%, transparent 42%),
    radial-gradient(circle at 18% 82%, #8b5cf6 0%, transparent 46%),
    linear-gradient(140deg, #1b1b33, #0a0a12);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.arc-art::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(6, 6, 10, 0.94) 0%, rgba(6, 6, 10, 0.25) 58%, transparent);
}

.arc-card:hover .arc-art {
  transform: scale(1.08);
}

.arc-content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.arc-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #67e8f9;
}

.arc-content h3 {
  margin-top: 5px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.arc-content p {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11.5px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s;
}

.arc-card:hover .arc-content {
  transform: translateY(-4px);
}

.arc-card:hover .arc-content p {
  opacity: 1;
  transform: none;
}`,
    tw: `<article class="group relative h-44 w-[260px] max-w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_72%_18%,#22d3ee_0%,transparent_42%),radial-gradient(circle_at_18%_82%,#8b5cf6_0%,transparent_46%),linear-gradient(140deg,#1b1b33,#0a0a12)]">
  <div class="absolute inset-0 bg-gradient-to-t from-[#06060a]/95 via-[#06060a]/25 to-transparent"></div>
  <div class="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1">
    <span class="font-mono text-[9px] font-semibold uppercase tracking-widest text-cyan-300">Case study</span>
    <h3 class="mt-1 text-base font-semibold text-white">Neon District</h3>
    <p class="mt-0.5 text-xs text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">A city rebuilt in light.</p>
  </div>
</article>`,
    twExtra: "",
  },
  {
    id: "stacked-cards",
    title: "Stacked Deck",
    category: "cards",
    description:
      "Layered cards fan apart in sequence on hover, hinting at depth and hidden content. Built for feature previews.",
    tags: ["stack", "layers", "fan", "deck"],
    difficulty: "Intermediate",
    motion: "hover",
    html: `<article class="ast-stack">
  <div class="ast-card ast-card--back" aria-hidden="true"></div>
  <div class="ast-card ast-card--mid" aria-hidden="true"></div>
  <div class="ast-card ast-card--front">
    <span>Deck</span>
    <h3>Stacked layers</h3>
  </div>
</article>`,
    css: `.ast-stack {
  position: relative;
  display: grid;
  place-items: center;
  width: 210px;
  height: 156px;
}

.ast-card {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: #12121d;
}

.ast-card--back {
  transform: translateY(-10px) scale(0.86);
  background: #1a1a2a;
  opacity: 0.35;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
}

.ast-card--mid {
  transform: translateY(-5px) scale(0.93);
  background: #151522;
  opacity: 0.65;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
}

.ast-card--front {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  background: linear-gradient(150deg, #1b1b30, #0f0f18);
  box-shadow: 0 18px 34px -20px #000;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.ast-stack:hover .ast-card--back {
  transform: translateY(-28px) scale(0.88) rotate(-6deg);
  opacity: 0.5;
}

.ast-stack:hover .ast-card--mid {
  transform: translateY(-14px) scale(0.94) rotate(-2deg);
  opacity: 0.85;
}

.ast-stack:hover .ast-card--front {
  transform: rotate(2deg);
}

.ast-card--front span {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #67e8f9;
}

.ast-card--front h3 {
  margin-top: 4px;
  color: #f4f4fa;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}`,
    tw: `<article class="group relative grid h-[156px] w-[210px] max-w-full place-items-center">
  <div aria-hidden="true" class="absolute inset-0 -translate-y-2.5 scale-[.86] rounded-2xl border border-white/10 bg-[#1a1a2a] opacity-35 transition duration-500 group-hover:-translate-y-7 group-hover:-rotate-6 group-hover:opacity-50"></div>
  <div aria-hidden="true" class="absolute inset-0 -translate-y-[5px] scale-[.93] rounded-2xl border border-white/10 bg-[#151522] opacity-65 transition duration-500 group-hover:-translate-y-3.5 group-hover:-rotate-2 group-hover:opacity-85"></div>
  <div class="absolute inset-0 flex flex-col justify-end rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1b30] to-[#0f0f18] p-4 shadow-2xl transition-transform duration-500 group-hover:rotate-2">
    <span class="font-mono text-[9px] uppercase tracking-[.16em] text-cyan-300">Deck</span>
    <h3 class="mt-1 text-base font-semibold tracking-tight text-slate-50">Stacked layers</h3>
  </div>
</article>`,
    twExtra: "",
  },

  /* ───────────────────────────── HOVER EFFECTS ─────────────────────────── */
  {
    id: "underline-sweep",
    title: "Underline Sweep",
    category: "hover",
    description:
      "A gradient underline draws in from the right and retracts to the left, keeping navigation links feeling crisp.",
    tags: ["underline", "link", "navigation", "gradient"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<a class="aul-link" href="#">Explore the collection</a>`,
    css: `.aul-link {
  position: relative;
  display: inline-block;
  padding-bottom: 5px;
  color: #f4f4fa;
  font: 500 17px/1.4 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.aul-link::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #b49bff, #22d3ee);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.aul-link:hover {
  color: #fff;
}

.aul-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}`,
    tw: `<a href="#" class="group relative inline-block pb-1 text-[17px] font-medium tracking-tight text-slate-50">
  Explore the collection
  <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 bg-gradient-to-r from-violet-300 to-cyan-400 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
</a>`,
    twExtra: "",
  },
  {
    id: "gradient-text-hover",
    title: "Colour Bloom Text",
    category: "hover",
    description:
      "Muted type blooms into a multi-stop gradient when hovered, with the gradient sliding for extra life.",
    tags: ["gradient", "text", "bloom", "headline"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<span class="agt-text">Hover to glow</span>`,
    css: `.agt-text {
  font: 700 27px/1.2 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.03em;
  background: linear-gradient(90deg, #b49bff, #22d3ee, #f472b6, #b49bff);
  background-size: 300% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: default;
  /* Muted by default; the filter unlocks the colour on hover. */
  filter: saturate(0) opacity(0.55);
  transition: filter 0.5s ease, background-position 1s ease;
}

.agt-text:hover {
  filter: saturate(1) opacity(1);
  background-position: 100% 50%;
}`,
    tw: `<span class="cursor-default bg-gradient-to-r from-violet-300 via-cyan-400 to-pink-400 bg-[length:300%_100%] bg-clip-text text-[27px] font-bold tracking-tight text-transparent opacity-60 saturate-0 transition duration-500 hover:bg-right hover:opacity-100 hover:saturate-100">
  Hover to glow
</span>`,
    twExtra: "",
  },
  {
    id: "icon-lift",
    title: "Neon Icon Lift",
    category: "hover",
    description:
      "Icon buttons lift off the surface and swap to a gradient fill. Three colours included for a tactile social row.",
    tags: ["icons", "lift", "social", "glow"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<div class="ani-row">
  <button class="ani-btn" type="button" aria-label="Star">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.3-.9z"/></svg>
  </button>
  <button class="ani-btn" type="button" aria-label="Save">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-4.6-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.4-8 10-8 10Z"/></svg>
  </button>
  <button class="ani-btn" type="button" aria-label="Boost">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/></svg>
  </button>
</div>`,
    css: `.ani-row {
  display: flex;
  gap: 10px;
}

.ani-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: #12121d;
  color: #9a9ab0;
  cursor: pointer;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.ani-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ani-btn:hover {
  transform: translateY(-6px);
  border-color: transparent;
  color: #08080f;
  background: linear-gradient(135deg, #b49bff, #22d3ee);
  box-shadow: 0 14px 26px -14px rgba(139, 92, 246, 0.95);
}

.ani-btn:nth-child(2):hover {
  background: linear-gradient(135deg, #f472b6, #b49bff);
  box-shadow: 0 14px 26px -14px rgba(244, 114, 182, 0.9);
}

.ani-btn:nth-child(3):hover {
  background: linear-gradient(135deg, #22d3ee, #34d399);
  box-shadow: 0 14px 26px -14px rgba(34, 211, 238, 0.9);
}`,
    tw: `<div class="flex gap-2.5">
  <button type="button" aria-label="Star" class="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#12121d] text-slate-400 transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:bg-gradient-to-br hover:from-violet-300 hover:to-cyan-400 hover:text-slate-950 hover:shadow-[0_14px_26px_-14px_rgba(139,92,246,.95)]">
    <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]"><path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.3-.9z"/></svg>
  </button>
  <button type="button" aria-label="Save" class="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#12121d] text-slate-400 transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:bg-gradient-to-br hover:from-pink-400 hover:to-violet-300 hover:text-slate-950 hover:shadow-[0_14px_26px_-14px_rgba(244,114,182,.9)]">
    <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]"><path d="M12 20s-8-4.6-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.4-8 10-8 10Z"/></svg>
  </button>
  <button type="button" aria-label="Boost" class="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#12121d] text-slate-400 transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:bg-gradient-to-br hover:from-cyan-400 hover:to-emerald-400 hover:text-slate-950 hover:shadow-[0_14px_26px_-14px_rgba(34,211,238,.9)]">
    <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]"><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/></svg>
  </button>
</div>`,
    twExtra: "",
  },
  {
    id: "hover-tooltip",
    title: "Rising Tooltip",
    category: "hover",
    description:
      "A tooltip that fades and lifts into place, complete with a matching arrow. Pure CSS, no positioning library.",
    tags: ["tooltip", "popover", "hint", "arrow"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<div class="att-wrap">
  <button class="att-btn" type="button">Hover me</button>
  <span class="att-tip" role="tooltip">⌘ + K to search</span>
</div>`,
    css: `.att-wrap {
  position: relative;
  display: inline-grid;
  place-items: center;
}

.att-btn {
  padding: 12px 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: #12121d;
  color: #f4f4fa;
  font: 500 13px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: border-color 0.25s ease;
}

.att-btn:hover {
  border-color: rgba(180, 155, 255, 0.55);
}

.att-tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  padding: 7px 10px;
  border-radius: 8px;
  background: #b49bff;
  color: #08080f;
  font: 600 10.5px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 6px);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.att-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #b49bff;
}

.att-wrap:hover .att-tip {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* Keyboard users get the same affordance. */
.att-btn:focus-visible + .att-tip {
  opacity: 1;
  transform: translate(-50%, 0);
}`,
    tw: `<div class="group relative inline-grid place-items-center">
  <button type="button" class="rounded-lg border border-white/15 bg-[#12121d] px-5 py-3 text-[13px] font-medium text-slate-100 transition hover:border-violet-300/55">
    Hover me
  </button>
  <span role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-1.5 whitespace-nowrap rounded-lg bg-violet-300 px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-slate-950 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
    ⌘ + K to search
    <span aria-hidden="true" class="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-violet-300"></span>
  </span>
</div>`,
    twExtra: "",
  },
  {
    id: "copy-morph",
    title: "Copy Morph",
    category: "hover",
    description:
      "The clipboard icon slides out, a check slides in, and the label swaps in the same motion. Feedback without a layout shift.",
    tags: ["copy", "check", "micro-interaction", "swap"],
    difficulty: "Intermediate",
    motion: "hover",
    html: `<button class="acb-btn" type="button">
  <span class="acb-icon" aria-hidden="true">
    <svg class="acb-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9"/></svg>
    <svg class="acb-check" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></svg>
  </span>
  <span class="acb-label">
    <span>Copy snippet</span>
    <span>Copied!</span>
  </span>
</button>`,
    css: `.acb-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 44px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 11px;
  background: #12121d;
  color: #f4f4fa;
  font: 600 13px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.35s ease, color 0.35s ease,
    border-color 0.35s ease, transform 0.2s ease;
}

.acb-btn:hover {
  background: rgba(52, 211, 153, 0.14);
  border-color: rgba(52, 211, 153, 0.45);
  color: #6ee7b7;
  transform: translateY(-1px);
}

.acb-icon {
  position: relative;
  width: 16px;
  height: 16px;
  flex: none;
}

.acb-icon svg {
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}

.acb-check {
  opacity: 0;
  transform: translateY(140%);
}

.acb-btn:hover .acb-copy {
  opacity: 0;
  transform: translateY(-140%);
}

.acb-btn:hover .acb-check {
  opacity: 1;
  transform: none;
}

/* Two stacked labels clipped by the wrapper height. */
.acb-label {
  position: relative;
  display: grid;
  align-items: center;
  height: 16px;
  overflow: hidden;
}

.acb-label span {
  grid-area: 1 / 1;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}

.acb-label span:last-child {
  opacity: 0;
  transform: translateY(120%);
}

.acb-btn:hover .acb-label span:first-child {
  opacity: 0;
  transform: translateY(-120%);
}

.acb-btn:hover .acb-label span:last-child {
  opacity: 1;
  transform: none;
}`,
    tw: `<button type="button" class="group inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl border border-white/15 bg-[#12121d] px-4 text-[13px] font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/45 hover:bg-emerald-400/15 hover:text-emerald-300">
  <span aria-hidden="true" class="relative h-4 w-4">
    <svg class="absolute inset-0 h-4 w-4 fill-none stroke-current stroke-[1.8] transition-transform duration-300 group-hover:-translate-y-[140%] group-hover:opacity-0" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9"/></svg>
    <svg class="absolute inset-0 h-4 w-4 translate-y-[140%] fill-none stroke-current stroke-[1.8] opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></svg>
  </span>
  <span class="relative grid h-4 items-center overflow-hidden">
    <span class="col-start-1 row-start-1 transition-transform duration-300 group-hover:-translate-y-full group-hover:opacity-0">Copy snippet</span>
    <span class="col-start-1 row-start-1 translate-y-full opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">Copied!</span>
  </span>
</button>`,
    twExtra: "",
  },
  /* ──────────────────────────────── TEXT ───────────────────────────────── */
  {
    id: "shimmer-text",
    title: "Shimmer Text",
    category: "text",
    description:
      "A highlight endlessly travels through clipped gradient text. Great for hero headlines that need motion without noise.",
    tags: ["shimmer", "gradient", "headline", "shine"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<span class="asm-text">Crafted with motion</span>`,
    css: `.asm-text {
  font: 700 26px/1.25 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.03em;
  background: linear-gradient(
    100deg,
    #6b6b83 20%,
    #f4f4fa 38%,
    #b49bff 50%,
    #6b6b83 66%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: asm-shimmer 2.8s linear infinite;
}

@keyframes asm-shimmer {
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .asm-text { animation: none; background-position: 40% 0; }
}`,
    tw: `<span class="animate-[shimmer_2.8s_linear_infinite] bg-[linear-gradient(100deg,#6b6b83_20%,#f4f4fa_38%,#b49bff_50%,#6b6b83_66%)] bg-[length:200%_100%] bg-clip-text text-[26px] font-bold tracking-tight text-transparent">
  Crafted with motion
</span>`,
    twExtra: `@keyframes shimmer {
  to { background-position: -200% 0; }
}`,
  },
  {
    id: "typewriter",
    title: "Typewriter",
    category: "text",
    description:
      "Text types itself out behind a blinking caret, then resets. Pure CSS steps() — no JavaScript timer in sight.",
    tags: ["typewriter", "caret", "steps", "terminal"],
    difficulty: "Intermediate",
    motion: "loop",
    html: `<div class="aty-wrap">
  <span class="aty-text">Ship beautiful UI.</span>
</div>`,
    css: `.aty-wrap {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: #0d0d16;
}

.aty-text {
  overflow: hidden;
  width: 0;
  padding-right: 2px;
  border-right: 2px solid #b49bff;
  color: #e3e3f0;
  font: 500 15px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
  /* 18 characters in the string above. */
  animation:
    aty-type 4.4s steps(18) infinite,
    aty-caret 0.8s step-end infinite;
}

@keyframes aty-type {
  0%        { width: 0; }
  45%, 80%  { width: 18ch; }
  100%      { width: 0; }
}

@keyframes aty-caret {
  50% { border-color: transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .aty-text { width: 18ch; animation: none; border-color: transparent; }
}`,
    tw: `<div class="flex items-center rounded-lg border border-white/10 bg-[#0d0d16] px-4 py-3.5">
  <span class="w-0 animate-[typing_4.4s_steps(18)_infinite,caret_.8s_step-end_infinite] overflow-hidden whitespace-nowrap border-r-2 border-violet-300 pr-0.5 font-mono text-[15px] text-slate-200">
    Ship beautiful UI.
  </span>
</div>`,
    twExtra: `@keyframes typing {
  0%       { width: 0; }
  45%, 80% { width: 18ch; }
  100%     { width: 0; }
}
@keyframes caret {
  50% { border-color: transparent; }
}`,
  },
  {
    id: "letter-rise",
    title: "Letter Rise",
    category: "text",
    description:
      "Each letter lifts on its own delay, creating a wave that rolls through the word. Hover it on the card or in the modal.",
    tags: ["letters", "stagger", "wave", "headline"],
    difficulty: "Beginner",
    motion: "hover",
    html: `<h3 class="alr-text">
  <span>A</span><span>N</span><span>I</span><span>M</span><span>C</span><span>R</span><span>A</span><span>F</span><span>T</span>
</h3>`,
    css: `.alr-text {
  display: flex;
  gap: 1px;
  font: 800 28px/1.1 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.02em;
  color: #f4f4fa;
  cursor: default;
}

.alr-text span {
  display: inline-block;
  transform-origin: bottom center;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.35s ease;
}

.alr-text:hover span {
  transform: translateY(-7px);
  color: #b49bff;
}

/* Stagger the wave letter by letter. */
.alr-text span:nth-child(2) { transition-delay: 0.04s; }
.alr-text span:nth-child(3) { transition-delay: 0.08s; }
.alr-text span:nth-child(4) { transition-delay: 0.12s; }
.alr-text span:nth-child(5) { transition-delay: 0.16s; }
.alr-text span:nth-child(6) { transition-delay: 0.2s; }
.alr-text span:nth-child(7) { transition-delay: 0.24s; }
.alr-text span:nth-child(8) { transition-delay: 0.28s; }
.alr-text span:nth-child(9) { transition-delay: 0.32s; }`,
    tw: `<h3 class="flex cursor-default gap-px text-[28px] font-extrabold tracking-tight text-slate-50">
  <span class="inline-block origin-bottom transition duration-300 hover:-translate-y-2 hover:text-violet-300">A</span>
  <span class="inline-block origin-bottom transition delay-[40ms] duration-300 hover:-translate-y-2 hover:text-violet-300">N</span>
  <span class="inline-block origin-bottom transition delay-[80ms] duration-300 hover:-translate-y-2 hover:text-violet-300">I</span>
  <span class="inline-block origin-bottom transition delay-[120ms] duration-300 hover:-translate-y-2 hover:text-violet-300">M</span>
  <span class="inline-block origin-bottom transition delay-[160ms] duration-300 hover:-translate-y-2 hover:text-violet-300">C</span>
  <span class="inline-block origin-bottom transition delay-[200ms] duration-300 hover:-translate-y-2 hover:text-violet-300">R</span>
  <span class="inline-block origin-bottom transition delay-[240ms] duration-300 hover:-translate-y-2 hover:text-violet-300">A</span>
  <span class="inline-block origin-bottom transition delay-[280ms] duration-300 hover:-translate-y-2 hover:text-violet-300">F</span>
  <span class="inline-block origin-bottom transition delay-[320ms] duration-300 hover:-translate-y-2 hover:text-violet-300">T</span>
</h3>`,
    twExtra: "",
  },
  {
    id: "glitch-text",
    title: "Chromatic Glitch",
    category: "text",
    description:
      "Clipped pink and cyan copies jitter over the base word. Loud on purpose, but only for a heartbeat at a time.",
    tags: ["glitch", "chromatic", "cyberpunk", "jitter"],
    difficulty: "Intermediate",
    motion: "loop",
    html: `<div class="agl-text" data-text="GLITCH">GLITCH</div>`,
    css: `.agl-text {
  position: relative;
  /* rgb() rather than hex keeps this shared rule out of the site's highlighter
     regexes; swap it for #f4f4fa in your own project if you prefer. */
  color: rgb(244 244 250);
  font: 800 30px/1 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0.08em;
  animation: agl-flicker 2.4s steps(1) infinite;
}

/* Two offset copies reveal themselves through animated clip paths. */
.agl-text::before,
.agl-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}

.agl-text::before {
  color: #f472b6;
  clip-path: inset(0 0 82% 0);
  transform: translateX(-2px);
  animation: agl-top 2.4s linear infinite alternate-reverse;
}

.agl-text::after {
  color: #22d3ee;
  clip-path: inset(78% 0 0 0);
  transform: translateX(2px);
  animation: agl-bottom 2s linear infinite alternate-reverse;
}

@keyframes agl-top {
  0%   { clip-path: inset(0 0 88% 0);  transform: translateX(0); }
  20%  { clip-path: inset(10% 0 60% 0); transform: translateX(-3px); }
  40%  { clip-path: inset(40% 0 30% 0); transform: translateX(2px); }
  60%  { clip-path: inset(0 0 70% 0);  transform: translateX(-1px); }
  80%  { clip-path: inset(50% 0 20% 0); transform: translateX(3px); }
  100% { clip-path: inset(20% 0 50% 0); transform: translateX(-2px); }
}

@keyframes agl-bottom {
  0%   { clip-path: inset(70% 0 0 0);  transform: translateX(0); }
  25%  { clip-path: inset(50% 0 10% 0); transform: translateX(2px); }
  50%  { clip-path: inset(82% 0 2% 0);  transform: translateX(-2px); }
  75%  { clip-path: inset(62% 0 6% 0);  transform: translateX(1px); }
  100% { clip-path: inset(74% 0 0 0);  transform: translateX(-3px); }
}

@keyframes agl-flicker {
  0%, 6%, 12%, 100% { opacity: 1; }
  3%, 9%            { opacity: 0.72; }
}

@media (prefers-reduced-motion: reduce) {
  .agl-text,
  .agl-text::before,
  .agl-text::after { animation: none; }
}`,
    tw: `<div data-text="GLITCH" class="relative font-extrabold tracking-[.08em] text-slate-50 text-[30px] before:absolute before:inset-0 before:text-pink-400 before:content-[attr(data-text)] after:absolute after:inset-0 after:text-cyan-400 after:content-[attr(data-text)]">
  GLITCH
</div>`,
    twExtra: `/* Add the jitter with a couple of small keyframes: */
@keyframes glitch-top {
  0%, 100% { clip-path: inset(0 0 85% 0); transform: translateX(-2px); }
  50%      { clip-path: inset(35% 0 40% 0); transform: translateX(2px); }
}
@keyframes glitch-bottom {
  0%, 100% { clip-path: inset(75% 0 0 0); transform: translateX(2px); }
  50%      { clip-path: inset(55% 0 15% 0); transform: translateX(-2px); }
}
/* then add: before:animate-[glitch-top_2.4s_linear_infinite_alternate-reverse]
            after:animate-[glitch-bottom_2s_linear_infinite_alternate-reverse] */`,
  },

  /* ───────────────────────── INPUTS & CONTROLS ─────────────────────────── */
  {
    id: "spring-toggle",
    title: "Spring Toggle",
    category: "inputs",
    description:
      "A switch whose thumb overshoots slightly before settling. The checked track gains a gradient and a soft glow.",
    tags: ["toggle", "switch", "spring", "form"],
    difficulty: "Beginner",
    motion: "interactive",
    html: `<label class="atg-switch">
  <input type="checkbox" checked />
  <span class="atg-track"><span class="atg-thumb"></span></span>
  <span class="atg-label">Notifications</span>
</label>`,
    css: `.atg-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  user-select: none;
}

/* Visually hidden but still focusable and screen-reader friendly. */
.atg-switch input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.atg-track {
  position: relative;
  width: 48px;
  height: 27px;
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-radius: 999px;
  background: var(--panel-active, #222232);
  transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.atg-thumb {
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ink-muted, #9a9ab0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
}

.atg-switch input:checked + .atg-track {
  border-color: transparent;
  background: linear-gradient(135deg, #8b5cf6, #22d3ee);
  box-shadow: 0 0 24px -6px rgba(139, 92, 246, 0.85);
}

.atg-switch input:checked + .atg-track .atg-thumb {
  transform: translateX(21px);
  background: #fff;
}

.atg-switch input:focus-visible + .atg-track {
  outline: 2px solid #b49bff;
  outline-offset: 3px;
}

.atg-label {
  color: var(--ink-soft, #c8c8d8);
  font-size: 13px;
}`,
    tw: `<label class="inline-flex cursor-pointer select-none items-center gap-3">
  <input type="checkbox" checked class="peer sr-only" />
  <span class="relative h-[27px] w-12 rounded-full border border-white/10 bg-[#222232] transition peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-violet-500 peer-checked:to-cyan-400 peer-checked:shadow-[0_0_24px_-6px_rgba(139,92,246,.85)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-violet-300">
    <span class="absolute left-[2.5px] top-[2.5px] h-5 w-5 rounded-full bg-slate-400 shadow transition-all duration-[450ms] ease-[cubic-bezier(.34,1.56,.64,1)] peer-checked:translate-x-[21px] peer-checked:bg-white"></span>
  </span>
  <span class="text-[13px] text-slate-300">Notifications</span>
</label>`,
    twExtra: "",
  },
  {
    id: "check-draw",
    title: "Checkbox Draw",
    category: "inputs",
    description:
      "The tick draws itself with an SVG stroke-dashoffset while the box pops. Small, satisfying, accessible.",
    tags: ["checkbox", "check", "draw", "form"],
    difficulty: "Beginner",
    motion: "interactive",
    html: `<label class="acd-check">
  <input type="checkbox" checked />
  <span class="acd-box">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
  </span>
  <span>I agree to the terms</span>
</label>`,
    css: `.acd-check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-soft, #c8c8d8);
  font: 400 13px/1.3 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}

.acd-check input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.acd-box {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1.5px solid var(--line-strong, rgba(255, 255, 255, 0.22));
  border-radius: 6px;
  background: var(--panel-raised, #12121d);
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.acd-box svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #08080f; /* dark tick reads on both gradient stops */
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* Draw-on effect lives here. */
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 0.3s ease 0.05s;
}

.acd-check input:checked + .acd-box {
  border-color: transparent;
  background: linear-gradient(135deg, #b49bff, #22d3ee);
  transform: scale(1.04);
}

.acd-check input:checked + .acd-box svg {
  stroke-dashoffset: 0;
}

.acd-check input:focus-visible + .acd-box {
  outline: 2px solid #b49bff;
  outline-offset: 3px;
}`,
    tw: `<label class="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-300">
  <input type="checkbox" checked class="peer sr-only" />
  <span class="grid h-[22px] w-[22px] place-items-center rounded-md border-[1.5px] border-white/20 bg-[#12121d] transition peer-checked:scale-105 peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-violet-300 peer-checked:to-cyan-400 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-violet-300">
    <svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5 fill-none stroke-slate-950 stroke-[2.6] [stroke-dasharray:24] [stroke-dashoffset:24] transition-all delay-75 duration-300 peer-checked:[stroke-dashoffset:0]">
      <path d="m5 12.5 4.5 4.5L19 7.5"/>
    </svg>
  </span>
  I agree to the terms
</label>`,
    twExtra: `/* The tick sits inside the same span as the peer target above,
   so scope the checked state with a sibling-aware selector if you
   move it outside: peer-checked:[&>svg]:[stroke-dashoffset:0] */`,
  },
  {
    id: "floating-label",
    title: "Floating Label",
    category: "inputs",
    description:
      "The label glides up and shrinks on focus or when the field has a value — no JavaScript, no placeholder hacks.",
    tags: ["input", "label", "form", "focus"],
    difficulty: "Beginner",
    motion: "interactive",
    html: `<label class="afl-field">
  <input class="afl-input" type="email" placeholder=" " autocomplete="email" />
  <span class="afl-label">Work email</span>
</label>`,
    css: `.afl-field {
  position: relative;
  display: block;
  width: min(230px, 100%);
}

.afl-input {
  width: 100%;
  height: 52px;
  padding: 18px 14px 6px;
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.14));
  border-radius: 11px;
  background: var(--panel, #0d0d16);
  color: var(--ink, #f4f4fa);
  font: 400 13px/1 ui-sans-serif, system-ui, sans-serif;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.afl-input:focus {
  border-color: rgba(139, 92, 246, 0.65);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.13);
}

.afl-label {
  position: absolute;
  top: 17px;
  left: 14px;
  color: var(--ink-faint, #8b8ba7);
  font: 400 13px/1 ui-sans-serif, system-ui, sans-serif;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease;
}

/* placeholder=" " lets :placeholder-shown detect an empty field. */
.afl-input:focus + .afl-label,
.afl-input:not(:placeholder-shown) + .afl-label {
  transform: translateY(-10px) scale(0.82);
  color: #b49bff;
}`,
    tw: `<label class="relative block w-[230px] max-w-full">
  <input type="email" placeholder=" " autocomplete="email" class="peer h-[52px] w-full rounded-xl border border-white/15 bg-[#0d0d16] px-3.5 pb-1.5 pt-[18px] text-[13px] text-slate-50 outline-none transition focus:border-violet-500/65 focus:ring-4 focus:ring-violet-500/15" />
  <span class="pointer-events-none absolute left-3.5 top-[17px] origin-top-left text-[13px] text-slate-500 transition duration-300 peer-focus:-translate-y-2.5 peer-focus:scale-[.82] peer-focus:text-violet-300 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[.82]">
    Work email
  </span>
</label>`,
    twExtra: "",
  },
  {
    id: "segmented-control",
    title: "Segmented Control",
    category: "inputs",
    description:
      "Radio inputs styled as a segmented control. The checked option fills with a gradient and lifts with a shadow.",
    tags: ["segmented", "tabs", "radio", "form"],
    difficulty: "Beginner",
    motion: "interactive",
    html: `<div class="asg-seg" role="group" aria-label="Billing cycle">
  <label class="asg-opt">
    <input type="radio" name="animcraft-billing" checked />
    <span>Monthly</span>
  </label>
  <label class="asg-opt">
    <input type="radio" name="animcraft-billing" />
    <span>Yearly <em>−20%</em></span>
  </label>
</div>`,
    css: `.asg-seg {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--line, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  background: var(--panel, #0d0d16);
}

.asg-opt {
  position: relative;
  cursor: pointer;
}

.asg-opt input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.asg-opt span {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 9px 16px;
  border-radius: 9px;
  color: var(--ink-muted, #9a9ab0);
  font: 500 12.5px/1 ui-sans-serif, system-ui, sans-serif;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.asg-opt input:checked + span {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(34, 211, 238, 0.85));
  color: #08080f;
  box-shadow: 0 6px 18px -8px rgba(139, 92, 246, 0.9);
}

.asg-opt input:focus-visible + span {
  outline: 2px solid #b49bff;
  outline-offset: 2px;
}

.asg-opt em {
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(8, 8, 15, 0.25);
  font: 600 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  font-style: normal;
}`,
    tw: `<div role="group" aria-label="Billing cycle" class="inline-flex gap-1 rounded-xl border border-white/10 bg-[#0d0d16] p-1">
  <label class="cursor-pointer">
    <input type="radio" name="billing" checked class="peer sr-only" />
    <span class="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-medium text-slate-400 transition peer-checked:bg-gradient-to-br peer-checked:from-violet-500 peer-checked:to-cyan-400 peer-checked:text-slate-950 peer-checked:shadow-[0_6px_18px_-8px_rgba(139,92,246,.9)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-300">
      Monthly
    </span>
  </label>
  <label class="cursor-pointer">
    <input type="radio" name="billing" class="peer sr-only" />
    <span class="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-medium text-slate-400 transition peer-checked:bg-gradient-to-br peer-checked:from-violet-500 peer-checked:to-cyan-400 peer-checked:text-slate-950 peer-checked:shadow-[0_6px_18px_-8px_rgba(139,92,246,.9)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-300">
      Yearly
      <em class="rounded bg-slate-950/25 px-1 py-0.5 font-mono text-[9px] font-semibold not-italic">−20%</em>
    </span>
  </label>
</div>`,
    twExtra: "",
  },

  /* ──────────────────────────── NOTIFICATIONS ──────────────────────────── */
  {
    id: "toast-slide",
    title: "Toast Slide",
    category: "notifications",
    description:
      "A success toast slides in, holds, and leaves on a loop. Pair it with your own queue logic when you ship it.",
    tags: ["toast", "success", "notification", "slide"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<div class="ats-toast" role="status">
  <span class="ats-icon" aria-hidden="true">✓</span>
  <div>
    <strong>Changes saved</strong>
    <span>Your project is up to date.</span>
  </div>
</div>`,
    css: `.ats-toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: min(280px, 100%);
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: #14141f;
  box-shadow: 0 20px 40px -24px #000;
  font-family: ui-sans-serif, system-ui, sans-serif;
  animation: ats-slide 4.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

.ats-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.16);
  color: #34d399;
  font-size: 12px;
}

.ats-toast strong {
  display: block;
  color: #f4f4fa;
  font-size: 12.5px;
  font-weight: 600;
}

.ats-toast div span {
  display: block;
  margin-top: 2px;
  color: #9a9ab0;
  font-size: 11px;
  line-height: 1.4;
}

/* Slide in, hold, then exit — one keyframe set for the whole lifecycle. */
@keyframes ats-slide {
  0%        { transform: translateX(115%); opacity: 0; }
  7%        { transform: translateX(0);    opacity: 1; }
  88%       { transform: translateX(0);    opacity: 1; }
  96%, 100% { transform: translateX(115%); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  /* No slide: the message simply stays visible. */
  .ats-toast { animation: none; }
}`,
    tw: `<div role="status" class="flex w-[280px] max-w-full animate-[toast_4.6s_cubic-bezier(.22,1,.36,1)_infinite] items-start gap-2.5 rounded-xl border border-white/10 bg-[#14141f] p-3.5 shadow-2xl">
  <span aria-hidden="true" class="grid h-6 w-6 flex-none place-items-center rounded-full bg-emerald-400/15 text-xs text-emerald-400">✓</span>
  <div>
    <strong class="block text-[12.5px] font-semibold text-slate-50">Changes saved</strong>
    <span class="mt-0.5 block text-[11px] leading-snug text-slate-400">Your project is up to date.</span>
  </div>
</div>`,
    twExtra: `@keyframes toast {
  0%        { transform: translateX(115%); opacity: 0; }
  7%        { transform: translateX(0);    opacity: 1; }
  88%       { transform: translateX(0);    opacity: 1; }
  96%, 100% { transform: translateX(115%); opacity: 0; }
}`,
  },
  {
    id: "badge-ping",
    title: "Badge Ping",
    category: "notifications",
    description:
      "A notification dot with an expanding ping ring. It reads instantly, even in peripheral vision, and never overwhelms.",
    tags: ["badge", "ping", "notification", "dot"],
    difficulty: "Beginner",
    motion: "loop",
    html: `<button class="abg-bell" type="button" aria-label="Notifications">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
    <path d="M10 21h4"/>
  </svg>
  <span class="abg-dot"><span></span></span>
</button>`,
    css: `.abg-bell {
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: #12121d;
  color: #c8c8d8;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.abg-bell > svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.abg-bell:hover {
  transform: translateY(-2px);
  border-color: rgba(244, 114, 182, 0.5);
}

.abg-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f472b6;
  /* A ring in the surface colour separates dot from icon. */
  box-shadow: 0 0 0 2.5px #12121d;
}

.abg-dot span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #f472b6;
  animation: abg-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes abg-ping {
  0%        { transform: scale(1);   opacity: 0.7; }
  80%, 100% { transform: scale(2.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .abg-dot span { animation: none; opacity: 0.35; }
}`,
    tw: `<button type="button" aria-label="Notifications" class="relative grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-[#12121d] text-slate-300 transition hover:-translate-y-0.5 hover:border-pink-400/50">
  <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 fill-none stroke-current stroke-[1.7]">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>
  </svg>
  <span class="absolute right-2.5 top-2.5 h-[9px] w-[9px] rounded-full bg-pink-400 shadow-[0_0_0_2.5px_#12121d]">
    <span class="absolute inset-0 animate-ping rounded-full bg-pink-400"></span>
  </span>
</button>`,
    twExtra: "",
  },
  {
    id: "progress-snackbar",
    title: "Progress Snackbar",
    category: "notifications",
    description:
      "A snackbar with an animated countdown rail. When the rail empties, the message would dismiss — here it loops.",
    tags: ["snackbar", "progress", "toast", "countdown"],
    difficulty: "Intermediate",
    motion: "loop",
    html: `<div class="asn-bar" role="status">
  <span class="asn-icon" aria-hidden="true">↗</span>
  <span class="asn-text">Deployment is live</span>
  <span class="asn-action">View</span>
  <span class="asn-progress" aria-hidden="true"></span>
</div>`,
    css: `.asn-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  width: min(290px, 100%);
  padding: 12px 14px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 11px;
  background: #101019;
  overflow: hidden;
  font-family: ui-sans-serif, system-ui, sans-serif;
}

.asn-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: rgba(34, 211, 238, 0.15);
  color: #67e8f9;
  font-size: 12px;
}

.asn-text {
  flex: 1;
  overflow: hidden;
  color: #e3e3f0;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.asn-action {
  padding: 4px 7px;
  border-radius: 6px;
  background: rgba(139, 92, 246, 0.14);
  color: #b49bff;
  font: 600 10.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
}

.asn-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #b49bff, #22d3ee);
  animation: asn-countdown 4s linear infinite;
}

/* The rail drains, pauses, then refills for the demo loop. */
@keyframes asn-countdown {
  0%   { width: 100%; opacity: 1; }
  85%  { width: 0;    opacity: 1; }
  100% { width: 0;    opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .asn-progress { animation: none; width: 45%; opacity: 0.8; }
}`,
    tw: `<div role="status" class="relative flex w-[290px] max-w-full items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-[#101019] px-3.5 pb-4 pt-3">
  <span aria-hidden="true" class="grid h-[22px] w-[22px] flex-none place-items-center rounded-md bg-cyan-400/15 text-xs text-cyan-300">↗</span>
  <span class="flex-1 truncate text-xs text-slate-200">Deployment is live</span>
  <span class="rounded-md bg-violet-500/15 px-1.5 py-1 font-mono text-[10.5px] font-semibold text-violet-300">View</span>
  <span aria-hidden="true" class="absolute bottom-0 left-0 h-0.5 animate-[countdown_4s_linear_infinite] bg-gradient-to-r from-violet-300 to-cyan-400"></span>
</div>`,
    twExtra: `@keyframes countdown {
  0%   { width: 100%; opacity: 1; }
  85%  { width: 0;    opacity: 1; }
  100% { width: 0;    opacity: 0; }
}`,
  },
];

/* Tiny helper used by the footer + hero counters so numbers never drift. */
const ANIMATION_COUNT = ANIMATIONS.length;
