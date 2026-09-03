import { useState } from "react";

/** Runs a server function, tracking loading, error and output text. */
export function useAiTask<TInput>(run: (input: TInput) => Promise<string>) {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(input: TInput) {
    setLoading(true);
    setError(null);
    try {
      setOutput(await run(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { output, error, loading, submit };
}
