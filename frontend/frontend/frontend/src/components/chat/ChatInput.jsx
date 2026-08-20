import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

const MAX_LENGTH = 5000; // mirrors backend ChatRequest.query max_length

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-line bg-void/95 p-4 sm:p-5">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-md border border-line-strong bg-surface px-3 py-2 focus-within:border-amber-500">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask NEXUS about your research…"
          aria-label="Ask NEXUS about your research"
          className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-sm text-ink-100 outline-none placeholder:text-ink-700 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500 text-void transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-ink-700"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="mx-auto mt-1.5 max-w-3xl px-1 font-mono text-[10px] text-ink-700">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
