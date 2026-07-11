import { useGameStore } from "../stores/game";

const modes = [
  {
    mode: "easy" as const,
    label: "Easy",
    clues: 6,
    tagline: "Six clues, six guesses. A leisurely morning read.",
    border: "border-easy",
    badge: "bg-easy",
  },
  {
    mode: "normal" as const,
    label: "Normal",
    clues: 4,
    tagline: "Four clues, six guesses. The first two are on the house.",
    border: "border-normal",
    badge: "bg-normal",
  },
  {
    mode: "hard" as const,
    label: "Hard",
    clues: 2,
    tagline: "Two clues, six guesses. Pure intuition. No safety net.",
    border: "border-hard",
    badge: "bg-hard",
  },
];

export function ModeSelect() {
  const { startGame, error } = useGameStore();

  return (
    <>
      {error && (
        <p className="text-hard text-center text-sm mb-4 font-shouty uppercase tracking-wide">
          {error}
        </p>
      )}
      <p className="font-body text-text-body text-center text-sm leading-relaxed mb-5">
        Each day a new subject hides behind six clues. Choose your difficulty — more clues, easier
        pick. Fewer clues, bragging rights.
      </p>
      <div className="space-y-3">
        {modes.map(({ mode, label, clues, tagline, border, badge }) => (
          <button
            key={mode}
            type="button"
            onClick={() => startGame(mode)}
            className="w-full text-left bg-paper-card border-l-4 border-b-2 border-b-paper-border-muted px-4 py-3 transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-shouty text-sm uppercase tracking-[0.1em]">{label}</span>
              <span className={`${badge} text-white font-shouty text-[10px] uppercase tracking-[0.08em] px-2 py-0.5`}>
                {clues} clues
              </span>
            </div>
            <p className="font-body text-text-faint text-xs italic leading-relaxed">
              {tagline}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
