import type { Mode } from "@indyer/shared";
import { Button } from "./Button";
import { useGameStore } from "../stores/game";

const modes: { mode: Mode; label: string; clues: number }[] = [
  { mode: "easy", label: "Easy", clues: 6 },
  { mode: "normal", label: "Normal", clues: 4 },
  { mode: "hard", label: "Hard", clues: 2 },
];

export function ModeSelect() {
  const { startGame, error, today } = useGameStore();

  return (
    <>
      {error && (
        <p className="text-hard text-center text-sm mb-4 font-shouty uppercase tracking-wide">
          {error}
        </p>
      )}
      <p className="font-body text-text-body text-center text-sm leading-relaxed mb-6">
        Each day a new subject hides behind six clues. Choose your difficulty — more clues, easier
        pick. Fewer clues, bragging rights.
      </p>
      <div className="space-y-3">
        {modes.map(({ mode, label, clues }) => (
          <div key={mode} className="flex items-center gap-3">
            <Button variant={mode} size="lg" onClick={() => startGame(mode)}>
              {label}
            </Button>
            <span className="font-body text-text-faint text-xs italic">
              {clues} clues · 6 guesses
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
