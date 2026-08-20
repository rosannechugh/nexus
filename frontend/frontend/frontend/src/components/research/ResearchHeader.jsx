import { LayoutList, PanelRight } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function ResearchHeader({
  title,
  updatedAt,
  onToggleSessions,
  onToggleEvidence,
  hasEvidence,
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <IconButton label="Research sessions" onClick={onToggleSessions} className="lg:hidden">
          <LayoutList className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0">
          <h1 className="truncate font-display text-sm font-medium tracking-tight text-ink-100 sm:text-base">
            {title}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
            Research Session
            {updatedAt && <> · Updated {formatRelativeTime(updatedAt)}</>}
          </p>
        </div>
      </div>

      {hasEvidence && (
        <IconButton label="Toggle evidence panel" onClick={onToggleEvidence}>
          <PanelRight className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  );
}
