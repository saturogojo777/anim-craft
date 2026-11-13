import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { ToolIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Design tools",
  description:
    "Free, browser-based generators for easing curves, gradients, layered shadows, and glassmorphism. Copy production-ready CSS or Tailwind.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-bg-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent), transparent 70%)",
          }}
        />
        <div className="container-page relative py-14 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Generators
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Design the details, <span className="text-gradient">copy the code.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Four focused tools for the parts of an interface that are hardest to tune by hand.
            Everything runs locally in your browser — no accounts, no uploads, no build step.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.tools.map((tool) => (
              <a
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                <ToolIcon slug={tool.slug} className="h-3.5 w-3.5 text-accent" />
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {site.tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              name={tool.name}
              tagline={tool.tagline}
              href={tool.href}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Copy CSS or Tailwind",
              body: "Every generator emits a self-contained CSS class plus the equivalent Tailwind arbitrary utility.",
            },
            {
              title: "Keyboard friendly",
              body: "Controls are real inputs with labels, so you can dial values in without a mouse.",
            },
            {
              title: "Nothing leaves the page",
              body: "No telemetry, no network requests. The tools are plain client-side React.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-surface/60 p-4">
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
