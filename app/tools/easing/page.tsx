import type { Metadata } from "next";
import { EasingEditor } from "@/components/tools/easing-editor";
import { ToolHeader } from "@/components/tool-header";

export const metadata: Metadata = {
  title: "Cubic-bézier easing editor",
  description:
    "Drag cubic-bézier control points, compare easing curves side by side, and copy the CSS, Tailwind arbitrary value, or JavaScript snippet.",
  alternates: { canonical: "/tools/easing" },
};

export default function EasingPage() {
  return (
    <div>
      <ToolHeader
        eyebrow="Timing"
        title="Cubic-bézier easing editor"
        description="Timing is the difference between an interface that feels expensive and one that feels stuck. Drag the curve, compare it against linear and ease-out, then copy the exact value."
      />
      <EasingEditor />
    </div>
  );
}
