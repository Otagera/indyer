import type { ClueItem } from "@indyer/shared";

const axisLabels: Record<string, string> = {
  origin: "Origin",
  work: "Known for",
  place: "Place",
  contemporary: "Contemporary",
  epithet: "Epithet",
  end: "End",
};

interface ClueBoxProps {
  clues: ClueItem[];
}

export function ClueBox({ clues }: ClueBoxProps) {
  return (
    <div className="space-y-2 mb-6">
      {clues.map((clue) => (
        <div
          key={clue.number}
          className="bg-paper-inset border-l-4 border-ink px-3 py-2"
        >
          <span className="font-shouty text-[10px] uppercase tracking-[0.12em] text-text-faint block mb-0.5">
            {axisLabels[clue.axis] ?? clue.axis} &middot; Clue {clue.number}
          </span>
          <p className="font-body text-text-body text-sm leading-relaxed">
            {clue.text}
          </p>
          {clue.source && (
            <a
              href={clue.source.permalink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-shouty text-[9px] uppercase tracking-[0.1em] text-text-faint mt-1 block hover:text-ink transition-colors"
            >
              Source: {clue.source.publication} &middot; {clue.source.date}
              {clue.source.page ? ` \u00b7 p.${clue.source.page}` : ""} &nearr;
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
