type DotState = "unused" | "correct" | "wrong";

interface GuessDotProps {
  state: DotState;
  mode?: "easy" | "normal" | "hard";
}

const stateStyles: Record<DotState, string> = {
  unused: "border-[1.5px] border-ink bg-transparent",
  correct: "border-none bg-mode-color",
  wrong: "border-none bg-hard",
};

export function GuessDot({ state, mode }: GuessDotProps) {
  const modeColor =
    mode === "easy"
      ? "bg-easy"
      : mode === "normal"
        ? "bg-normal"
        : mode === "hard"
          ? "bg-hard"
          : "bg-ink";

  const fill = state === "correct" ? modeColor : state === "wrong" ? "bg-hard" : "bg-transparent";

  return (
    <span
      className={`inline-block w-[11px] h-[11px] rounded-full border-[1.5px] ${state === "unused" ? "border-ink" : "border-none"} ${fill}`}
    />
  );
}
