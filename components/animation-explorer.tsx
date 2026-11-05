"use client";

import { useEffect, useMemo, useState } from "react";
import {
  animations,
  categories,
  defaultMotion,
  type AnimationCategory,
  type MotionSettings,
} from "@/lib/animations";
import { easingPresets } from "@/lib/easings";
import { AnimationCard } from "./animation-card";
import { RefreshIcon, SearchIcon } from "./icons";
import { Select } from "./ui";
import { cn } from "@/lib/utils";

type Filter = "all" | AnimationCategory;

export function AnimationExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [override, setOverride] = useState<MotionSettings | null>(null);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (categories.some((category) => category.id === hash)) {
      setFilter(hash as AnimationCategory);
    }
  }, []);

  const counts = useMemo(() => {
    const map = new Map<AnimationCategory, number>();
    animations.forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + 1));
    return map;
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return animations.filter((item) => {
      const matchesCategory = filter === "all" || item.category === filter;
      if (!matchesCategory) return false;
      if (!needle) return true;
      const haystack = [item.name, item.slug, item.summary, item.category, ...(item.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, filter]);

  const settings = override ?? defaultMotion;
  const loop = settings.iterations === "infinite";

  const update = (patch: Partial<MotionSettings>) => {
    setOverride((previous) => ({ ...(previous ?? defaultMotion), ...patch }));
    setRunKey((value) => value + 1);
  };

  const reset = () => {
    setOverride(null);
    setRunKey((value) => value + 1);
  };

  const easingOptions = easingPresets.map((preset) => ({
    label: preset.name,
    value: preset.value,
    group: preset.group,
  }));

  return (
    <div className="container-page pb-24 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Animation library</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {animations.length} hand-tuned keyframe animations. Preview them with your own timing,
            then copy the CSS or the Tailwind utility straight into your project.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono">
            {results.length} shown
          </span>
          <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono">
            {animations.length} total
          </span>
        </div>
      </div>

      {/* search + filters */}
      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search animations, tags, use cases…"
            aria-label="Search animations"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted/70 hover:border-line-strong focus:border-accent"
          />
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} count={animations.length}>
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              active={filter === category.id}
              onClick={() => setFilter(category.id)}
              count={counts.get(category.id) ?? 0}
            >
              {category.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* playback */}
      <div className="mt-4 rounded-2xl border border-line bg-surface/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Playback
            </h2>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 font-mono text-[10px]",
                override
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line bg-surface-2 text-muted",
              )}
            >
              {override ? "custom" : "recommended"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRunKey((value) => value + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Replay all
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line hover:text-fg"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1">
            <span className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-fg-soft">Duration</span>
              <span className="font-mono text-[11px] text-muted">{settings.duration}ms</span>
            </span>
            <input
              type="range"
              min={100}
              max={4000}
              step={20}
              value={settings.duration}
              aria-label="Animation duration"
              onChange={(event) => update({ duration: Number(event.target.value) })}
              className="w-full"
              style={
                {
                  "--range-progress": `${((settings.duration - 100) / 3900) * 100}%`,
                } as React.CSSProperties
              }
            />
          </label>

          <label className="space-y-1">
            <span className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-fg-soft">Delay</span>
              <span className="font-mono text-[11px] text-muted">{settings.delay}ms</span>
            </span>
            <input
              type="range"
              min={0}
              max={1500}
              step={10}
              value={settings.delay}
              aria-label="Animation delay"
              onChange={(event) => update({ delay: Number(event.target.value) })}
              className="w-full"
              style={
                {
                  "--range-progress": `${(settings.delay / 1500) * 100}%`,
                } as React.CSSProperties
              }
            />
          </label>

          <Select
            label="Easing"
            value={settings.easing}
            options={easingOptions}
            onChange={(value) => update({ easing: value })}
          />

          <div className="flex flex-col justify-between gap-2">
            <span className="text-xs font-medium text-fg-soft">Loop</span>
            <button
              type="button"
              aria-pressed={loop}
              onClick={() => update({ iterations: loop ? 1 : "infinite" })}
              className={cn(
                "inline-flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                loop
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-line bg-surface-2 text-fg-soft hover:border-line-strong",
              )}
            >
              {loop ? "Playing on repeat" : "Play once"}
              <span
                className={cn(
                  "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                  loop ? "border-accent/60 bg-accent/30" : "border-line-strong",
                )}
              >
                {loop && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </span>
            </button>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Recommended timing ships with each animation; moving these sliders applies one timing to
          every preview and to the snippets you copy. Copied CSS always includes a{" "}
          <code className="font-mono text-fg-soft">prefers-reduced-motion</code> guard.
        </p>
      </div>

      {/* grid */}
      {results.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((def) => (
            <AnimationCard
              key={def.slug}
              def={def}
              settings={override ?? undefined}
              runKey={runKey}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong py-16 text-center">
          <p className="text-sm font-medium">No animations match “{query}”.</p>
          <p className="max-w-sm text-xs text-muted">
            Try a broader term like “fade”, “hover”, “loader”, or clear the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-1 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium hover:border-line-strong"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-fg/20 bg-fg text-bg"
          : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
      <span className={cn("font-mono text-[10px]", active ? "text-bg/70" : "text-muted/70")}>
        {count}
      </span>
    </button>
  );
}
