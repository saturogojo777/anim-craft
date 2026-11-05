"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label?: string;
  size?: "sm" | "md";
  variant?: "ghost" | "solid";
  className?: string;
  ariaLabel?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
  variant = "ghost",
  className,
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const copy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel ?? `${label} to clipboard`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "ghost"
          ? "border border-line bg-surface-2/60 text-fg-soft hover:border-line-strong hover:text-fg"
          : "bg-fg text-bg hover:opacity-90",
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
