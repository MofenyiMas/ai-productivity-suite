import { Fragment, type ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Minimal markdown renderer for headings, bullets, bold and paragraphs. */
export function AiOutput({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="my-2 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-mint/70" />
            <span>{inline(b)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) {
      flush(`ul-${index}`);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, ""));
      return;
    }
    flush(`ul-${index}`);
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push(
        <h3
          key={index}
          className="label-eyebrow mt-5 first:mt-0 border-b border-border pb-1.5 text-mint"
        >
          {heading[2]}
        </h3>,
      );
      return;
    }
    blocks.push(
      <p key={index} className="my-2 text-sm leading-relaxed text-foreground/85">
        {inline(line)}
      </p>,
    );
  });
  flush("ul-end");

  return <div className="animate-fade-in">{blocks}</div>;
}

export function Disclaimer() {
  return (
    <div className="mt-auto flex items-start gap-2 border-t border-border pt-4 text-[11px] text-dim">
      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-amber/15 font-mono text-[9px] text-amber">
        !
      </span>
      <span>AI-generated content may require human review.</span>
    </div>
  );
}

export function OutputSkeleton() {
  return (
    <div className="space-y-3">
      {["w-1/3", "w-full", "w-5/6", "w-2/3", "w-4/5"].map((w, i) => (
        <div key={i} className={`relative h-2.5 overflow-hidden rounded-full bg-foreground/5 ${w}`}>
          <div className="absolute inset-y-0 w-1/3 animate-shimmer bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}
