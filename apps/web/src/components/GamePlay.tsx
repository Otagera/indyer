import { useState } from "react";
import { MODE_CLUE_COUNTS } from "@indyer/shared";
import { Input } from "./Input";
import { GuessDots } from "./GuessDots";
import { ClueBox } from "./ClueBox";
import { useGameStore } from "../stores/game";

export function GamePlay() {
  const [value, setValue] = useState("");
  const { clues, guesses, mode, totalClues, submitGuess, error, roster } = useGameStore();
  const used = guesses.length;
  const guessesLeft = 6 - used;
  const modeBudget = mode ? MODE_CLUE_COUNTS[mode] : 6;
  const cluesExhausted = clues.length >= modeBudget && !guesses.some((g) => g.correct);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    await submitGuess(value.trim());
    setValue("");
  };

  return (
    <>
      {error && (
        <p className="text-hard text-center text-sm mb-2 font-shouty uppercase tracking-wide">
          {error}
        </p>
      )}

      <GuessDots total={6} used={used} guesses={guesses} mode={mode} />

      <p className="font-body text-text-faint text-center text-xs italic mb-4">
        {guessesLeft} guess{guessesLeft !== 1 ? "es" : ""} remaining
      </p>

      <ClueBox clues={clues} />

      {cluesExhausted && (
        <div className="border border-dashed border-paper-border-muted px-3 py-3 mb-4 text-center">
          <p className="font-shouty text-[10px] uppercase tracking-[0.15em] text-text-tertiary mb-1">
            No more clues
          </p>
          <p className="font-body text-text-faint text-xs italic">
            {mode === "hard"
              ? "The silence is the point. Trust your gut."
              : mode === "normal"
                ? "You have what you need. Now decide."
                : "Your instincts are all you have left."}
          </p>
        </div>
      )}

      {guesses.length > 0 && (
        <div className="mb-4 space-y-1">
          {guesses.map((g, i) => (
            <p
              key={i}
              className={`font-body text-xs leading-relaxed ${g.correct ? "text-easy font-semibold" : "text-text-faint line-through"}`}
            >
              {g.text}
            </p>
          ))}
        </div>
      )}

      <div className="border-t border-paper-border pt-4">
        <Input
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          disabled={used >= 6}
          remaining={guessesLeft}
          suggestions={roster}
        />
      </div>
    </>
  );
}
