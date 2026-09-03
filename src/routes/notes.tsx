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
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Meridian Assistant" },
      {
        name: "description",
        content:
          "Turn messy meeting notes or transcripts into key points, owned action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Meridian Assistant" },
      {
        property: "og:description",
        content: "Paste raw notes and get decisions, action items with owners, and dated deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

const TYPES = [
  "Team standup",
  "Client call",
  "Design review",
  "Project kickoff",
  "1:1",
  "Board update",
] as const;

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const { output, error, loading, submit } = useAiTask<{ notes: string; meetingType: string }>(
    (data) => run({ data }),
  );

  const [meetingType, setMeetingType] = useState<string>(TYPES[2]);
  const [notes, setNotes] = useState(
    "design sync 41min — dana: onboarding flow too long, move to 3 steps. sam pushing back on timeline, wants spec friday 12:00. priya to prototype empty states. open: do we keep the tooltip tour? follow up with legal about copy before launch (no date yet).",
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 02"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Meridian extracts decisions, owned actions, deadlines and open questions."
      />
      <ToolSurface
        toolName="Meeting Notes"
        submitLabel="Summarize notes"
        outputLabel="Structured summary"
        loading={loading}
        error={error}
        output={output}
        emptyHint="You'll get a summary, key points, action items with owners and due dates, deadlines and open questions."
        onSubmit={() => notes.trim() && submit({ notes, meetingType })}
      >
        <Field label="Meeting type">
          <SelectControl value={meetingType} onChange={setMeetingType} options={TYPES} />
        </Field>
        <Field label="Raw notes or transcript">
          <TextareaControl
            value={notes}
            onChange={setNotes}
            rows={12}
            placeholder="Paste your notes exactly as you typed them — shorthand is fine."
          />
        </Field>
      </ToolSurface>
    </AppShell>
  );
}
