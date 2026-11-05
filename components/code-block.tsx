import { highlightCode, type HighlightLanguage } from "@/lib/highlight";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  code: string;
  language?: HighlightLanguage;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  maxHeight?: string;
};

export function CodeBlock({
  code,
  language = "css",
  filename,
  className,
  showLineNumbers = false,
  showCopy = true,
  maxHeight = "22rem",
}: CodeBlockProps) {
  const lines = highlightCode(code.trimEnd(), language);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-[var(--code-bg)]", className)}>
      {(filename || showCopy) && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-3/70" />
            <span className="h-2 w-2 rounded-full bg-accent-2/70" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            {filename && (
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {filename}
              </span>
            )}
          </div>
          {showCopy && <CopyButton value={code} label="Copy" />}
        </div>
      )}
      <pre
        className="code-surface overflow-auto px-3.5 py-3"
        style={{ maxHeight }}
        tabIndex={0}
      >
        <code>
          {lines.map((line, index) => (
            <span key={index} className="flex min-w-0">
              {showLineNumbers && (
                <span
                  aria-hidden="true"
                  className="mr-3.5 inline-block w-5 shrink-0 select-none text-right text-[11px] text-muted/50"
                >
                  {index + 1}
                </span>
              )}
              <span className="min-w-0 whitespace-pre" dangerouslySetInnerHTML={{ __html: line || " " }} />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
