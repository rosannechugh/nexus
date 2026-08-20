import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function DocumentRow({ document, className = "" }) {
  return (
    <Link
      to={`/documents/${document.id}`}
      className={`group flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-surface-raised ${className}`}
    >
      <FileText className="h-4 w-4 shrink-0 text-ink-700" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-ink-100" title={document.name}>
          {document.name}
        </p>
        {/* Compact metadata row shown under the name on narrow screens
            where the dedicated TYPE/ADDED columns are hidden. */}
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-700 sm:hidden">
          {document.document_type} · {formatDate(document.created_at)}
        </p>
      </div>

      <span className="hidden w-16 shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-700 sm:block">
        {document.document_type}
      </span>

      <span className="w-24 shrink-0">
        <DocumentStatusBadge status={document.status} />
      </span>

      <span className="hidden w-16 shrink-0 text-xs text-ink-700 md:block">
        {formatDate(document.created_at)}
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-ink-700 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-300" />
    </Link>
  );
}
