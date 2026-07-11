import { ClueBox } from "./ClueBox";
import { GuessDots } from "./GuessDots";
import { useGameStore } from "../stores/game";

const categoryLabels: Record<string, string> = {
  leader: "Head of State",
  musician: "Musician",
  footballer: "Footballer",
  writer: "Writer",
  coup_plotter: "Coup Plotter",
  regional_leader: "Regional Leader",
  other: "Other",
};

export function GameOver() {
  const { screen, clues, allClues, guesses, mode, issueNo, answer, category } = useGameStore();
  const solved = screen === "solved";
  const used = guesses.length;
  const correctGuess = guesses.find((g) => g.correct);

  const seenCount = clues.length;
  const unseen = allClues.filter((c) => c.number > seenCount);

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

      <div className="border-2 border-ink p-4 mb-4 text-center">
        <p className="font-body text-text-faint text-xs uppercase tracking-wider mb-1">
          The answer was
        </p>
        <p className="font-headline text-xl text-ink mb-1">{answer ?? "—"}</p>
        {category && (
          <span className="inline-block font-shouty text-[10px] uppercase tracking-[0.08em] bg-ink text-paper px-2 py-0.5">
            {categoryLabels[category] ?? category}
          </span>
        )}
      </div>

      {solved && correctGuess && (
        <div className="bg-easy/10 border border-easy/30 px-3 py-2 mb-4">
          <p className="font-shouty text-[10px] uppercase tracking-[0.12em] text-easy">
            Correct guess
          </p>
          <p className="font-body text-text-body text-sm">&ldquo;{correctGuess.text}&rdquo;</p>
        </div>
      )}

      <GuessDots total={6} used={used} guesses={guesses} mode={mode} />

      <ClueBox clues={clues} />

      {unseen.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <div className="h-px flex-1 bg-paper-border-muted" />
            <span className="font-shouty text-[10px] uppercase tracking-[0.15em] text-text-faint shrink-0">
              Clues you didn&rsquo;t see
            </span>
            <div className="h-px flex-1 bg-paper-border-muted" />
          </div>
          <div className="space-y-2 mb-4 opacity-60">
            {unseen.map((clue) => (
              <div
                key={clue.number}
                className="bg-paper-aged border-l-4 border-paper-border-muted px-3 py-2"
              >
                <span className="font-shouty text-[10px] uppercase tracking-[0.12em] text-text-faint block mb-0.5">
                  {clue.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-2 text-center">
        <p className="font-body text-text-faint text-xs italic mb-3">
          Played in {mode ?? "—"} mode &middot; {used}/6 guesses
        </p>
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
