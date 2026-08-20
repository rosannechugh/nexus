import { CheckCircle2, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

const STATUS_CONFIG = {
  SUPPORTED: { tone: "verified", icon: CheckCircle2, label: "Supported" },
  PARTIALLY_SUPPORTED: {
    tone: "amber",
    icon: ShieldAlert,
    label: "Partially Supported",
  },
  UNSUPPORTED: { tone: "danger", icon: XCircle, label: "Unsupported" },
};

function statusConfig(status) {
  return (
    STATUS_CONFIG[(status || "").toUpperCase()] || {
      tone: "neutral",
      icon: ShieldAlert,
      label: status || "Unverified",
    }
  );
}

/**
 * Renders the REAL claim-level verification array from POST /api/chat
 * (`{ claim, status, supporting_sources, explanation }`). Statuses and
 * explanations are shown exactly as returned — no invented confidence
 * percentages. `supporting_sources` are the backend's real 1-indexed
 * positions into the sources array; clicking one selects and scrolls to
 * that source card.
 */
export default function VerificationPanel({ verification = [], onSelectSource }) {
  if (verification.length === 0) return null;

  return (
    <div className="mt-6 border-t border-line pt-4">
      <div className="mb-3 flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-ink-500" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
          Verification
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {verification.map((item, i) => {
          const { tone, icon: Icon, label } = statusConfig(item.status);
          return (
            <div
              key={i}
              className="rounded-md border border-line bg-surface px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs leading-relaxed text-ink-300">
                  {item.claim}
                </p>
                <Badge tone={tone} className="shrink-0">
                  <Icon className="h-3 w-3" />
                  {label}
                </Badge>
              </div>
              {item.explanation && (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-700">
                  {item.explanation}
                </p>
              )}
              {item.supporting_sources?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.supporting_sources.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onSelectSource?.(n)}
                      className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-ink-500 transition-colors hover:border-amber-500/50 hover:text-amber-400"
                    >
                      {String(n).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
