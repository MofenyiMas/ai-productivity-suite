import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AiOutput, Disclaimer } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/tool-surface";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Meridian Assistant" },
      {
        name: "description",
        content:
          "Chat with Meridian about any work task: rewrite a message, unblock a decision, or think through a plan.",
      },
      { property: "og:title", content: "AI Chatbot — Meridian Assistant" },
      {
        property: "og:description",
        content: "A conversational workplace assistant that keeps full context of the thread.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this Slack message so it sounds calmer.",
  "Help me say no to a meeting without friction.",
  "What should I ask in a vendor security review?",
];

function ChatPage() {
  const run = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      // Full history is sent every turn so the assistant keeps context.
      const reply = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant could not reply. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tool 05"
        title="AI Chatbot"
        description="A working conversation with full thread context — for the tasks that don't fit a form."
      />

      <section className="glass-panel animate-rise flex h-[calc(100vh-15rem)] min-h-[460px] flex-col rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Meridian Chat</div>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] outline-1 -outline-offset-1 ${
              loading
                ? "bg-amber/10 text-amber outline-amber/20"
                : "bg-mint/10 text-mint outline-mint/20"
            }`}
          >
            {loading ? "Thinking" : "Ready"}
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && !loading && (
            <div className="pt-6">
              <p className="max-w-[46ch] text-sm leading-relaxed text-faint">
                Ask anything about your workday. Try one of these:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg bg-panel/70 px-3 py-2 text-xs text-dim outline-1 -outline-offset-1 outline-border transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-mint/12 px-3.5 py-2.5 text-sm leading-relaxed text-foreground outline-1 -outline-offset-1 outline-mint/20">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="max-w-[92%] rounded-2xl rounded-bl-sm bg-ground/50 px-3.5 py-1 outline-1 -outline-offset-1 outline-border">
                <AiOutput text={m.content} />
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-dim">
              <Loader2 className="size-3.5 animate-spin" /> Meridian is drafting a reply…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 flex items-end gap-2"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask Meridian anything about your work…"
            className="w-full resize-none rounded-lg bg-ground/60 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-1 -outline-offset-1 outline-border placeholder:text-faint focus:outline-mint/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-lg bg-mint text-ground outline-1 -outline-offset-1 outline-mint/50 transition-colors hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="size-4" />
          </button>
        </form>
        <Disclaimer />
      </section>
    </AppShell>
  );
}
