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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Meridian Assistant" },
      {
        name: "description",
        content:
          "Turn a messy task dump into a prioritized, time-blocked schedule that protects deep-focus work.",
      },
      { property: "og:title", content: "AI Task Planner — Meridian Assistant" },
      {
        property: "og:description",
        content: "Prioritize by impact and urgency, then get a realistic time-blocked plan.",
      },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week", "Next two weeks"] as const;
const HOURS = ["2 focus hours", "4 focus hours", "6 focus hours", "Full 8-hour day"] as const;

function PlannerPage() {
  const run = useServerFn(planTasks);
  const { output, error, loading, submit } = useAiTask<{
    tasks: string;
    horizon: string;
    hours: string;
  }>((data) => run({ data }));

  const [horizon, setHorizon] = useState<string>(HORIZONS[0]);
  const [hours, setHours] = useState<string>(HOURS[1]);
  const [tasks, setTasks] = useState(
    "finish Q3 roadmap deck (exec review tomorrow 9am)\nreview pricing proposal from finance\ndraft follow-up to Northwind\n1:1 with Priya, 30 min\ninbox triage\nprep interview questions for Friday panel",
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 03"
        title="AI Task Planner"
        description="Dump everything on your plate. Meridian ranks by impact and urgency, then blocks it into a workable day."
      />
      <ToolSurface
        toolName="Task Planner"
        submitLabel="Prioritize & schedule"
        outputLabel="Your plan"
        loading={loading}
        error={error}
        output={output}
        emptyHint="You'll get a ranked priority list, a time-blocked schedule, deferred items and the main risks to the plan."
        onSubmit={() => tasks.trim() && submit({ tasks, horizon, hours })}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Horizon">
            <SelectControl value={horizon} onChange={setHorizon} options={HORIZONS} />
          </Field>
          <Field label="Available focus time">
            <SelectControl value={hours} onChange={setHours} options={HOURS} />
          </Field>
        </div>
        <Field label="Tasks (one per line)">
          <TextareaControl
            value={tasks}
            onChange={setTasks}
            rows={10}
            placeholder="One task per line. Add deadlines or durations in brackets when you know them."
          />
        </Field>
      </ToolSurface>
    </AppShell>
  );
}
