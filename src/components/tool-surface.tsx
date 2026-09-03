import { Loader2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { AiOutput, Disclaimer, OutputSkeleton } from "./ai-output";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-7">
      <div className="font-mono text-[11px] tracking-wide text-dim">{eyebrow}</div>
      <h1 className="max-w-[40ch] text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 max-w-[62ch] text-sm text-dim">{description}</p>
    </header>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-dim">{label}</span>
      {children}
    </label>
  );
}

const controlClass =
  "w-full rounded-lg bg-ground/60 px-3 py-2 text-sm text-foreground outline-1 -outline-offset-1 outline-border transition-colors focus:outline-mint/50 focus-visible:outline-mint/50";

export function SelectControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={controlClass}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-panel">
          {o}
        </option>
      ))}
    </select>
  );
}

export function TextareaControl({
  value,
  onChange,
  placeholder,
  rows = 7,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${controlClass} resize-none py-2.5 leading-relaxed placeholder:text-faint`}
    />
  );
}

export function ToolSurface({
  toolName,
  submitLabel,
  outputLabel,
  onSubmit,
  loading,
  error,
  output,
  emptyHint,
  children,
}: {
  toolName: string;
  submitLabel: string;
  outputLabel: string;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  output: string | null;
  emptyHint: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="glass-panel animate-rise rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">{toolName}</div>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] outline-1 -outline-offset-1 ${
              loading
                ? "bg-amber/10 text-amber outline-amber/20"
                : "bg-mint/10 text-mint outline-mint/20"
            }`}
          >
            {loading ? "Working" : "Ready"}
          </span>
        </div>
        <div className="space-y-3">{children}</div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mint py-2.5 text-sm font-semibold text-ground outline-1 -outline-offset-1 outline-mint/50 transition-colors hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : submitLabel}
        </button>
        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </section>

      <section
        className="glass-panel animate-rise flex flex-col rounded-2xl p-5"
        aria-live="polite"
        aria-busy={loading}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">{outputLabel}</div>
          <span className="font-mono text-[10px] text-dim">{output ? "v1" : "—"}</span>
        </div>
        <div className="min-h-[260px] flex-1">
          {loading ? (
            <OutputSkeleton />
          ) : output ? (
            <AiOutput text={output} />
          ) : (
            <p className="max-w-[46ch] text-sm leading-relaxed text-faint">{emptyHint}</p>
          )}
        </div>
        <Disclaimer />
      </section>
    </div>
  );
}
