#!/usr/bin/env node
/* ============================================================================
 * AnimCraft — scripts/validate.mjs
 * ----------------------------------------------------------------------------
 * A tiny, dependency-free catalogue linter. It runs on every pull request so
 * that a malformed snippet never reaches the gallery.
 *
 *   node scripts/validate.mjs
 *
 * Checks
 *   • ids are kebab-case, unique, and deep-link friendly
 *   • every category, difficulty, and motion value is known
 *   • html / css / tw fields exist and never load external assets
 *   • CSS braces balance, and every class selector is namespaced to a class
 *     that actually appears in the snippet's markup
 *   • looping snippets document prefers-reduced-motion (warning)
 * ========================================================================== */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const DIFFICULTIES = new Set(["Beginner", "Intermediate", "Advanced"]);
const MOTIONS = new Set(["hover", "loop", "interactive"]);

const errors = [];
const warnings = [];
const fail = (item, message) => errors.push(`${item}: ${message}`);
const warn = (item, message) => warnings.push(`${item}: ${message}`);

/* ── Load the catalogue in an isolated context ─────────────────────────────── */
async function loadCatalogue() {
  const source = await readFile(join(root, "assets/js/data.js"), "utf8");
  const sandbox = { console };
  vm.createContext(sandbox);

  try {
    vm.runInContext(`${source}\n;globalThis.__catalogue = { CATEGORIES, ANIMATIONS };`, sandbox, {
      filename: "assets/js/data.js",
    });
  } catch (error) {
    console.error(`\n✖ Could not evaluate assets/js/data.js\n  ${error.message}\n`);
    process.exit(1);
  }

  return sandbox.__catalogue;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const CLASS_ATTR = /class="([^"]+)"/g;

function classesIn(html) {
  const found = new Set();
  for (const match of html.matchAll(CLASS_ATTR)) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => found.add(name));
  }
  return found;
}

function classSelectorsIn(css) {
  // Strip comments first so commented-out selectors do not trip the linter.
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [];
  const rule = /(^|})\s*([^{}@]+)\{/g;
  for (const match of withoutComments.matchAll(rule)) {
    const selector = match[2].replace(/\s+/g, " ").trim();
    if (!selector || selector.startsWith("from") || selector.startsWith("to")) continue;
    if (/^\d/.test(selector)) continue;
    for (const part of selector.split(",")) {
      for (const name of part.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
        selectors.push(name[1]);
      }
    }
  }
  return selectors;
}

function braceBalance(css) {
  let depth = 0;
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/"(?:[^"\\]|\\.)*"/g, '""')) {
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/* ── Run ──────────────────────────────────────────────────────────────────── */
const { CATEGORIES, ANIMATIONS } = await loadCatalogue();
const categoryIds = new Set(CATEGORIES.map((category) => category.id));
const seenIds = new Set();

if (!Array.isArray(ANIMATIONS) || ANIMATIONS.length === 0) {
  console.error("\n✖ No animations found.\n");
  process.exit(1);
}

for (const item of ANIMATIONS) {
  const label = item && item.id ? item.id : "(missing id)";

  if (!item || typeof item !== "object") {
    fail("catalogue", "every entry must be an object");
    continue;
  }

  if (!item.id) fail(label, "missing id");
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) fail(label, "id must be kebab-case (a-z, 0-9, hyphens)");
  else if (seenIds.has(item.id)) fail(label, "duplicate id");
  else seenIds.add(item.id);

  if (!item.title) fail(label, "missing title");
  if (!item.description) fail(label, "missing description");
  else if (item.description.length < 40) warn(label, "description is under 40 characters — say a little more");

  if (!categoryIds.has(item.category)) fail(label, `unknown category "${item.category}"`);
  if (!DIFFICULTIES.has(item.difficulty)) fail(label, `unknown difficulty "${item.difficulty}"`);
  if (!MOTIONS.has(item.motion)) fail(label, `unknown motion "${item.motion}"`);
  if (!Array.isArray(item.tags) || item.tags.length === 0) fail(label, "add at least one tag");

  for (const field of ["html", "css", "tw"]) {
    if (!item[field] || typeof item[field] !== "string") fail(label, `missing ${field} snippet`);
  }

  if (typeof item.html === "string" && typeof item.css === "string") {
    const classes = classesIn(item.html);
    const used = new Set(classSelectorsIn(item.css));
    for (const name of used) {
      if (!classes.has(name)) {
        fail(label, `.${name} is styled in CSS but never used in the HTML snippet`);
      }
    }

    if (!braceBalance(item.css)) fail(label, "unbalanced braces in CSS");
    if (/https?:\/\//.test(item.html)) fail(label, "HTML loads an external asset — snippets must be self-contained");
    if (/@import/.test(item.css)) fail(label, "CSS uses @import — keep snippets self-contained");
  }

  if (item.motion === "loop" && typeof item.css === "string" && !/prefers-reduced-motion/.test(item.css)) {
    warn(label, "looping animation without a prefers-reduced-motion override");
  }

  if (item.twExtra && typeof item.tw === "string" && /@keyframes/.test(item.twExtra) && !/animate-\[/.test(`${item.tw} ${item.twExtra}`)) {
    warn(label, "twExtra declares keyframes that the Tailwind markup never references");
  }
}

/* Deep-link fragments rendered by the app should stay unique too. */
for (const item of ANIMATIONS) {
  if (item.id && item.id.startsWith("anim-")) {
    warn(item.id, "avoid the anim- prefix, it is used by deep links (#anim-<id>)");
  }
}

/* ── Report ───────────────────────────────────────────────────────────────── */
const byCategory = CATEGORIES.filter((category) => category.id !== "all").map(
  (category) => `${category.label}: ${ANIMATIONS.filter((item) => item.category === category.id).length}`
);

console.log(`\nAnimCraft catalogue — ${ANIMATIONS.length} animations`);
console.log(`  ${byCategory.join(" · ")}\n`);

for (const message of warnings) console.warn(`  ⚠ ${message}`);
if (warnings.length) console.log("");

if (errors.length) {
  for (const message of errors) console.error(`  ✖ ${message}`);
  console.error(`\n${errors.length} error${errors.length === 1 ? "" : "s"} found. Fix them and re-run.\n`);
  process.exit(1);
}

console.log(`✔ All checks passed${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}.\n`);
