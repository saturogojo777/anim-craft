import type { Metadata } from "next";
import { AnimationExplorer } from "@/components/animation-explorer";
import { animations } from "@/lib/animations";

export const metadata: Metadata = {
  title: "Animation library",
  description:
    "A searchable library of hand-tuned CSS keyframe animations and micro-interactions with copy-paste CSS and Tailwind output.",
  alternates: { canonical: "/animations" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AnimCraft animation library",
  description: `A curated collection of ${animations.length} CSS keyframe animations and micro-interactions.`,
  numberOfItems: animations.length,
};

export default function AnimationsPage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <AnimationExplorer />
      </div>
    </div>
  );
}
