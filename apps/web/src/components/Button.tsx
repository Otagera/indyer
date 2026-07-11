import type { ReactNode } from "react";

type ButtonVariant = "easy" | "normal" | "hard" | "ink";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  easy: "bg-easy text-white shadow-[4px_4px_0_#141210]",
  normal: "bg-normal text-white shadow-[4px_4px_0_#141210]",
  hard: "bg-hard text-white shadow-[4px_4px_0_#141210]",
  ink: "bg-ink text-paper shadow-[4px_4px_0_#141210]",
};

const sizeStyles = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  variant = "ink",
  size = "md",
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "font-shouty uppercase tracking-[0.08em] transition-all",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        disabled
          ? "bg-paper-disabled text-text-faint shadow-none cursor-not-allowed"
          : variantStyles[variant],
        sizeStyles[size],
      ].join(" ")}
    >
      {children}
    </button>
  );
}
