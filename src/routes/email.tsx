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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Meridian Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails by tone, audience and length with an AI assistant built for busy teams.",
      },
      { property: "og:title", content: "Smart Email Generator — Meridian Assistant" },
      {
        property: "og:description",
        content: "Generate polished, on-tone work emails in seconds and review before sending.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Confident", "Warm", "Formal", "Direct", "Apologetic", "Persuasive"] as const;
const AUDIENCES = ["Client", "Internal team", "Executive", "Partner", "Vendor", "Candidate"] as const;
const LENGTHS = ["Short (under 100 words)", "Standard (100–180 words)", "Detailed (200+ words)"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const { output, error, loading, submit } = useAiTask<{
    context: string;
    tone: string;
    audience: string;
    length: string;
  }>((data) => run({ data }));

  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [length, setLength] = useState<string>(LENGTHS[1]);
  const [context, setContext] = useState(
    "Q3 renewal with Northwind is slipping. Ask for a revised scope and a firm launch date, keep it short and direct.",
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 01"
        title="Smart Email Generator"
        description="Give the situation, pick a tone and audience, and get a subject line plus a ready-to-send draft."
      />
      <ToolSurface
        toolName="Email Generator"
        submitLabel="Generate draft"
        outputLabel="Generated draft"
        loading={loading}
        error={error}
        output={output}
        emptyHint="Your draft appears here with a subject line, full email body and a short note on why the tone works."
        onSubmit={() => context.trim() && submit({ context, tone, audience, length })}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tone">
            <SelectControl value={tone} onChange={setTone} options={TONES} />
          </Field>
          <Field label="Audience">
            <SelectControl value={audience} onChange={setAudience} options={AUDIENCES} />
          </Field>
        </div>
        <Field label="Length">
          <SelectControl value={length} onChange={setLength} options={LENGTHS} />
        </Field>
        <Field label="Context">
          <TextareaControl
            value={context}
            onChange={setContext}
            placeholder="What happened, what you need, and any deadline or constraint."
          />
        </Field>
      </ToolSurface>
    </AppShell>
  );
}
