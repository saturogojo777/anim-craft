import Link from "next/link";
import { AnimationCardMini } from "@/components/animation-card-mini";
import { CodeBlock } from "@/components/code-block";
import { ToolCard } from "@/components/tool-card";
import {
  AccessibilityIcon,
  ArrowRight,
  ArrowUpRight,
  BoltIcon,
  CodeIcon,
  PackageIcon,
} from "@/components/icons";
import {
  animations,
  animationCount,
  categories,
  cssSnippet,
  findAnimation,
} from "@/lib/animations";
import { site } from "@/lib/site";

const featuredSlugs = ["fade-up", "scale-in", "pop-in", "gradient-pan", "spin", "text-shimmer"];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => findAnimation(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sample = findAnimation("fade-up");

  return (
    <div>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-accent-2/10 blur-3xl"
        />

        <div className="container-page relative grid gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[11px] text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              v1.0 — {animationCount} animations · 4 generators
            </span>

            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl">
              Motion, <span className="text-gradient">crafted</span>
              <br />
              for the web.
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              A curated library of copy-paste CSS and Tailwind keyframe animations, plus four
              generators for the details that are hardest to tune by hand. No runtime, no
              dependencies, no lock-in.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/animations"
                className="group inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                Browse the library
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                <BoltIcon className="h-4 w-4 text-accent" />
                Open the tools
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                [String(animationCount), "keyframes"],
                ["4", "generators"],
                ["0", "dependencies"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-semibold tracking-tight">{value}</dt>
                  <dd className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* preview studio */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2.5rem] opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 60%, transparent), transparent)",
              }}
            />
            <div className="surface-card relative p-3 shadow-[0_40px_80px_-48px_var(--shadow-color)]">
              <div className="flex items-center justify-between border-b border-line px-1 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-3/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-2/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    preview.css
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">live</span>
              </div>

              <div className="relative mt-3 h-[336px] overflow-hidden rounded-xl border border-line bg-bg-soft">
                <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-80" />
                <div
                  aria-hidden="true"
                  className="animate-drift absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #8b7bff, #22d3ee, #f472b6, #8b7bff)",
                  }}
                />

                <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6">
                  <div className="ac-run-fade-up w-full max-w-[15rem] rounded-2xl border border-line-strong bg-surface/95 p-4 shadow-2xl backdrop-blur">
                    <div className="flex items-center gap-2.5">
                      <span className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]" />
                      <div className="space-y-1.5">
                        <span className="block h-2 w-24 rounded-full bg-line-strong" />
                        <span className="block h-2 w-14 rounded-full bg-line" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <span className="block h-1.5 w-full rounded-full bg-line" />
                      <span className="block h-1.5 w-4/5 rounded-full bg-line" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="h-6 w-16 rounded-md bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]" />
                      <span className="h-6 w-12 rounded-md border border-line" />
                    </div>
                  </div>

                  <div
                    className="ac-run-fade-up flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-[10px] text-muted backdrop-blur"
                    style={{ animationDelay: "180ms" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    fade-up · 620ms · snappy
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-line bg-[var(--code-bg)] px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">
                <span className="text-accent-2">.fade-up</span> {"{"}
                <br />
                <span className="pl-4 text-accent-3">animation</span>: fade-up{" "}
                <span className="text-fg-soft">620ms</span> cubic-bezier(
                <span className="text-fg-soft">0.16, 1, 0.3, 1</span>) both;
                <br />
                {"}"}
              </div>
            </div>

            <span className="absolute -left-3 top-20 -rotate-[7deg] rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[10px] text-fg-soft shadow-lg">
              CSS
            </span>
            <span className="absolute -right-3 bottom-24 rotate-[5deg] rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[10px] text-fg-soft shadow-lg">
              Tailwind
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- categories */}
      <section className="border-y border-line bg-bg-soft/60">
        <div className="container-page flex flex-wrap items-center gap-2 py-4">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Browse
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/animations#${category.id}`}
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {category.label}
              <span className="ml-1.5 font-mono text-[10px] text-muted/70">
                {animations.filter((item) => item.category === category.id).length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ featured */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              The library
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Forty keyframes, zero ceremony.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Every animation is written by hand, previewed at real speed, and shipped with a{" "}
              <code className="font-mono text-fg-soft">prefers-reduced-motion</code> guard.
            </p>
          </div>
          <Link
            href="/animations"
            className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
          >
            See all {animationCount}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((def) => (
            <AnimationCardMini key={def.slug} def={def} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- tools */}
      <section className="border-y border-line bg-bg-soft/60">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                Generators
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Tune the details in the browser.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Easing, gradients, shadows, and glass. Drag a control, copy the output — no
                accounts, no uploads.
              </p>
            </div>
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
            >
              All tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      {/* ------------------------------------------------------------- promise */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              Built to paste
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Small CSS. Real interfaces.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              AnimCraft is not a framework. It is a set of well-behaved snippets you can read in
              one sitting and delete without a migration plan.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                {
                  icon: CodeIcon,
                  title: "CSS and Tailwind, side by side",
                  body: "Copy a complete class or the equivalent arbitrary utility — both stay in sync with your preview settings.",
                },
                {
                  icon: AccessibilityIcon,
                  title: "Motion-safe by default",
                  body: "Every snippet ends with a prefers-reduced-motion guard, so vestibular-sensitive users get stillness, not surprise.",
                },
                {
                  icon: PackageIcon,
                  title: "No runtime, no build step",
                  body: "The whole library is CSS. The tools are a few kilobytes of React that run entirely in your browser.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface/70 px-4 py-3">
              <span className="text-xs text-muted">Three ways to use any animation</span>
              <span className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                CSS · Tailwind · HTML
              </span>
            </div>
            {sample && <CodeBlock code={cssSnippet(sample)} language="css" filename="fade-up.css" maxHeight="24rem" />}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-surface/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Tailwind</p>
                <code className="mt-1 block break-all font-mono text-[10px] leading-relaxed text-fg-soft">
                  animate-[fade-up_620ms_cubic-bezier(0.16,1,0.3,1)_both]
                </code>
              </div>
              <div className="rounded-xl border border-line bg-surface/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Markup</p>
                <code className="mt-1 block font-mono text-[10px] leading-relaxed text-fg-soft">
                  &lt;div class=&quot;fade-up&quot;&gt;…&lt;/div&gt;
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-10 sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "conic-gradient(from 90deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))",
            }}
          />
          <div
            aria-hidden="true"
            className="dot-grid pointer-events-none absolute inset-0 opacity-40"
          />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ship your next interaction in the next five minutes.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pick a keyframe, copy the snippet, tune it with the generators. Everything is MIT
              licensed and ready to deploy — this site is a single Next.js app on Vercel.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/animations"
                className="group inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                Browse animations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/tools/easing"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm font-medium text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                Try the easing editor
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
