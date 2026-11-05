import type { Metadata } from "next";
import { ShadowLab } from "@/components/tools/shadow-lab";
import { ToolHeader } from "@/components/tool-header";

export const metadata: Metadata = {
  title: "Shadow lab",
  description:
    "Compose layered box-shadows with live sliders, preview elevation on a real card, and copy CSS or Tailwind.",
  alternates: { canonical: "/tools/shadow" },
};

export default function ShadowPage() {
  return (
    <div>
      <ToolHeader
        eyebrow="Elevation"
        title="Shadow lab"
        description="Real depth comes from stacked shadows: a tight contact edge plus a wide ambient layer. Build both here and copy the whole stack."
      />
      <ShadowLab />
    </div>
  );
}
