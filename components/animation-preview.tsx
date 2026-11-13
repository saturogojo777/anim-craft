import type { AnimationDef } from "@/lib/animations";
import { previewClassName } from "@/lib/animations";
import { cn } from "@/lib/utils";

const hasOwnBackground = (def: AnimationDef): boolean =>
  /background(-image)?\s*:/.test(def.base ?? "");

const sizeClasses: Record<string, string> = {
  box: "h-16 w-16 rounded-2xl",
  card: "h-[6.5rem] w-[9.5rem] rounded-xl",
  ring: "h-14 w-14 rounded-full border-[3px] border-line-strong border-t-accent",
  dot: "h-4 w-4 rounded-full",
  ball: "h-7 w-7 rounded-full",
  bar: "h-14 w-4 rounded-full",
  skeleton: "h-3.5 w-40 rounded-full",
  orb: "h-[5.25rem] w-[5.25rem] rounded-full",
};

export function PreviewObject({
  def,
  className,
}: {
  def: AnimationDef;
  className?: string;
}) {
  const animationClass = previewClassName(def);
  const ownBackground = hasOwnBackground(def);

  if (def.preview === "text") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-block select-none text-center text-2xl font-semibold tracking-tight text-fg",
          animationClass,
          className,
        )}
      >
        AnimCraft
      </span>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative shrink-0",
        sizeClasses[def.preview] ?? sizeClasses.box,
        animationClass,
        !ownBackground &&
          (def.preview === "skeleton"
            ? "bg-surface-3"
            : def.preview === "ring"
              ? ""
              : def.preview === "dot" || def.preview === "ball"
                ? "bg-accent-2 shadow-[0_0_22px_-2px_rgba(34,211,238,0.75)]"
                : "bg-[linear-gradient(135deg,var(--accent),var(--accent-2)_55%,var(--accent-3))] shadow-[0_16px_32px_-18px_rgba(139,123,255,0.9)]"),
        def.preview === "card" && !ownBackground && "border border-line-strong bg-surface-2 shadow-lg",
        className,
      )}
    />
  );
}
