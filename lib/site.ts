export const site = {
  name: "AnimCraft",
  tagline: "Motion, crafted for the web.",
  description:
    "A modern toolkit of copy-paste CSS and Tailwind animations, micro-interactions, and visual generators. Zero dependencies, reduced-motion aware, ready to ship.",
  shortDescription:
    "Copy-paste CSS & Tailwind animations, micro-interactions, and generators for modern interfaces.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anim-craft.vercel.app",
  github: "https://github.com/saturogojo777/anim-craft",
  author: "saturogojo777",
  nav: [
    { href: "/animations", label: "Animations" },
    { href: "/tools", label: "Tools" },
  ],
  tools: [
    {
      slug: "easing",
      name: "Easing Editor",
      tagline: "Drag a cubic-bézier curve and feel the timing.",
      href: "/tools/easing",
      accent: "from-violet-500/25 to-fuchsia-500/10",
    },
    {
      slug: "gradient",
      name: "Gradient Studio",
      tagline: "Multi-stop linear, radial, and conic gradients.",
      href: "/tools/gradient",
      accent: "from-cyan-400/25 to-emerald-400/10",
    },
    {
      slug: "shadow",
      name: "Shadow Lab",
      tagline: "Layered, realistic elevation in a few clicks.",
      href: "/tools/shadow",
      accent: "from-amber-400/25 to-rose-400/10",
    },
    {
      slug: "glass",
      name: "Glass Forge",
      tagline: "Frosted panels with tasteful blur and borders.",
      href: "/tools/glass",
      accent: "from-sky-400/25 to-indigo-500/10",
    },
  ],
} as const;

export type ToolSlug = (typeof site.tools)[number]["slug"];
