import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, Compass, RotateCcw } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ResearchThinking from "@/components/chat/ResearchThinking";
import ResearchHeader from "@/components/research/ResearchHeader";
import Button from "@/components/ui/Button";

const SUGGESTED_PROMPTS = [
  "What are the main findings across my papers?",
  "Compare the methodologies used in these studies.",
  "Identify gaps in the current literature.",
];

/**
 * Center panel: header + conversation + input. Sending itself (the real
 * POST /api/chat call and message-state updates) lives one level up in
 * the ResearchSession page, since that's where the message list is
 * owned — this component stays presentational plus scroll/empty-state
 * behavior.
 */
export default function ResearchChat({
  title,
  updatedAt,
  messages,
  isSending,
  sendError,
  onSend,
  onRetry,
  onToggleSessions,
  onToggleEvidence,
  onViewEvidence,
  hasEvidence,
}) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const handleScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      isNearBottomRef.current = distance < 120;
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isSending]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <ResearchHeader
        title={title}
        updatedAt={updatedAt}
        onToggleSessions={onToggleSessions}
        onToggleEvidence={onToggleEvidence}
        hasEvidence={hasEvidence}
      />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 && !isSending ? (
          <div className="mx-auto flex max-w-lg flex-col items-start gap-4 pt-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface">
              <Compass className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-medium text-ink-100">
                Start your investigation
              </h2>
              <p className="mt-1.5 text-sm text-ink-500">
                Ask NEXUS a research question and we&apos;ll work through the
                evidence.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="rounded-md border border-line px-3.5 py-2.5 text-left text-sm text-ink-300 transition-colors hover:border-line-strong hover:bg-surface-raised hover:text-ink-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onViewEvidence={onViewEvidence}
                />
              ))}
              {isSending && <ResearchThinking key="thinking" />}
            </AnimatePresence>

            {sendError && (
              <div className="flex items-start gap-3 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm text-red-400">{sendError.message}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onRetry}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try again
                </Button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={isSending} />
    </div>
  );
}
