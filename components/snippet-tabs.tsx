"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import type { HighlightLanguage } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export interface Snippet {
  id: string;
  label: string;
  code: string;
  language?: HighlightLanguage;
  filename?: string;
}

export function SnippetTabs({
  snippets,
  maxHeight = "18rem",
}: {
  snippets: Snippet[];
  maxHeight?: string;
}) {
  const [activeId, setActiveId] = useState(snippets[0]?.id);
  const active = snippets.find((snippet) => snippet.id === activeId) ?? snippets[0];
  if (!active) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex w-fit max-w-full overflow-x-auto rounded-lg border border-line bg-surface-2 p-0.5">
          {snippets.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              onClick={() => setActiveId(snippet.id)}
              aria-pressed={snippet.id === active.id}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                snippet.id === active.id ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              {snippet.label}
            </button>
          ))}
        </div>
        <CopyButton value={active.code} label="Copy snippet" ariaLabel={`Copy ${active.label}`} />
      </div>
      <CodeBlock
        code={active.code}
        language={active.language ?? "css"}
        filename={active.filename ?? active.label.toLowerCase()}
        showLineNumbers
        showCopy={false}
        maxHeight={maxHeight}
      />
    </div>
  );
}
