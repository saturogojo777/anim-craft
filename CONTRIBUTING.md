# Contributing to AnimCraft

First: thank you. AnimCraft exists because people like you paste a better idea into it.

This guide covers everything you need to go from "I found a rough edge" to "my pull request is merged" — including the exact format for adding an animation.

---

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Adding an animation](#adding-an-animation)
- [Snippet style guide](#snippet-style-guide)
- [Accessibility checklist](#accessibility-checklist)
- [Commit & branch conventions](#commit--branch-conventions)
- [Pull request checklist](#pull-request-checklist)
- [Review process](#review-process)
- [Project structure](#project-structure)
- [Reporting bugs & requesting features](#reporting-bugs--requesting-features)

---

## Ways to contribute

You do not have to write CSS to be useful here.

| Contribution | Difficulty | Where to start |
| :-- | :-- | :-- |
| Add a new animation | Easy → Medium | [Adding an animation](#adding-an-animation) |
| Improve a description or tag list | Easy | `assets/js/data.js` |
| Fix an accessibility issue | Medium | [Accessibility checklist](#accessibility-checklist) |
| Improve the gallery UI or performance | Medium | `assets/js/app.js`, `assets/css/base.css` |
| Report a bug with a screenshot | Easy | [Bug report](https://github.com/saturogojo777/anim-craft/issues/new?template=bug_report.yml) |
| Suggest an effect you've seen elsewhere | Easy | [Animation request](https://github.com/saturogojo777/anim-craft/issues/new?template=animation-request.yml) |
| Improve this documentation | Easy | `README.md`, `CONTRIBUTING.md` |

If you are new to open source, look for issues labelled [`good first issue`](https://github.com/saturogojo777/anim-craft/labels/good%20first%20issue). Adding a single animation is a great first pull request: the change is small, self-contained, and easy to review.

---

## Development setup

AnimCraft has **no build step and no dependencies**. All you need is Git, Node.js 18+ (only for the validator), and a browser.

```bash
# 1. Fork the repository on GitHub, then:
git clone https://github.com/<your-handle>/anim-craft.git
cd anim-craft

# 2. Serve it locally (any static server works)
npx serve .                    # …or: python3 -m http.server 8080

# 3. Validate the catalogue before committing
node scripts/validate.mjs
```

> The site also opens by double-clicking `index.html`, but a local server gives you correct relative paths and clipboard permissions.

**Optional:** keep `node scripts/validate.mjs` running in a second terminal while you edit `data.js`. It takes about 200 ms.

---

## Adding an animation

### 1. Pick a namespace

Every snippet shares one document, so class names must be prefixed. Choose a short, unique prefix:

| Animation | Prefix used |
| :-- | :-- |
| Aurora Glow | `acg-` |
| Skeleton Shimmer | `ask-` |
| Spring Toggle | `atg-` |

Check your prefix is free:

```bash
grep -o "\.[a-z]\{2,4\}-" assets/js/data.js | sort -u | less
```

### 2. Append an entry to `assets/js/data.js`

```js
{
  id: "pulse-ring",                 // unique kebab-case; deep links use #anim-pulse-ring
  title: "Pulse Ring",
  category: "buttons",              // buttons | loaders | cards | hover | text | inputs | notifications
  description: "One sentence on what it does and where it shines.",   // aim for 60–160 chars
  tags: ["pulse", "ring", "cta"],   // 2–5 lowercase tags, searchable
  difficulty: "Beginner",           // Beginner | Intermediate | Advanced
  motion: "hover",                  // hover | loop | interactive

  html: `<button class="apr-btn" type="button">Pulse</button>`,

  css: `/* Comment the non-obvious parts. */
.apr-btn {
  padding: 14px 26px;
  border: 0;
  border-radius: 12px;
  background: var(--grad-strong, linear-gradient(135deg, #a78bfa, #22d3ee));
  color: #08080f;
  font: 600 14px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: box-shadow 0.35s ease;
}

.apr-btn:hover {
  box-shadow: 0 0 0 10px rgba(139, 92, 246, 0.22);
}

@media (prefers-reduced-motion: reduce) {
  .apr-btn { transition: none; }
}`,

  tw: `<button type="button" class="rounded-xl bg-gradient-to-br from-violet-300 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-shadow hover:shadow-[0_0_0_10px_rgba(139,92,246,.22)]">
  Pulse
</button>`,

  // Only needed when the Tailwind version depends on custom @keyframes.
  twExtra: "",
}
```

### 3. Check it in the browser

- The card appears in the right category with the right badge.
- The preview animates on the card **and** in the detail view.
- All three copy buttons produce a snippet that works in a blank file.
- It still looks intentional at 390 px wide.

### 4. Validate

```bash
node scripts/validate.mjs
```

This checks ids, categories, required fields, CSS brace balance, namespace leakage, external assets, and reduced-motion coverage. It must pass cleanly.

---

## Snippet style guide

These rules keep 30+ animations from stepping on each other — and make every snippet feel like it came from the same careful hand.

1. **Namespace every selector.** `.apr-btn`, `.apr-btn::after` — never bare element selectors (`button {}`) and never generic class names (`.btn`, `.card`).
2. **Use the shared tokens** for surfaces and text, always with a fallback:
   `background: var(--panel, #0c0c14); color: var(--ink, #f4f4fa); border: 1px solid var(--line, #ffffff14);`
3. **No external requests.** No Google Fonts, no CDN images, no `@import`, no icon fonts. Inline SVG is perfect.
4. **No JavaScript in snippets.** CSS-only, always. (The *site* uses JS; the snippets must not.)
5. **2-space indentation, double quotes in JS, single-line declarations.** Keep lines under ~90 characters so the code panel does not scroll horizontally on laptops.
6. **Animate `transform` and `opacity`** where possible. Avoid animating `width`, `top`, or `box-shadow` in loops.
7. **Comment the clever part.** One short `/* … */` above the trick that makes it work.
8. **Provide a Tailwind version** using v3+ utilities and arbitrary values (`shadow-[0_0_36px_-8px_rgba(139,92,246,.85)]`). If keyframes are unavoidable, put them in `twExtra` with a one-line explanation.
9. **Include a reduced-motion override** for anything that loops or moves on its own.
10. **Keep descriptions concrete.** "A conic-gradient beam orbits the border" beats "A cool button animation".

---

## Accessibility checklist

- [ ] Icon-only controls have an `aria-label`.
- [ ] Decorative elements (`::before`/`::after` content, sparkles, glows) are marked `aria-hidden="true"` in the markup.
- [ ] The effect is not the *only* signal of state — a checked toggle also changes colour and shape, not just motion.
- [ ] Focus is visible: use `:focus-visible`, never `outline: none` without a replacement.
- [ ] No flashing above three times per second; no infinite large-area movement.
- [ ] `prefers-reduced-motion: reduce` collapses or removes the motion.
- [ ] Text contrast holds in both themes (the site exposes `--ink`, `--ink-muted`, `--ink-faint`).

---

## Commit & branch conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(animations): add pulse ring button
fix(gallery): keep filter pill visible after search
docs(readme): document the tailwind tab
perf(preview): pause offscreen animations
chore(ci): bump pages action
```

Branch names: `feat/…`, `fix/…`, `docs/…`, `chore/…`.

Keep pull requests focused: **one animation per PR**, or one logical fix. If you want to add five animations, five PRs is genuinely easier to review — and it gets you five merge commits.

---

## Pull request checklist

Before you click *Create pull request*:

- [ ] `node scripts/validate.mjs` passes with no errors.
- [ ] The animation looks right in **dark and light** themes.
- [ ] The card and the detail view both animate.
- [ ] All three tabs (HTML / CSS / Tailwind) copy working code.
- [ ] Tested at **390 px**, **768 px**, and **1440 px** widths.
- [ ] Keyboard-only pass: <kbd>Tab</kbd> reaches every control; <kbd>Esc</kbd> closes the dialog.
- [ ] `prefers-reduced-motion` behaviour is intentional.
- [ ] The PR description includes a screenshot or a short screen recording.
- [ ] Your entry is in the correct category and has 2–5 useful tags.

---

## Review process

1. A maintainer triages within ~72 hours.
2. We review for correctness, naming, accessibility, and visual fit — not personal taste in colour.
3. If changes are requested, push more commits to the same branch; please do not force-push during review.
4. Once approved, we squash-merge and your name lands in the release notes.

Not sure whether an idea fits? Open an [animation request](https://github.com/saturogojo777/anim-craft/issues/new?template=animation-request.yml) or start a [discussion](https://github.com/saturogojo777/anim-craft/discussions) first. Nobody minds a question.

---

## Project structure

```
index.html                  App shell: hero, gallery, dialog, footer
404.html                    GitHub Pages fallback
assets/css/theme-vars.css   Design tokens (shared by the site and the snippets)
assets/css/base.css         Layout, components, responsive + site keyframes
assets/js/data.js           The catalogue — add your animation here
assets/js/app.js            Rendering, search, filters, copy, dialog, shortcuts
scripts/validate.mjs        Zero-dependency catalogue linter (also runs in CI)
.github/workflows/          Pages deploy + validation
```

**How rendering works:** `app.js` reads `ANIMATIONS`, injects every `css` field into a single `<style>` element, and renders each `html` field inside a card. Hover rules are mirrored under an `.is-playing` ancestor so touch and keyboard users can replay hover-only effects. That is why the preview and the copied snippet can never drift apart.

---

## Reporting bugs & requesting features

Use the issue templates:

- 🐛 [Bug report](https://github.com/saturogojo777/anim-craft/issues/new?template=bug_report.yml) — include browser, OS, steps, and a screenshot.
- ✨ [Animation request](https://github.com/saturogojo777/anim-craft/issues/new?template=animation-request.yml) — a reference link or description helps enormously.

For security issues, please email the maintainer rather than opening a public issue.

---

## Thank you

Every contribution — a comma, a colour, a whole new category — makes this a better resource for the next developer who needs motion that feels intentional. 💜
