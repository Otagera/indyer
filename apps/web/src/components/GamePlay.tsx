import { useState } from "react";
import { Input } from "./Input";
import { GuessDots } from "./GuessDots";
import { ClueBox } from "./ClueBox";
import { useGameStore } from "../stores/game";

export function GamePlay() {
  const [value, setValue] = useState("");
  const { clues, guesses, mode, totalClues, submitGuess, error } = useGameStore();
  const used = guesses.length;
  const guessesLeft = 6 - used;

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

      <div className="border-t border-paper-border pt-4">
        <Input
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          disabled={used >= 6}
          remaining={guessesLeft}
        />
      </div>
    </>
  );
}
