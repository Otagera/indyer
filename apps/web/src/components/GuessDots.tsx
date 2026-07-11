import { GuessDot } from "./GuessDot";
import type { Mode } from "@indyer/shared";

interface GuessDotsProps {
  total: number;
  used: number;
  guesses: { correct: boolean }[];
  mode: Mode | null;
}

export function GuessDots({ total, used, guesses, mode }: GuessDotsProps) {
  const dots = [];
  for (let i = 0; i < total; i++) {
    let state: "unused" | "correct" | "wrong" = "unused";
    if (i < used) {
      state = guesses[i]?.correct ? "correct" : "wrong";
    }
    dots.push(<GuessDot key={i} state={state} mode={mode ?? undefined} />);
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {dots}
    </div>
  );
}
