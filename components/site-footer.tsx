import Link from "next/link";
import { SparkLogo, GithubIcon } from "./icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-soft/60">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <SparkLogo className="h-7 w-7" />
              <span className="text-base font-semibold tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {site.shortDescription}
            </p>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <GithubIcon className="h-4 w-4" />
              View source on GitHub
            </a>
          </div>

          <FooterColumn
            title="Library"
            links={[
              { label: "All animations", href: "/animations" },
              { label: "Entrances", href: "/animations#entrance" },
              { label: "Micro-interactions", href: "/animations#hover" },
              { label: "Loaders", href: "/animations#loader" },
            ]}
          />
          <FooterColumn
            title="Tools"
            links={[
              { label: "Easing editor", href: "/tools/easing" },
              { label: "Gradient studio", href: "/tools/gradient" },
              { label: "Shadow lab", href: "/tools/shadow" },
              { label: "Glass forge", href: "/tools/glass" },
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              { label: "CSS animation docs", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation" },
              { label: "Tailwind transitions", href: "https://tailwindcss.com/docs/transition-property" },
              { label: "Vercel", href: "https://vercel.com" },
              { label: "MIT license", href: `${site.github}/blob/main/LICENSE` },
            ]}
            external
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Crafted by {site.author}.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Zero dependencies · deploy-ready on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  external = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            {external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-fg-soft/80 transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="text-fg-soft/80 transition-colors hover:text-fg">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
