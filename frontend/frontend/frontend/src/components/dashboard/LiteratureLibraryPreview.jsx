import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, FileText, Upload } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";

export default function LiteratureLibraryPreview({
  documents,
  isLoading,
  error,
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium tracking-tight text-ink-100">
            Literature Library
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Your indexed research knowledge.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-amber-400 hover:underline"
          >
            View Library
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-none" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong px-6 py-10">
            <FileText className="h-5 w-5 text-ink-700" />
            <div>
              <p className="font-display text-sm font-medium text-ink-100">
                No documents indexed yet.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Upload a research paper to start building your library.
              </p>
            </div>
            <Link to="/documents">
              <Button size="sm" variant="secondary">
                <Upload className="h-3.5 w-3.5" />
                Upload Paper
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-lg border border-line"
          >
            {documents.map((doc, i) => (
              <div
                key={doc.id}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <FileText className="h-4 w-4 shrink-0 text-ink-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-ink-100">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-ink-700">
                    {new Date(doc.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <DocumentStatusBadge status={doc.status} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
