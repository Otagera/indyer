import { ClueBox } from "./ClueBox";
import { GuessDots } from "./GuessDots";
import { useGameStore } from "../stores/game";

export function GameOver() {
  const { screen, clues, guesses, mode, issueNo, answer } = useGameStore();
  const solved = screen === "solved";
  const used = guesses.length;
  const correctGuess = guesses.find((g) => g.correct);

  return (
    <>
      <div className="text-center mb-5">
        <div
          className={`inline-block font-shouty text-xs uppercase tracking-[0.15em] px-3 py-1 mb-2 ${solved ? "bg-easy text-white" : "bg-hard text-white"}`}
        >
          {solved ? "SOLVED" : "FAILED"}
        </div>
        <h2 className="font-headline text-2xl text-ink">
          {solved ? "Identity Confirmed" : "Case Unsolved"}
        </h2>
        <p className="font-body text-text-tertiary text-sm italic mt-1">
          The New Herald &middot; Issue {issueNo}
        </p>
      </div>

      <GuessDots total={6} used={used} guesses={guesses} mode={mode} />
      <ClueBox clues={clues} />

      {solved && correctGuess && (
        <div className="bg-easy/10 border border-easy/30 px-3 py-2 mb-4">
          <p className="font-shouty text-[10px] uppercase tracking-[0.12em] text-easy">
            Correct guess
          </p>
          <p className="font-body text-text-body text-sm">&ldquo;{correctGuess.text}&rdquo;</p>
        </div>
      )}

      <div className="border-2 border-ink p-4 mb-4 text-center">
        <p className="font-body text-text-faint text-xs uppercase tracking-wider mb-1">
          The answer was
        </p>
        <p className="font-headline text-xl text-ink">{answer ?? "—"}</p>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="w-full font-shouty uppercase tracking-[0.08em] text-sm py-3 bg-ink text-paper shadow-[4px_4px_0_#141210] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        New Issue Tomorrow
      </button>
    </>
  );
}
