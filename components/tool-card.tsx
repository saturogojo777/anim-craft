import Link from "next/link";
import { ArrowUpRight } from "./icons";
import type { ToolSlug } from "@/lib/site";

const visuals: Record<ToolSlug, () => React.ReactElement> = {
  easing: () => (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
      <rect x="24" y="18" width="152" height="84" rx="8" fill="none" stroke="var(--line-strong)" strokeDasharray="3 4" />
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={t}>
          <line x1={24 + t * 152} y1="18" x2={24 + t * 152} y2="102" stroke="var(--line)" />
          <line x1="24" y1={18 + t * 84} x2="176" y2={18 + t * 84} stroke="var(--line)" />
        </g>
      ))}
      <path d="M24 102 C 52 34, 96 22, 176 18" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="102" x2="52" y2="34" stroke="var(--accent)" strokeOpacity="0.35" strokeDasharray="3 3" />
      <line x1="176" y1="18" x2="96" y2="22" stroke="var(--accent-2)" strokeOpacity="0.35" strokeDasharray="3 3" />
      <circle cx="52" cy="34" r="5" fill="var(--accent)" />
      <circle cx="96" cy="22" r="5" fill="var(--accent-2)" />
    </svg>
  ),
  gradient: () => (
    <div
      className="h-full w-full rounded-xl"
      style={{ backgroundImage: "linear-gradient(135deg, #8b7bff, #22d3ee 52%, #f472b6)" }}
    >
      <div className="flex h-full items-end justify-between p-3">
        <span className="rounded-full bg-black/25 px-2 py-0.5 font-mono text-[10px] text-white/90">
          135deg
        </span>
        <span className="flex gap-1">
          {["#8b7bff", "#22d3ee", "#f472b6"].map((color) => (
            <span key={color} className="h-4 w-4 rounded-full border border-white/50" style={{ backgroundColor: color }} />
          ))}
        </span>
      </div>
    </div>
  ),
  shadow: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="h-20 w-32 rounded-2xl border border-line bg-surface p-3"
        style={{ boxShadow: "0 24px 44px -20px rgba(0,0,0,0.65), 0 2px 6px -2px rgba(0,0,0,0.3)" }}
      >
        <span className="block h-1.5 w-16 rounded-full bg-line-strong" />
        <span className="mt-2 block h-1.5 w-10 rounded-full bg-line" />
      </div>
    </div>
  ),
  glass: () => (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl p-3"
      style={{
        background:
          "radial-gradient(60% 60% at 20% 20%, #8b7bff 0%, transparent 60%), radial-gradient(60% 60% at 80% 70%, #22d3ee 0%, transparent 60%), #0b0b16",
      }}
    >
      <div className="h-16 w-32 rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
        <span className="block h-1.5 w-14 rounded-full bg-white/40" />
        <span className="mt-2 block h-1.5 w-20 rounded-full bg-white/25" />
        <span className="mt-2 block h-1.5 w-10 rounded-full bg-white/20" />
      </div>
    </div>
  ),
};

export function ToolCard({
  slug,
  name,
  tagline,
  href,
}: {
  slug: ToolSlug;
  name: string;
  tagline: string;
  href: string;
}) {
  const Visual = visuals[slug];
  return (
    <Link href={href} className="surface-card card-lift group flex flex-col overflow-hidden">
      <div className="dot-grid relative h-40 border-b border-line bg-bg-soft p-3">
        <Visual />
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{tagline}</p>
        </div>
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors group-hover:border-line-strong group-hover:text-fg">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
