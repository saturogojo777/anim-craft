/* ============================================================================
 * AnimCraft — app.js
 * ----------------------------------------------------------------------------
 * Vanilla ES2020. No frameworks, no build step, no dependencies.
 *
 * Responsibilities
 *   • Inject every animation's CSS into one <style> tag
 *   • Render, search, filter, and favourite the gallery
 *   • Copy HTML / CSS / Tailwind snippets with visual feedback
 *   • Drive the detail dialog, code viewer, and keyboard shortcuts
 *
 * The data itself lives in data.js (loaded first), so the preview and the
 * snippet you copy are guaranteed to be the same code.
 * ========================================================================== */
(function () {
  "use strict";

  /* ─────────────────────────────── Constants ─────────────────────────────── */
  const STORAGE_KEYS = {
    favorites: "animcraft:favorites",
    theme: "animcraft:theme",
    paused: "animcraft:paused",
  };

  const MOTION_LABELS = {
    hover: "Hover",
    loop: "Loop",
    interactive: "Interactive",
  };

  const MOTION_BADGES = {
    hover: "hover",
    loop: "loop",
    interactive: "interactive",
  };

  const TAB_LABELS = { html: "HTML", css: "CSS", tw: "Tailwind" };

  /* ──────────────────────────────── Helpers ──────────────────────────────── */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));

  function safeStorage(kind) {
    try {
      return kind === "session" ? window.sessionStorage : window.localStorage;
    } catch (error) {
      return null; // Private mode / storage disabled — fail silently.
    }
  }

  function readStorage(key, fallback) {
    try {
      const store = safeStorage();
      const raw = store && store.getItem(key);
      return raw === null || raw === undefined ? fallback : raw;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      const store = safeStorage();
      if (store) store.setItem(key, value);
    } catch (error) {
      /* Storage is optional; ignore quota / permission errors. */
    }
  }

  /* ─────────────────────── Inject animation stylesheets ──────────────────── */
  /**
   * Hover effects are authored with `:hover`, as they should be. To let touch
   * and keyboard users replay them, we duplicate every hover rule with an
   * `.is-playing` ancestor (added temporarily by the Replay button). The
   * transform is deliberately conservative: only top-level rules containing
   * `:hover` are cloned, and @keyframes blocks pass through untouched.
   */
  function withPlayableHover(css) {
    return css.replace(/([^{}]+)\{([^{}]*)\}/g, (rule, selector, body) => {
      if (!selector.includes(":hover")) return rule;
      if (/^\s*(from|to|\d)/i.test(selector)) return rule;

      const hoverSelectors = selector
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.includes(":hover"));

      if (!hoverSelectors.length) return rule;

      const playable = hoverSelectors.map((part) =>
        ".is-playing " + part.replace(/:hover/g, "").replace(/\s+/g, " ").trim()
      );

      return `${selector}{${body}}\n${playable.join(",\n")}{${body}}`;
    });
  }

  function injectAnimationStyles() {
    const style = document.createElement("style");
    style.id = "animcraft-animation-styles";
    style.textContent = ANIMATIONS.map(
      (item) => `/* ${item.title} */\n${withPlayableHover(item.css)}`
    ).join("\n\n");
    document.head.appendChild(style);
  }

  /* ────────────────────────────── Syntax sugar ───────────────────────────── */
  /*
   * These are intentionally tiny tokenizers rather than regex-replace chains:
   * every token is matched once against the raw source and emitted as a single
   * escaped span, so markup can never nest inside itself. If you need more
   * fidelity, swap in Prism or Shiki — nothing else in the app depends on this.
   */

  const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeText = (value) => String(value).replace(/[&<>"']/g, (char) => escapeMap[char]);
  const span = (className, text) =>
    `<span class="${className}">${escapeText(text)}</span>`;

  /** CSS: highlights selectors, at-rules, properties, values and comments. */
  function highlightCss(source) {
    return source
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.endsWith("*/")) {
          return span("tok-comment", line);
        }
        if (trimmed.startsWith("@")) return span("tok-at", line);
        if (trimmed === "}" || trimmed === "{") return span("tok-brace", line);
        if (trimmed.endsWith("{")) {
          const isKeyframe = /^(\d+%|from|to)\b/i.test(trimmed);
          return span(isKeyframe ? "tok-num" : "tok-sel", line);
        }

        const declaration = line.match(/^(\s*)([a-zA-Z-]+)(\s*:\s*)(.*?)(\s*)$/);
        if (declaration) {
          const [, indent, property, separator, rawValue, trailing] = declaration;
          // Split the value into literals (colors/numbers/units) and plain text.
          const pieces = rawValue.split(
            /(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|s|ms|deg|%|ch|vh|vw|fr)?)/
          );
          const value = pieces
            .map((piece) =>
              piece && /^(#[0-9a-fA-F]{3,8}|-?\d)/.test(piece)
                ? span("tok-num", piece)
                : escapeText(piece)
            )
            .join("");
          return `${indent}${span("tok-prop", property)}${escapeText(separator)}${value}${trailing}`;
        }

        return span("tok-comment", line);
      })
      .join("\n");
  }

  /** HTML: tags, attribute names, and quoted values each become one token. */
  function highlightHtml(source) {
    // One pass, one alternation: comments win, then tags, then attributes.
    // Because we match against the *raw* line and escape each piece once, the
    // output markup can never be re-tokenized into itself.
    const token = /<!--[\s\S]*?-->|<\/?[a-zA-Z][\w-]*|[a-zA-Z-]+="[^"]*"/g;

    return source
      .split("\n")
      .map((line) => {
        let output = "";
        let lastIndex = 0;

        line.replace(token, (match, offset) => {
          output += escapeText(line.slice(lastIndex, offset));

          if (match.startsWith("<!--")) {
            output += span("tok-comment", match);
          } else if (match.startsWith("<")) {
            const name = match.replace(/^<\/?/, "");
            output += escapeText(match.slice(0, match.length - name.length)) + span("tok-tag", name);
          } else {
            const equals = match.indexOf("=");
            output += span("tok-attr", match.slice(0, equals)) + "=" + span("tok-str", match.slice(equals + 1));
          }

          lastIndex = offset + match.length;
          return match;
        });

        output += escapeText(line.slice(lastIndex));
        return output;
      })
      .join("\n");
  }

  /** The Tailwind tab mixes markup with an optional CSS addendum. */
  function highlightTailwind(item) {
    let output = highlightHtml(item.tw);
    if (item.twExtra) {
      output +=
        '\n\n<span class="tok-comment">/* Optional: extra CSS only if you need custom keyframes. */</span>\n' +
        highlightCss(item.twExtra);
    }
    return output;
  }

  function withLineNumbers(highlighted) {
    return highlighted
      .split("\n")
      .map((line, index) => {
        const number = String(index + 1).padStart(2, "0");
        return `<span class="code-line"><span class="ln" aria-hidden="true">${number}</span><span class="code-text">${line || " "}</span></span>`;
      })
      .join("");
  }

  /* ──────────────────────────── State & elements ─────────────────────────── */
  const state = {
    query: "",
    category: "all",
    favoritesOnly: false,
    favorites: new Set(),
    list: [],
    theme: "dark",
    paused: false,
  };

  const modalState = { list: [], index: 0, item: null, tab: "html", playTimer: null };
  let lastFocused = null;

  const els = {
    grid: $("#grid"),
    skeleton: $("#grid-skeleton"),
    empty: $("#empty-state"),
    emptyText: $("#empty-text"),
    emptyReset: $("#empty-reset"),
    resultCount: $("#result-count"),
    filterTrack: $("#filter-track"),
    filterIndicator: $("#filter-indicator"),
    search: $("#search-input"),
    searchClear: $("#search-clear"),
    favoritesToggle: $("#favorites-toggle"),
    favoritesCount: $("#favorites-count"),
    themeToggle: $("#theme-toggle"),
    motionToggle: $("#motion-toggle"),
    toastStack: $("#toast-stack"),
    dialog: $("#detail-dialog"),
    modalPanel: $("#modal-panel"),
    modalPreview: $("#modal-preview"),
    modalStage: $("#modal-stage"),
    modalCategory: $("#modal-category"),
    modalTitle: $("#modal-title"),
    modalDesc: $("#modal-desc"),
    modalTags: $("#modal-tags"),
    modalDifficulty: $("#modal-difficulty"),
    modalMotion: $("#modal-motion"),
    modalCatName: $("#modal-cat-name"),
    modalFav: $("#modal-fav"),
    modalClose: $("#modal-close"),
    modalPrev: $("#modal-prev"),
    modalNext: $("#modal-next"),
    modalCounter: $("#modal-counter"),
    modalReplay: $("#modal-replay"),
    modalCopy: $("#modal-copy"),
    codePanel: $("#code-panel"),
    codeBlock: $("#code-block"),
    codeNote: $("#code-note"),
    year: $("#year"),
  };

  /* ──────────────────────────── Snippet assembly ─────────────────────────── */
  function tailwindSource(item) {
    if (!item.twExtra) return item.tw;
    return `${item.tw}\n\n/* Optional: extra CSS only if you need custom keyframes. */\n${item.twExtra}`;
  }

  function sourceFor(item, tab) {
    if (tab === "html") return item.html;
    if (tab === "css") return item.css;
    return tailwindSource(item);
  }

  /* ──────────────────────────────── Toasts ───────────────────────────────── */
  function toast(message, options = {}) {
    if (!els.toastStack) return;
    const node = document.createElement("div");
    node.className = "toast" + (options.variant === "info" ? " toast--info" : "");
    node.innerHTML = `
      <span class="toast__icon" aria-hidden="true">
        <svg class="icon"><use href="#${options.variant === "info" ? "i-sparkles" : "i-check"}"/></svg>
      </span>
      <span>${message}</span>`;
    els.toastStack.appendChild(node);

    // Keep at most three toasts on screen.
    while (els.toastStack.children.length > 3) {
      els.toastStack.firstElementChild.remove();
    }

    window.setTimeout(() => {
      node.classList.add("is-leaving");
      window.setTimeout(() => node.remove(), 260);
    }, options.duration || 2200);
  }

  /* ─────────────────────────────── Clipboard ─────────────────────────────── */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      /* Fall through to the legacy path below. */
    }

    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch (error) {
      return false;
    }
  }

  async function copySnippet(item, tab, trigger) {
    const ok = await copyText(sourceFor(item, tab));

    if (!ok) {
      toast("Copy failed — select the code manually.", { variant: "info", duration: 3200 });
      return false;
    }

    toast(`<code>${TAB_LABELS[tab]}</code> copied · ${escapeHtml(item.title)}`);

    // Card chips briefly flip to a success state.
    if (trigger && trigger.classList.contains("copy-chip")) {
      const original = trigger.textContent;
      trigger.classList.add("is-copied");
      trigger.textContent = "✓";
      window.setTimeout(() => {
        trigger.classList.remove("is-copied");
        trigger.textContent = original;
      }, 1300);
    }

    // The modal's main copy button swaps its label and icon.
    if (trigger && trigger.classList.contains("copy-code-btn")) {
      trigger.classList.add("is-copied");
      const label = trigger.querySelector("span");
      if (label) label.textContent = "Copied!";
      window.setTimeout(() => {
        trigger.classList.remove("is-copied");
        if (label) label.textContent = `Copy ${TAB_LABELS[modalState.tab]}`;
      }, 1500);
    }

    return true;
  }

  /* ──────────────────────────────── Theme ────────────────────────────────── */
  function applyTheme(theme, announce) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);

    if (els.themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      els.themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
      els.themeToggle.title = `Switch to ${next} theme`;
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06060a" : "#f5f5fa");

    if (announce) toast(`${theme === "dark" ? "Dark" : "Light"} theme on`, { variant: "info", duration: 1400 });
  }

  /* ─────────────────────────── Favourites (local) ────────────────────────── */
  function loadFavorites() {
    try {
      const raw = readStorage(STORAGE_KEYS.favorites, "[]");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.favorites = new Set(parsed.filter((id) => ANIMATIONS.some((item) => item.id === id)));
      }
    } catch (error) {
      state.favorites = new Set();
    }
  }

  function persistFavorites() {
    writeStorage(STORAGE_KEYS.favorites, JSON.stringify(Array.from(state.favorites)));
  }

  function syncFavoriteUi() {
    if (els.favoritesCount) els.favoritesCount.textContent = String(state.favorites.size);

    $$("[data-fav]").forEach((button) => {
      const isSaved = state.favorites.has(button.dataset.fav);
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} animation`);
      button.title = isSaved ? "Remove from saved" : "Save animation";
    });

    if (modalState.item && els.modalFav) {
      const saved = state.favorites.has(modalState.item.id);
      els.modalFav.setAttribute("aria-pressed", String(saved));
      els.modalFav.setAttribute("aria-label", saved ? "Remove from saved" : "Save animation");
    }
  }

  function toggleFavorite(id, announce) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    persistFavorites();
    syncFavoriteUi();

    const item = ANIMATIONS.find((entry) => entry.id === id);
    if (announce && item) {
      toast(
        state.favorites.has(id)
          ? `Saved <code>${escapeHtml(item.title)}</code>`
          : `Removed <code>${escapeHtml(item.title)}</code>`,
        { variant: state.favorites.has(id) ? "success" : "info", duration: 1600 }
      );
    }
  }

  /* ─────────────────────────────── Filtering ─────────────────────────────── */
  function matchesQuery(item, terms) {
    if (!terms.length) return true;
    const haystack = [
      item.title,
      item.description,
      item.id,
      CATEGORY_LABELS[item.category] || "",
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  }

  function queryTerms() {
    return state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  function getFiltered() {
    const terms = queryTerms();
    return ANIMATIONS.filter((item) => {
      if (state.favoritesOnly && !state.favorites.has(item.id)) return false;
      if (state.category !== "all" && item.category !== state.category) return false;
      return matchesQuery(item, terms);
    });
  }

  function countForCategory(categoryId) {
    const terms = queryTerms();
    return ANIMATIONS.filter((item) => {
      if (state.favoritesOnly && !state.favorites.has(item.id)) return false;
      if (categoryId !== "all" && item.category !== categoryId) return false;
      return matchesQuery(item, terms);
    }).length;
  }

  /* ───────────────────────────── Toolbar render ──────────────────────────── */
  function renderFilterPills() {
    if (!els.filterTrack) return;
    els.filterTrack.innerHTML = CATEGORIES.map((category) => {
      const count = countForCategory(category.id);
      const selected = state.category === category.id;
      return `<button class="pill" role="tab" type="button" data-category="${category.id}" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">
        <span>${escapeHtml(category.label)}</span>
        <span class="pill__count">${count}</span>
      </button>`;
    }).join("");

    // The indicator is absolutely positioned, so it must live inside the track.
    els.filterTrack.appendChild(els.filterIndicator);
    requestAnimationFrame(moveFilterIndicator);
  }

  function moveFilterIndicator() {
    if (!els.filterIndicator || !els.filterTrack) return;
    const active = $('.pill[aria-selected="true"]', els.filterTrack);
    if (!active) {
      els.filterIndicator.classList.remove("is-ready");
      return;
    }
    els.filterIndicator.style.width = `${active.offsetWidth}px`;
    els.filterIndicator.style.transform = `translateX(${active.offsetLeft}px)`;
    els.filterIndicator.classList.add("is-ready");
  }

  function syncToolbar() {
    const active = $('.pill[aria-selected="true"]', els.filterTrack);
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
    moveFilterIndicator();
  }

  /* ────────────────────────────── Gallery render ─────────────────────────── */
  function cardMarkup(item, index) {
    const motionBadge = MOTION_BADGES[item.motion] || "loop";
    const saved = state.favorites.has(item.id);
    const interactive = item.motion === "interactive";

    return `<article class="card${interactive ? " card--interactive" : ""}" data-id="${item.id}" style="--i:${Math.min(index, 12)}">
      <div class="card__stage" data-open="${item.id}" role="button" tabindex="0" aria-label="Open ${escapeHtml(item.title)} details">
        <span class="stage__badge stage__badge--${motionBadge}">${motionBadge}</span>
        <div class="stage__actions">
          <button class="icon-btn" type="button" data-open="${item.id}" aria-label="Open ${escapeHtml(item.title)} details" title="Open details">
            <svg class="icon"><use href="#i-expand"/></svg>
          </button>
        </div>
        <div class="stage__preview">${item.html}</div>
      </div>

      <div class="card__body">
        <div class="card__head">
          <button class="card__title-btn" type="button" data-open="${item.id}">${escapeHtml(item.title)}</button>
          <span class="card__tag">${escapeHtml(CATEGORY_LABELS[item.category])}</span>
        </div>
        <p class="card__desc">${escapeHtml(item.description)}</p>

        <div class="card__foot">
          <button class="icon-btn fav-btn" type="button" data-fav="${item.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove" : "Save"} animation" title="${saved ? "Remove from saved" : "Save animation"}">
            <svg class="icon"><use href="#i-bookmark"/></svg>
          </button>
          <div class="copy-group" role="group" aria-label="Copy ${escapeHtml(item.title)}">
            <button class="copy-chip" type="button" data-copy="html" data-copy-id="${item.id}" title="Copy HTML">HTML</button>
            <button class="copy-chip" type="button" data-copy="css" data-copy-id="${item.id}" title="Copy CSS">CSS</button>
            <button class="copy-chip" type="button" data-copy="tw" data-copy-id="${item.id}" title="Copy Tailwind">TW</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderGallery() {
    const list = getFiltered();
    state.list = list;

    if (els.grid) {
      els.grid.innerHTML = list.map(cardMarkup).join("");
      els.grid.removeAttribute("aria-busy");
    }

    if (els.skeleton) els.skeleton.remove();

    const hasResults = list.length > 0;
    if (els.empty) els.empty.hidden = hasResults;
    if (els.grid) els.grid.hidden = !hasResults;

    if (!hasResults && els.emptyText) {
      if (state.favoritesOnly) {
        els.emptyText.textContent =
          "You have not saved any animations in this view yet. Tap the bookmark on a card to keep it here.";
      } else if (state.query) {
        els.emptyText.textContent = `Nothing matches “${state.query}”. Try a broader keyword like “glow”, “card”, or “spinner”.`;
      } else {
        els.emptyText.textContent = "This category is empty. Clear your filters to see the whole collection.";
      }
    }

    if (els.resultCount) {
      els.resultCount.textContent = `${list.length} animation${list.length === 1 ? "" : "s"}`;
    }

    // Keep pills in sync without rebuilding them on every keystroke (counts
    // change with the query, so rebuild only the numbers).
    $$(".pill", els.filterTrack).forEach((pill) => {
      const count = countForCategory(pill.dataset.category);
      const badge = $(".pill__count", pill);
      if (badge) badge.textContent = String(count);
    });

    syncFavoriteUi();
    moveFilterIndicator();
  }

  /* ──────────────────────────────── Modal ────────────────────────────────── */
  function motionLabel(item) {
    return MOTION_LABELS[item.motion] || "Loop";
  }

  function codeNote(item) {
    if (modalState.tab === "html") {
      return "Paste this markup anywhere. Classes are prefixed to avoid collisions with your own styles.";
    }
    if (modalState.tab === "css") {
      return "Drop the CSS into any stylesheet. It is self-contained and respects prefers-reduced-motion via your own overrides.";
    }
    return item.twExtra
      ? "Tailwind v3+ markup. The addendum below is only needed for custom keyframes."
      : "Tailwind v3+ markup. Works with arbitrary values out of the box — no config changes.";
  }

  function renderCode() {
    if (!modalState.item) return;
    const item = modalState.item;
    const source = sourceFor(item, modalState.tab);
    const highlighted =
      modalState.tab === "css"
        ? highlightCss(source)
        : modalState.tab === "html"
        ? highlightHtml(source)
        : highlightTailwind(item);

    const code = els.codeBlock.querySelector("code");
    if (code) code.innerHTML = withLineNumbers(highlighted);

    $$(".tab", els.dialog).forEach((tab) => {
      const active = tab.dataset.tab === modalState.tab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (els.modalCopy) {
      const label = els.modalCopy.querySelector("span");
      if (label) label.textContent = `Copy ${TAB_LABELS[modalState.tab]}`;
      els.modalCopy.dataset.copy = modalState.tab;
      els.modalCopy.classList.remove("is-copied");
    }

    if (els.codeNote) els.codeNote.textContent = codeNote(item);
  }

  function setModalPreview(item) {
    if (!els.modalPreview) return;
    // Replacing markup restarts every CSS animation from frame zero.
    els.modalPreview.innerHTML = item.html;
    const motion = item.motion;
    const noHoverPointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none)").matches;

    if (motion === "hover" && noHoverPointer) {
      // Touch users have no pointer to hover with — play it once for them.
      playPreview();
    }
  }

  function playPreview() {
    if (!els.modalPreview) return;
    window.clearTimeout(modalState.playTimer);
    els.modalPreview.classList.add("is-playing");
    modalState.playTimer = window.setTimeout(() => {
      els.modalPreview.classList.remove("is-playing");
    }, 2600);
  }

  function renderModal(item) {
    modalState.item = item;

    if (els.modalCategory) els.modalCategory.textContent = CATEGORY_LABELS[item.category];
    if (els.modalTitle) els.modalTitle.textContent = item.title;
    if (els.modalDesc) els.modalDesc.textContent = item.description;
    if (els.modalTags) {
      els.modalTags.innerHTML = item.tags.map((tag) => `<li>#${escapeHtml(tag)}</li>`).join("");
    }
    if (els.modalDifficulty) els.modalDifficulty.textContent = item.difficulty;
    if (els.modalMotion) els.modalMotion.textContent = motionLabel(item);
    if (els.modalCatName) els.modalCatName.textContent = CATEGORY_LABELS[item.category];
    if (els.modalCounter) els.modalCounter.textContent = `${modalState.index + 1} / ${modalState.list.length}`;
    if (els.modalReplay) els.modalReplay.disabled = item.motion === "interactive";

    setModalPreview(item);
    renderCode();
    syncFavoriteUi();
  }

  function openModal(id, trigger) {
    const list = getFiltered();
    const index = list.findIndex((entry) => entry.id === id);
    if (index === -1) return;

    modalState.list = list;
    modalState.index = index;
    modalState.tab = "html";
    lastFocused = trigger || document.activeElement;

    renderModal(list[index]);

    if (typeof els.dialog.showModal === "function") {
      if (!els.dialog.open) els.dialog.showModal();
    } else {
      els.dialog.setAttribute("open", "");
    }

    document.body.classList.add("modal-open");
    if (els.modalPanel) els.modalPanel.scrollTop = 0;
  }

  function closeModal() {
    if (typeof els.dialog.close === "function") els.dialog.close();
    else els.dialog.removeAttribute("open");
  }

  function stepModal(direction) {
    if (!modalState.list.length) return;
    modalState.index =
      (modalState.index + direction + modalState.list.length) % modalState.list.length;
    renderModal(modalState.list[modalState.index]);
    if (els.modalPanel) els.modalPanel.scrollTop = 0;
    if (els.modalPanel) {
      const scrollArea = $(".modal__scroll", els.dialog);
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  }

  function onDialogClosed() {
    document.body.classList.remove("modal-open");

    // Drop the deep-link fragment so a refresh does not reopen the dialog.
    if (location.hash.startsWith("#anim-") && window.history.replaceState) {
      window.history.replaceState(null, "", location.pathname + location.search);
    }

    window.clearTimeout(modalState.playTimer);
    if (els.modalPreview) {
      els.modalPreview.classList.remove("is-playing");
      els.modalPreview.innerHTML = "";
    }
    modalState.item = null;
    renderGallery(); // Favourites / filters may have changed while open.
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  /* ────────────────────────────── Pause motion ───────────────────────────── */
  function applyPaused(paused, announce) {
    state.paused = paused;
    document.documentElement.classList.toggle("is-paused", paused);
    writeStorage(STORAGE_KEYS.paused, paused ? "1" : "0");

    if (els.motionToggle) {
      els.motionToggle.setAttribute("aria-pressed", String(paused));
      els.motionToggle.setAttribute("aria-label", paused ? "Play all animations" : "Pause all animations");
      els.motionToggle.title = paused ? "Play preview animations" : "Pause preview animations";
    }

    if (announce) {
      toast(paused ? "Previews paused" : "Previews playing", { variant: "info", duration: 1400 });
    }
  }

  /* ───────────────────────────── Event wiring ────────────────────────────── */
  function bindEvents() {
    /* Search --------------------------------------------------------------- */
    if (els.search) {
      els.search.addEventListener("input", () => {
        state.query = els.search.value;
        if (els.searchClear) els.searchClear.hidden = state.query.length === 0;
        renderGallery();
      });

      els.search.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          if (state.query) {
            state.query = "";
            els.search.value = "";
            if (els.searchClear) els.searchClear.hidden = true;
            renderGallery();
          } else {
            els.search.blur();
          }
        }
      });
    }

    if (els.searchClear) {
      els.searchClear.addEventListener("click", () => {
        state.query = "";
        if (els.search) {
          els.search.value = "";
          els.search.focus();
        }
        els.searchClear.hidden = true;
        renderGallery();
      });
    }

    $$("[data-search]").forEach((button) => {
      button.addEventListener("click", () => {
        state.query = button.dataset.search || "";
        if (els.search) {
          els.search.value = state.query;
          els.search.focus();
        }
        if (els.searchClear) els.searchClear.hidden = false;
        renderGallery();
        $("#gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    /* Category pills (delegated so re-renders keep working) ------------------ */
    if (els.filterTrack) {
      els.filterTrack.addEventListener("click", (event) => {
        const pill = event.target.closest(".pill");
        if (!pill) return;
        state.category = pill.dataset.category;
        $$(".pill", els.filterTrack).forEach((entry) => {
          const selected = entry === pill;
          entry.setAttribute("aria-selected", String(selected));
          entry.tabIndex = selected ? 0 : -1;
        });
        renderGallery();
        syncToolbar();
      });

      // Arrow-key navigation across the tablist.
      els.filterTrack.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        const pills = $$(".pill", els.filterTrack);
        const current = pills.findIndex((pill) => pill.getAttribute("aria-selected") === "true");
        if (current === -1) return;
        event.preventDefault();
        const next = (current + (event.key === "ArrowRight" ? 1 : -1) + pills.length) % pills.length;
        pills[next].focus();
        pills[next].click();
      });
    }

    /* Favourites filter ----------------------------------------------------- */
    if (els.favoritesToggle) {
      els.favoritesToggle.addEventListener("click", () => {
        state.favoritesOnly = !state.favoritesOnly;
        els.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
        renderGallery();
      });
    }

    if (els.emptyReset) {
      els.emptyReset.addEventListener("click", () => {
        state.query = "";
        state.category = "all";
        state.favoritesOnly = false;
        if (els.search) els.search.value = "";
        if (els.searchClear) els.searchClear.hidden = true;
        if (els.favoritesToggle) els.favoritesToggle.setAttribute("aria-pressed", "false");
        $$(".pill", els.filterTrack).forEach((pill) => {
          const selected = pill.dataset.category === "all";
          pill.setAttribute("aria-selected", String(selected));
          pill.tabIndex = selected ? 0 : -1;
        });
        renderGallery();
      });
    }

    /* Grid interactions (delegated) ----------------------------------------- */
    if (els.grid) {
      els.grid.addEventListener("click", (event) => {
        // Stop demo links from navigating the whole page.
        const anchor = event.target.closest(".stage__preview a");
        if (anchor) {
          event.preventDefault();
          if (anchor.getAttribute("href") === "#") return;
        }

        const fav = event.target.closest("[data-fav]");
        if (fav) {
          event.stopPropagation();
          toggleFavorite(fav.dataset.fav, true);
          if (state.favoritesOnly) renderGallery();
          return;
        }

        const copyChip = event.target.closest("[data-copy]");
        if (copyChip) {
          const item = ANIMATIONS.find((entry) => entry.id === copyChip.dataset.copyId);
          if (item) copySnippet(item, copyChip.dataset.copy, copyChip);
          return;
        }

        const card = event.target.closest(".card");
        if (!card) return;
        const item = ANIMATIONS.find((entry) => entry.id === card.dataset.id);
        if (!item) return;

        const insidePreview = event.target.closest(".stage__preview");

        // Interactive previews (toggles, inputs, segmented controls) should be
        // usable directly on the card.
        if (item.motion === "interactive" && insidePreview) {
          if (event.target.closest("input, select, textarea, label, button, a")) return;
        }

        const openTrigger = event.target.closest("[data-open]");
        if (openTrigger) {
          openModal(item.id, openTrigger);
        }
      });

      els.grid.addEventListener("keydown", (event) => {
        const target = event.target.closest("[data-open]");
        if (!target) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target.closest(".stage__preview")) return;
        event.preventDefault();
        openModal(target.dataset.open, target);
      });

      // Cursor spotlight on cards.
      els.grid.addEventListener("pointermove", (event) => {
        const card = event.target.closest(".card");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    }

    /* Modal ----------------------------------------------------------------- */
    if (els.dialog) {
      els.dialog.addEventListener("close", onDialogClosed);
      els.dialog.addEventListener("cancel", () => {
        // Native Escape handling closes the dialog; nothing else to do.
      });
      els.dialog.addEventListener("click", (event) => {
        if (event.target === els.dialog) closeModal();
      });
    }

    if (els.modalClose) els.modalClose.addEventListener("click", closeModal);
    if (els.modalPrev) els.modalPrev.addEventListener("click", () => stepModal(-1));
    if (els.modalNext) els.modalNext.addEventListener("click", () => stepModal(1));

    if (els.modalFav) {
      els.modalFav.addEventListener("click", () => {
        if (!modalState.item) return;
        toggleFavorite(modalState.item.id, true);
      });
    }

    if (els.modalCopy) {
      els.modalCopy.addEventListener("click", () => {
        if (modalState.item) copySnippet(modalState.item, modalState.tab, els.modalCopy);
      });
    }

    if (els.modalReplay) {
      els.modalReplay.addEventListener("click", () => {
        if (!modalState.item) return;
        setModalPreview(modalState.item);
        playPreview();
      });
    }

    if (els.dialog) {
      $$(".tab", els.dialog).forEach((tab) => {
        tab.addEventListener("click", () => {
          modalState.tab = tab.dataset.tab;
          renderCode();
        });
      });
    }

    // Arrow-key browsing inside the dialog.
    document.addEventListener("keydown", (event) => {
      if (!els.dialog || !els.dialog.open) return;
      const tag = (event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepModal(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepModal(-1);
      } else if (event.key === "r" || event.key === "R") {
        if (modalState.item) {
          setModalPreview(modalState.item);
          playPreview();
        }
      }
    });

    /* Theme / pause --------------------------------------------------------- */
    if (els.themeToggle) {
      els.themeToggle.addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark", true);
      });
    }

    if (els.motionToggle) {
      els.motionToggle.addEventListener("click", () => applyPaused(!state.paused, true));
    }

    /* Global shortcuts ------------------------------------------------------ */
    document.addEventListener("keydown", (event) => {
      const tag = (event.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || event.target.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        els.search?.focus();
        els.search?.select();
        return;
      }

      if (event.key === "/" && !typing && !els.dialog?.open) {
        event.preventDefault();
        els.search?.focus();
      }
    });

    /* Keep the active filter indicator aligned ------------------------------ */
    let resizeFrame = null;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(moveFilterIndicator);
    });

    // Recalculate once webfonts / layout settle.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(moveFilterIndicator));
    }
  }

  /* ───────────────────────────────── Boot ────────────────────────────────── */
  function init() {
    // Theme: stored preference wins; otherwise stay in the designed dark mode.
    const storedTheme = readStorage(STORAGE_KEYS.theme, "dark");
    applyTheme(storedTheme === "light" ? "light" : "dark", false);

    loadFavorites();
    injectAnimationStyles();
    bindEvents();

    if (els.year) els.year.textContent = String(new Date().getFullYear());

    // Keep hero counters honest.
    $$("[data-count]").forEach((node) => {
      node.textContent = String(ANIMATIONS.length);
    });

    // Pause preference from a previous visit.
    applyPaused(readStorage(STORAGE_KEYS.paused, "0") === "1", false);

    renderFilterPills();
    renderGallery();

    if (els.favoritesToggle) {
      els.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
    }

    // Deep links: /#anim-aurora-glow opens the detail dialog, now and on change.
    window.setTimeout(openFromHash, 60);
    window.addEventListener("hashchange", openFromHash);
  }

  function openFromHash() {
    if (!location.hash.startsWith("#anim-")) return;
    const id = location.hash.replace("#anim-", "");
    if (!ANIMATIONS.some((item) => item.id === id)) return;
    if (modalState.item && modalState.item.id === id && els.dialog.open) return;
    openModal(id, null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
