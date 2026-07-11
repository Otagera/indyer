export type Mode = "easy" | "normal" | "hard";

export interface Subject {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  bioLine: string;
}

export interface Clue {
  number: number;
  text: string;
}
