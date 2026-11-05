import type { Metadata } from "next";
import { GradientStudio } from "@/components/tools/gradient-studio";
import { ToolHeader } from "@/components/tool-header";

export const metadata: Metadata = {
  title: "Gradient studio",
  description:
    "Build multi-stop linear, radial, and conic gradients with draggable colour stops, then copy CSS, Tailwind, or a CSS variable.",
  alternates: { canonical: "/tools/gradient" },
};

export default function GradientPage() {
  return (
    <div>
      <ToolHeader
        eyebrow="Colour"
        title="Gradient studio"
        description="Stack up to six colour stops, reorder them by dragging positions, and preview the result on a real surface before you ship it."
      />
      <GradientStudio />
    </div>
  );
}
