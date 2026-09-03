import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SHARED_STYLE = `You are Meridian, an AI workplace productivity assistant used by busy professionals.
Rules for every response:
- Be concrete, professional and free of filler or self-reference.
- Never mention that you are an AI model or describe your process.
- Use short markdown: "## " section headings, "- " bullets, "**bold**" for emphasis. No tables, no code fences.
- Prefer specifics (names, dates, numbers) taken from the user's input; never invent facts, mark unknowns as "TBD".`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this workspace.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({ model: MODEL, messages, stream: false }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let message = detail;
    try {
      message = JSON.parse(detail)?.error?.message ?? detail;
    } catch {
      /* keep raw text */
    }
    if (res.status === 429) {
      throw new Error("Rate limit reached. Please wait a few seconds and try again.");
    }
    if (res.status === 402) {
      throw new Error(
        message || "AI credits are exhausted. The workspace owner needs to add credits.",
      );
    }
    if (res.status === 403) {
      throw new Error(message || "AI access is currently blocked for this workspace.");
    }
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The assistant returned an empty response.");
  return text;
}

/* ---------------------------------- Email --------------------------------- */

const EmailInput = z.object({
  context: z.string().min(1),
  tone: z.string().min(1),
  audience: z.string().min(1),
  length: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) =>
    callGateway([
      { role: "system", content: SHARED_STYLE },
      {
        role: "user",
        content: `Task: write a workplace email.
Tone: ${data.tone}
Audience: ${data.audience}
Length: ${data.length}
Situation / intent from the sender:
"""
${data.context}
"""

Output exactly this structure:
## Subject
One line, under 60 characters.

## Email
The full email body, greeting through sign-off, matching the requested tone, audience and length. Use [Name] placeholders where a real name is unknown.

## Why this works
- Two or three short bullets on the tone, structure and ask.`,
      },
    ]),
  );

/* ------------------------------ Meeting notes ----------------------------- */

const NotesInput = z.object({
  notes: z.string().min(1),
  meetingType: z.string().min(1),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => NotesInput.parse(data))
  .handler(async ({ data }) =>
    callGateway([
      { role: "system", content: SHARED_STYLE },
      {
        role: "user",
        content: `Task: summarize raw meeting notes from a ${data.meetingType}.
Raw notes / transcript:
"""
${data.notes}
"""

Output exactly this structure:
## Summary
Two or three sentences on what was decided.

## Key points
- Bulleted decisions and discussion points.

## Action items
- **Owner** — action — due date (write TBD when no date was given).

## Deadlines
- Date — what is due. Omit this section only if no dates exist.

## Open questions
- Anything unresolved. Write "- None" when nothing is open.`,
      },
    ]),
  );

/* ------------------------------ Task planner ------------------------------ */

const PlannerInput = z.object({
  tasks: z.string().min(1),
  horizon: z.string().min(1),
  hours: z.string().min(1),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlannerInput.parse(data))
  .handler(async ({ data }) =>
    callGateway([
      { role: "system", content: SHARED_STYLE },
      {
        role: "user",
        content: `Task: prioritize and schedule work.
Planning horizon: ${data.horizon}
Available focus time: ${data.hours}
Task dump from the user:
"""
${data.tasks}
"""

Prioritize with impact vs. urgency, batch similar work, and protect one deep-focus block.

Output exactly this structure:
## Priorities
- **P1** — task — why it ranks first (one clause).
- Continue through P2, P3 ...

## Schedule
- **09:00–10:30** — task — expected outcome. Realistic blocks that fit the available focus time, including one break.

## Deferred
- Tasks that should wait, with the reason.

## Risks
- Two bullets max on what could derail the plan.`,
      },
    ]),
  );

/* ---------------------------------- Research ------------------------------ */

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.string().min(1),
  audience: z.string().min(1),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ResearchInput.parse(data))
  .handler(async ({ data }) =>
    callGateway([
      { role: "system", content: SHARED_STYLE },
      {
        role: "user",
        content: `Task: produce a research brief.
Topic or question: "${data.topic}"
Depth: ${data.depth}
Prepared for: ${data.audience}

You have no live web access, so rely on general knowledge and clearly flag anything time-sensitive as needing verification.

Output exactly this structure:
## Executive summary
Three sentences maximum.

## Key insights
- Four to six insights, each with a short "so what" clause.

## Considerations & trade-offs
- Bullets on risks, counterarguments or constraints.

## Recommended next steps
- Concrete actions for the reader.

## Verify before citing
- Claims that are time-sensitive or need a primary source.`,
      },
    ]),
  );

/* ------------------------------------ Chat -------------------------------- */

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) =>
    callGateway([
      {
        role: "system",
        content: `${SHARED_STYLE}
You are in conversational mode. Answer workplace questions directly, ask at most one clarifying question when the request is truly ambiguous, and keep replies under 200 words unless the user asks for depth.`,
      },
      ...data.messages,
    ]),
  );
