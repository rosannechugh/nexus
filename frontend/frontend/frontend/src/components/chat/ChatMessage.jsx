import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  FileSearch,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import LogoMark from "@/components/ui/LogoMark";
import MarkdownLite from "@/components/chat/MarkdownLite";
import { useAuth } from "@/hooks/useAuth";

function formatTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatQueryType(queryType) {
  if (!queryType) return "";
  return queryType
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const VERIFICATION_ICON = {
  SUPPORTED: { icon: CheckCircle2, className: "text-verified" },
  PARTIALLY_SUPPORTED: { icon: ShieldAlert, className: "text-amber-400" },
  UNSUPPORTED: { icon: XCircle, className: "text-red-400" },
};

/** Small "2 supported · 1 partially supported" line — full claim-level
 *  detail lives in the Evidence panel's VerificationPanel; this is just
 *  an at-a-glance indicator so the chat message doesn't duplicate it. */
function VerificationSummary({ verification }) {
  if (!verification?.length) return null;

  const counts = verification.reduce((acc, item) => {
    const key = (item.status || "").toUpperCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const parts = Object.entries(counts)
    .filter(([key]) => VERIFICATION_ICON[key])
    .map(([key, count]) => {
      const { icon: Icon, className } = VERIFICATION_ICON[key];
      const label =
        key === "SUPPORTED"
          ? "supported"
          : key === "PARTIALLY_SUPPORTED"
          ? "partially supported"
          : "unsupported";
      return (
        <span key={key} className="inline-flex items-center gap-1">
          <Icon className={`h-3 w-3 ${className}`} />
          {count} {label}
        </span>
      );
    });

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
      {parts}
    </div>
  );
}

export default function ChatMessage({ message, onViewEvidence }) {
  const { user } = useAuth();
  const [reasoningOpen, setReasoningOpen] = useState(false);

  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-start justify-end gap-3"
      >
        <div className="max-w-2xl rounded-md rounded-tr-sm border border-line bg-surface px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-100">
            {message.content}
          </p>
          {message.createdAt && (
            <p className="mt-1.5 text-right font-mono text-[10px] text-ink-700">
              {formatTime(message.createdAt)}
            </p>
          )}
        </div>
        <Avatar name={user?.name} size="sm" />
      </motion.div>
    );
  }

  // Assistant message — editorial research-card treatment, not a chat
  // bubble. Sections (reasoning / evidence / verification) only render
  // when the backend actually returned that data.
  const { reasoning, sources, verification, queryType } = message.metadata || {};
  const hasSources = sources?.length > 0;
  const hasVerification = verification?.length > 0;
  const queryTypeLabel = formatQueryType(queryType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-3"
    >
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface">
        <LogoMark size={14} />
      </div>
      <div className="min-w-0 max-w-2xl flex-1 rounded-md border border-line bg-surface/60 px-5 py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500">
              NEXUS
            </span>
            {queryTypeLabel && <Badge>{queryTypeLabel}</Badge>}
          </div>
          {message.createdAt && (
            <span className="font-mono text-[10px] text-ink-700">
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>

        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-700">
          Answer
        </p>
        <MarkdownLite content={message.content} />

        {reasoning && (
          <div className="mt-4 border-t border-line pt-3">
            <button
              type="button"
              onClick={() => setReasoningOpen((v) => !v)}
              aria-expanded={reasoningOpen}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-700 transition-colors hover:text-ink-300"
            >
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  reasoningOpen ? "rotate-180" : ""
                }`}
              />
              Research approach
            </button>
            <AnimatePresence initial={false}>
              {reasoningOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs leading-relaxed text-ink-500">
                    {reasoning}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {(hasSources || hasVerification) && (
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-3">
            {hasSources && (
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                  <FileSearch className="h-3.5 w-3.5 text-ink-700" />
                  {sources.length} {sources.length === 1 ? "source" : "sources"}
                </span>
                <button
                  type="button"
                  onClick={() => onViewEvidence?.(message.id)}
                  className="font-mono text-[10px] uppercase tracking-wider text-amber-400 hover:underline"
                >
                  View evidence →
                </button>
              </div>
            )}
            <VerificationSummary verification={verification} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
