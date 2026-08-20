import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import DocumentRow from "@/components/documents/DocumentRow";

export default function DocumentList({ documents, isFiltered }) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-line-strong px-6 py-10">
        <SearchX className="h-5 w-5 text-ink-700" />
        <p className="text-sm text-ink-500">
          {isFiltered
            ? "No documents match your search."
            : "No documents to show."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      {/* Column header — desktop only */}
      <div className="hidden items-center gap-3 border-b border-line bg-surface/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-700 sm:flex">
        <span className="w-4" aria-hidden="true" />
        <span className="min-w-0 flex-1">Document</span>
        <span className="w-16 shrink-0">Type</span>
        <span className="w-24 shrink-0">Status</span>
        <span className="hidden w-16 shrink-0 md:block">Added</span>
        <span className="w-4 shrink-0" aria-hidden="true" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {documents.map((document, i) => (
          <DocumentRow
            key={document.id}
            document={document}
            className={i > 0 ? "border-t border-line" : ""}
          />
        ))}
      </motion.div>
    </div>
  );
}
