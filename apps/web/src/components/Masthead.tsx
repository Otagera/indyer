interface MastheadProps {
  size?: "full" | "compact";
}

export function Masthead({ size = "full" }: MastheadProps) {
  const titleSize = size === "full" ? "text-[46px]" : "text-[26px]";

  return (
    <div className="text-center">
      <h1 className={`font-masthead ${titleSize} leading-none text-ink tracking-normal`}>
        The New Herald
      </h1>
      <div className="mt-1 flex h-[6px] items-center">
        <div className="h-[4px] flex-1 flex">
          <div className="h-full flex-1 bg-easy" />
          <div className="h-full flex-1 bg-normal" />
          <div className="h-full flex-1 bg-hard" />
        </div>
      </div>
      <div className="h-[2px] bg-ink" />
    </div>
  );
}
