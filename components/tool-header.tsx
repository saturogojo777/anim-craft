import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

export function ToolHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-bg-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)",
        }}
      />
      <div className="container-page relative py-10 sm:py-14">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          All tools
        </Link>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        {children}
      </div>
    </div>
  );
}
