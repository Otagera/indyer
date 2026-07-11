import { type FormEvent, useRef, useId } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  remaining: number;
  suggestions?: string[];
}

export function Input({ value, onChange, onSubmit, disabled = false, remaining, suggestions }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your guess..."
        list={suggestions?.length ? listId : undefined}
        autoComplete="off"
        className="flex-1 font-mono text-sm text-ink bg-paper-inset px-3 py-2 border-2 border-ink border-r-0 outline-none placeholder:text-text-faint disabled:opacity-50"
      />
      {suggestions && suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="font-shouty uppercase tracking-[0.08em] text-xs px-4 py-2 bg-ink text-paper border-2 border-ink disabled:opacity-50 disabled:cursor-not-allowed"
      >
        FILE IT
      </button>
    </form>
  );
}
