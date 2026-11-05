import Link from "next/link";
import { PreviewObject } from "./animation-preview";
import { categoryLabel, type AnimationDef } from "@/lib/animations";
import { ArrowUpRight } from "./icons";

export function AnimationCardMini({ def }: { def: AnimationDef }) {
  return (
    <Link
      href={`/animations#${def.category}`}
      className="surface-card card-lift group flex flex-col overflow-hidden"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-line bg-bg-soft">
        <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 75%)",
          }}
        />
        <div className="relative z-10">
          <PreviewObject def={def} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight">{def.name}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted">
            {categoryLabel(def.category)} · {def.duration}ms
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-fg" />
      </div>
    </Link>
  );
}
