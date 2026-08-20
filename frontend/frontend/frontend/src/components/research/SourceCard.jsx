import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A single retrieved chunk from POST /api/chat's `sources[]`. Only real
 * fields are shown — document_id (resolved against GET /api/documents
 * when possible), page_number, content, and distance. No score/title
 * field exists on the backend's Source schema, so none is fabricated
 * here.
 *
 * Selection and excerpt-expansion are separate real <button> elements
 * (not a button nested inside a button) so both stay independently
 * keyboard-accessible.
 */
export default function SourceCard({
  source,
  index,
  documentName,
  active,
  onSelect,
  cardRef,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = Boolean(source.content);
  const isLong = hasContent && source.content.length > 220;

  return (
    <div
      ref={cardRef}
      className={`rounded-md border transition-colors ${
        active
          ? "border-amber-500/60 bg-amber-950/20"
          : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-label={`Select source ${index + 1}${documentName ? `, ${documentName}` : ""}`}
        className="w-full px-3.5 pt-3 text-left"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500">
            Source {String(index + 1).padStart(2, "0")}
          </span>
          {typeof source.distance === "number" && (
            <span className="font-mono text-[10px] text-ink-700">
              Δ {source.distance.toFixed(3)}
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-sm text-ink-100">
          {documentName || `Document #${source.document_id}`}
        </p>

        {typeof source.page_number !== "undefined" && (
          <p className="text-xs text-ink-700">Page {source.page_number}</p>
        )}
      </button>

      {hasContent && (
        <div className="px-3.5 pb-3">
          <p
            className={`mt-2 overflow-hidden whitespace-pre-wrap text-xs leading-relaxed text-ink-500 ${
              expanded ? "max-h-none" : "max-h-20"
            }`}
          >
            {source.content}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink-700 hover:text-amber-400"
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
