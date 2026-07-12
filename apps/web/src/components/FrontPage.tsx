import { useGameStore } from "../stores/game";

export function FrontPage() {
  const { screen, issueNo, mode, guesses, viewResults } = useGameStore();
  const solved = guesses.some((g) => g.correct);

  return (
    <>
      <p className="text-text-tertiary text-center text-sm mt-4 mb-6 font-body italic">
        Daily guess-the-name puzzle
      </p>

      <div className="border-2 border-ink p-4 mb-4 text-center">
        <p className="font-body text-text-faint text-xs uppercase tracking-wider mb-1">
          Issue {issueNo}
        </p>
        <p className="font-headline text-xl text-ink mb-1">
          {solved ? "Identity Confirmed" : "Case Unsolved"}
        </p>
        <p className="font-body text-text-tertiary text-sm italic">
          Played in {mode ?? "—"} mode &middot; {guesses.length}/6 guesses
        </p>
      </div>

      <p className="font-body text-text-faint text-center text-xs italic mb-4">
        A new issue hits the stands tomorrow.
      </p>

      <button
        type="button"
        onClick={viewResults}
        className="w-full font-shouty uppercase tracking-[0.08em] text-sm py-3 bg-ink text-paper shadow-[4px_4px_0_#141210] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        Read Today&rsquo;s Issue
      </button>
    </>
  );
}
