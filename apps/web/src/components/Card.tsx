import type { ReactNode } from "react";

type CardVariant = "paper" | "torn";

interface CardProps {
  variant?: CardVariant;
  rotation?: number;
  children: ReactNode;
  className?: string;
}

export function Card({ variant = "paper", rotation = 0, children, className = "" }: CardProps) {
  const base = "bg-paper-card border border-paper-border shadow-[2px_2px_0_rgba(20,18,16,0.12)]";

  const torn =
    variant === "torn"
      ? "[clip-path:polygon(0_2%,2%_0,5%_3%,8%_0,11%_2%,14%_0,17%_3%,20%_0,23%_2%,26%_0,29%_3%,32%_0,35%_2%,38%_0,41%_3%,44%_0,47%_2%,50%_0,53%_3%,56%_0,59%_2%,62%_0,65%_3%,68%_0,71%_2%,74%_0,77%_3%,80%_0,83%_2%,86%_0,89%_3%,92%_0,95%_2%,98%_0,100%_2%,100%_98%,98%_100%,95%_97%,92%_100%,89%_98%,86%_100%,83%_97%,80%_100%,77%_98%,74%_100%,71%_97%,68%_100%,65%_98%,62%_100%,59%_97%,56%_100%,53%_98%,50%_100%,47%_97%,44%_100%,41%_98%,38%_100%,35%_97%,32%_100%,29%_98%,26%_100%,23%_97%,20%_100%,17%_98%,14%_100%,11%_97%,8%_100%,5%_98%,2%_100%,0_98%)]"
      : "";

  return (
    <div
      className={`${base} ${torn} ${className}`}
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      {children}
    </div>
  );
}
