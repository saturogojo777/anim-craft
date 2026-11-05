"use client";

import { useMemo, useState } from "react";
import {
  cssSnippet,
  htmlSnippet,
  tailwindSnippet,
  categoryLabel,
  type AnimationDef,
  type MotionSettings,
} from "@/lib/animations";
import { PreviewObject } from "./animation-preview";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { CodeIcon, RefreshIcon } from "./icons";
import { cn } from "@/lib/utils";

type Tab = "css" | "tailwind" | "html";

const tabs: { id: Tab; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "html", label: "HTML" },
];

export function AnimationCard({
  def,
  settings,
  runKey,
}: {
  def: AnimationDef;
  settings?: MotionSettings;
  runKey: number;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("css");
  const [replay, setReplay] = useState(0);

  const snippets = useMemo(
    () => ({
      css: cssSnippet(def, settings),
      tailwind: tailwindSnippet(def, settings),
      html: htmlSnippet(def),
    }),
    [def, settings],
  );

  const isHover = def.trigger === "hover";

  return (
    <article className="surface-card card-lift flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight">{def.name}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted">
            {categoryLabel(def.category)}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-line bg-surface-2 px-1.5 py-1 font-mono text-[10px] text-muted">
          {def.duration}ms
        </span>
      </div>

      <div className="relative mx-4 mt-3 flex h-40 items-center justify-center overflow-hidden rounded-xl border border-line bg-bg-soft">
        <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 75%)",
          }}
        />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
          <PreviewObject def={def} key={`${def.slug}-${runKey}-${replay}`} />
        </div>

        <button
          type="button"
          onClick={() => setReplay((value) => value + 1)}
          aria-label={`Replay ${def.name}`}
          title="Replay"
          className="absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface/80 text-muted backdrop-blur transition-colors hover:border-line-strong hover:text-fg"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
        </button>

        {isHover && (
          <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-line bg-surface/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur">
            Hover the preview
          </span>
        )}
      </div>

      <p className="px-4 pt-3 text-xs leading-relaxed text-muted">{def.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 px-4 pb-4 pt-3">
        <CopyButton value={snippets.css} label="CSS" ariaLabel={`Copy ${def.name} CSS`} />
        <CopyButton
          value={snippets.tailwind}
          label="Tailwind"
          ariaLabel={`Copy ${def.name} Tailwind`}
        />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium transition-colors",
            open
              ? "border-line-strong bg-surface-2 text-fg"
              : "bg-transparent text-fg-soft hover:border-line-strong hover:text-fg",
          )}
        >
          <CodeIcon className="h-3.5 w-3.5" />
          {open ? "Hide code" : "View code"}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg-soft/60 p-3">
          <div className="mb-2 flex w-fit rounded-lg border border-line bg-surface-2 p-0.5">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  tab === item.id ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <CodeBlock
            code={snippets[tab]}
            language={tab === "html" ? "html" : tab === "tailwind" ? "css" : "css"}
            filename={tab === "css" ? `${def.slug}.css` : tab === "tailwind" ? "markup" : "markup"}
            showLineNumbers
            maxHeight="18rem"
          />
        </div>
      )}
    </article>
  );
}
