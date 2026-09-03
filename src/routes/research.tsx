import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import {
  Field,
  PageHeader,
  SelectControl,
  TextareaControl,
  ToolSurface,
} from "@/components/tool-surface";
import { useAiTask } from "@/hooks/use-ai-task";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Meridian Assistant" },
      {
        name: "description",
        content:
          "Get a structured research brief with executive summary, key insights, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Meridian Assistant" },
      {
        property: "og:description",
        content: "Ask a question, get insights, trade-offs and what to verify before citing.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Working brief", "Deep analysis"] as const;
const AUDIENCES = ["Myself", "My team", "Leadership", "A client"] as const;

function ResearchPage() {
  const run = useServerFn(runResearch);
  const { output, error, loading, submit } = useAiTask<{
    topic: string;
    depth: string;
    audience: string;
  }>((data) => run({ data }));

  const [depth, setDepth] = useState<string>(DEPTHS[1]);
  const [audience, setAudience] = useState<string>(AUDIENCES[2]);
  const [topic, setTopic] = useState(
    "How are B2B SaaS companies pricing AI features — seat-based, usage-based, or bundled — and what are the trade-offs?",
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 04"
        title="AI Research Assistant"
        description="Ask a working question. Meridian returns a brief with insights, trade-offs, next steps and claims worth verifying."
      />
      <ToolSurface
        toolName="Research"
        submitLabel="Build research brief"
        outputLabel="Research brief"
        loading={loading}
        error={error}
        output={output}
        emptyHint="You'll get an executive summary, key insights, considerations, recommended next steps and items to verify before citing."
        onSubmit={() => topic.trim() && submit({ topic, depth, audience })}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Depth">
            <SelectControl value={depth} onChange={setDepth} options={DEPTHS} />
          </Field>
          <Field label="Prepared for">
            <SelectControl value={audience} onChange={setAudience} options={AUDIENCES} />
          </Field>
        </div>
        <Field label="Topic or question">
          <TextareaControl
            value={topic}
            onChange={setTopic}
            rows={8}
            placeholder="Be specific — the sharper the question, the sharper the brief."
          />
        </Field>
      </ToolSurface>
    </AppShell>
  );
}
