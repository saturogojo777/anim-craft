## What does this PR do?

<!-- One or two sentences. Link the issue if there is one: Closes #123 -->

## Type of change

- [ ] New animation
- [ ] Fix (bug, layout, accessibility)
- [ ] Documentation
- [ ] Refactor / performance
- [ ] CI or tooling

## New animation details

<!-- Skip if this PR does not add an animation. -->

| | |
| :-- | :-- |
| **ID** | `pulse-ring` |
| **Category** | buttons |
| **Motion** | hover |
| **Namespace / prefix** | `apr-` |

## Screenshots

<!-- Before/after or a short recording. Drag files into this box. -->

| Dark | Light |
| :--: | :--: |
|  |  |

## Checklist

- [ ] `node scripts/validate.mjs` passes
- [ ] Previewed in dark **and** light themes
- [ ] Card preview *and* detail dialog both animate
- [ ] HTML / CSS / Tailwind all copy working code
- [ ] Checked at 390 px, 768 px, and 1440 px
- [ ] Keyboard-only pass (Tab, Enter, Esc, arrow keys)
- [ ] `prefers-reduced-motion` behaviour is intentional
- [ ] One logical change per PR
