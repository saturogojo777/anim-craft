"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, GithubIcon, MenuIcon, SparkLogo } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <SparkLogo className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[18deg]" />
          <span className="text-[15px] font-semibold tracking-tight">
            {site.name}
            <span className="ml-1.5 rounded-md border border-line px-1.5 py-0.5 align-middle font-mono text-[10px] font-normal uppercase tracking-widest text-muted">
              v1
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-surface-2 text-fg"
                  : "text-muted hover:bg-surface-2/60 hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub repository"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-2/60 text-fg-soft transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <Link
            href="/animations"
            className="hidden items-center gap-1.5 rounded-xl bg-fg px-3.5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Browse library
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-2/60 text-fg-soft md:hidden"
          >
            {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-bg-soft md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-surface-2 text-fg"
                    : "text-muted hover:bg-surface-2/60 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted hover:text-fg"
            >
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
            <Link
              href="/animations"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-fg px-3.5 py-2.5 text-sm font-medium text-bg"
            >
              Browse library
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
