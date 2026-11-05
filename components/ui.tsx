import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------- slider */

type RangeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  onCommit?: () => void;
  hint?: string;
  className?: string;
};

export function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  onCommit,
  hint,
  className,
}: RangeProps) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-fg-soft">{label}</span>
        <span className="font-mono text-[11px] text-muted">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
        className="w-full"
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
      />
      {hint && <p className="text-[11px] leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- select */

type SelectProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ label: string; value: T; group?: string }>;
  className?: string;
  id?: string;
};

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
  id,
}: SelectProps<T>) {
  const groups = Array.from(new Set(options.map((option) => option.group ?? "")));
  return (
    <label className={cn("block space-y-1", className)}>
      <span className="text-xs font-medium text-fg-soft">{label}</span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="w-full appearance-none rounded-lg border border-line bg-surface-2 px-3 py-2 pr-9 text-sm text-fg outline-none transition-colors hover:border-line-strong focus:border-accent"
        >
          {groups.map((group) => {
            const groupOptions = options.filter((option) => (option.group ?? "") === group);
            if (!group) {
              return groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ));
            }
            return (
              <optgroup key={group} label={group}>
                {groupOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </label>
  );
}

/* ------------------------------------------------------------- segmented */

type SegmentedProps<T extends string> = {
  label?: string;
  value: T;
  options: ReadonlyArray<{ label: string; value: T }>;
  onChange: (value: T) => void;
  className?: string;
};

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <span className="text-xs font-medium text-fg-soft">{label}</span>}
      <div className="flex rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label={label}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-fg text-bg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- toggle */

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>
        <span className="block text-xs font-medium text-fg-soft">{label}</span>
        {description && <span className="block text-[11px] text-muted">{description}</span>}
      </span>
      <span className="relative inline-flex h-5 w-9 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full border border-line bg-surface-3 transition-colors peer-checked:border-accent/60 peer-checked:bg-accent" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-fg shadow-sm transition-transform peer-checked:translate-x-4 peer-checked:bg-white" />
      </span>
    </label>
  );
}

/* ----------------------------------------------------------------- panel */

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-4", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------ text field */

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
  className,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  className?: string;
  maxLength?: number;
}) {
  return (
    <label className={cn("block space-y-1", className)}>
      <span className="text-xs font-medium text-fg-soft">{label}</span>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          "w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-muted/60 hover:border-line-strong focus:border-accent",
          mono && "font-mono text-xs",
        )}
      />
    </label>
  );
}
