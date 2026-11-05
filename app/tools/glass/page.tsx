import type { Metadata } from "next";
import { GlassForge } from "@/components/tools/glass-forge";
import { ToolHeader } from "@/components/tool-header";

export const metadata: Metadata = {
  title: "Glass forge",
  description:
    "Design glassmorphism panels with blur, saturation, tint, and border controls over four backdrops, then copy the CSS.",
  alternates: { canonical: "/tools/glass" },
};

export default function GlassPage() {
  return (
    <div>
      <ToolHeader
        eyebrow="Material"
        title="Glass forge"
        description="Frosted glass is all balance: enough blur to soften the backdrop, enough tint to keep text legible. Tune both over four live backdrops."
      />
      <GlassForge />
    </div>
  );
}
