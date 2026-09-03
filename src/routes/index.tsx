import { createFileRoute, Link } from "@tanstack/react-router";

import { Disclaimer } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Meridian automates daily work: draft emails by tone, summarize meetings into actions, plan and prioritize tasks, and research faster with AI.",
      },
      { property: "og:title", content: "Meridian — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI email drafting, meeting summaries, task planning, research briefs and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    n: "01",
    name: "Email Generator",
    blurb: "Draft by tone and audience",
    tone: "bg-mint/15 text-mint",
  },
  {
    to: "/notes",
    n: "02",
    name: "Meeting Notes",
    blurb: "Actions, points, deadlines",
    tone: "bg-amber/15 text-amber",
  },
  {
    to: "/planner",
    n: "03",
    name: "Task Planner",
    blurb: "Prioritize and schedule",
    tone: "bg-azure/15 text-azure",
  },
  {
    to: "/research",
    n: "04",
    name: "Research",
    blurb: "Insights and summaries",
    tone: "bg-lilac/15 text-lilac",
  },
] as const;

const ACTIVITY = [
  {
    dot: "bg-mint",
    title: "Email draft to Northwind saved",
    meta: "Email Generator · just now",
    time: "09:41",
  },
  {
    dot: "bg-amber",
    title: "Meeting summary: Design sync",
    meta: "Meeting Notes · 2h ago",
    time: "07:12",
  },
  {
    dot: "bg-azure",
    title: "Task list re-prioritized for Thursday",
    meta: "Task Planner · yesterday",
    time: "17:30",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] tracking-wide text-dim">Overview</div>
          <h1 className="max-w-[40ch] text-2xl font-semibold tracking-tight">Good morning, Ada</h1>
          <p className="mt-1 max-w-[52ch] text-sm text-dim">
            Five assistants ready. Pick a tool and Meridian handles the first draft.
          </p>
        </div>
        <Link
          to="/planner"
          className="rounded-lg bg-mint px-3.5 py-2 text-sm font-semibold text-ground outline-1 -outline-offset-1 outline-mint/50 transition-colors hover:bg-mint/90"
        >
          Plan my day
        </Link>
      </div>

      <div className="label-eyebrow mb-3">Quick launch</div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="glass-panel animate-rise rounded-xl p-4 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{t.name}</span>
              <span
                className={`grid size-4 place-items-center rounded font-mono text-[10px] ${t.tone}`}
              >
                {t.n}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-dim">{t.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel animate-rise flex flex-col rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">How Meridian works</div>
            <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint outline-1 -outline-offset-1 outline-mint/20">
              Ready
            </span>
          </div>
          <ol className="space-y-3">
            {[
              "Pick the tool that matches the task — email, notes, planning, research or chat.",
              "Set the structured inputs: tone, audience, horizon, depth. They shape the prompt behind the scenes.",
              "Review the output, adjust an input, and regenerate until it reads like you.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded bg-edge font-mono text-[10px] text-dim">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground/85">{step}</span>
              </li>
            ))}
          </ol>
          <Disclaimer />
        </section>

        <section className="glass-panel animate-rise flex flex-col rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Ask instead</div>
            <span className="font-mono text-[10px] text-dim">Chat</span>
          </div>
          <p className="max-w-[48ch] text-sm leading-relaxed text-dim">
            When the task doesn't fit a form, talk it through. The chat keeps the whole thread in
            context, so you can refine an answer instead of starting over.
          </p>
          <Link
            to="/chat"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-panel/70 px-3.5 py-2 text-sm font-medium text-foreground outline-1 -outline-offset-1 outline-border transition-colors hover:outline-mint/40"
          >
            Open chat
          </Link>
        </section>
      </div>

      <div className="mt-8">
        <div className="label-eyebrow mb-3">Recent activity</div>
        <div className="glass-panel divide-y divide-border rounded-2xl">
          {ACTIVITY.map((a) => (
            <div key={a.title} className="flex items-center gap-4 px-5 py-3.5">
              <span className={`size-2 shrink-0 rounded-full ${a.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{a.title}</div>
                <div className="text-[11px] text-dim">{a.meta}</div>
              </div>
              <span className="font-mono text-[11px] text-faint">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
