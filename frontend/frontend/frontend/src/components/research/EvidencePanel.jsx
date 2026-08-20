import { useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, FileSearch, Loader2, X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import SourceCard from "@/components/research/SourceCard";
import VerificationPanel from "@/components/research/VerificationPanel";

/**
 * Sources and verification come straight from the real ChatResponse (or
 * a message's stored research_metadata) — only fields the backend
 * actually returns are rendered, and this panel never issues its own
 * fetch: it's fed whichever message's evidence the workspace currently
 * has selected. `documentsById` optionally resolves document_id to a
 * real filename from GET /api/documents; falls back to "Document #N"
 * when a document isn't in that list (e.g. deleted).
 */
export default function EvidencePanel({
  sources = [],
  verification = [],
  documentsById = {},
  selectedIndex,
  onSelectIndex,
  mobileOpen = false,
  onCloseMobile,
  isLoading = false,
  loadError = null,
}) {
  const sourceRefs = useRef({});

  const hasEvidence = sources.length > 0;

  const handleSelectFromVerification = useCallback(
    (sourceNumber) => {
      const index = sourceNumber - 1;
      onSelectIndex(index);
      sourceRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    },
    [onSelectIndex]
  );

  const summaryLabel = hasEvidence
    ? `${sources.length} ${sources.length === 1 ? "source" : "sources"}`
    : null;

  const content = useMemo(
    () => (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
              Evidence
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {summaryLabel || "Sources used by NEXUS"}
            </p>
          </div>
          <IconButton
            label="Close evidence panel"
            onClick={onCloseMobile}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-line-strong px-4 py-6">
              <Loader2 className="h-4 w-4 animate-spin text-ink-700" />
              <p className="text-sm text-ink-500">Retrieving evidence…</p>
            </div>
          )}

          {!isLoading && loadError && !hasEvidence && (
            <div className="flex flex-col items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-6">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-400">
                Evidence could not be loaded.
              </p>
            </div>
          )}

          {!isLoading && !loadError && !hasEvidence && (
            <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-line-strong px-4 py-6">
              <FileSearch className="h-4 w-4 text-ink-700" />
              <p className="text-sm text-ink-500">
                No supporting evidence was retrieved for this response.
              </p>
            </div>
          )}

          {!isLoading && hasEvidence && (
            <div className="flex flex-col gap-3">
              {sources.map((source, i) => (
                <SourceCard
                  key={source.chunk_id || i}
                  cardRef={(el) => (sourceRefs.current[i] = el)}
                  source={source}
                  index={i}
                  documentName={documentsById[source.document_id]?.name}
                  active={selectedIndex === i}
                  onSelect={() => onSelectIndex(selectedIndex === i ? null : i)}
                />
              ))}
            </div>
          )}

          {!isLoading && (
            <VerificationPanel
              verification={verification}
              onSelectSource={handleSelectFromVerification}
            />
          )}
        </div>
      </div>
    ),
    [
      sources,
      verification,
      documentsById,
      selectedIndex,
      onSelectIndex,
      hasEvidence,
      onCloseMobile,
      isLoading,
      loadError,
      summaryLabel,
      handleSelectFromVerification,
    ]
  );

  return (
    <>
      {/* Desktop: persistent right column */}
      <aside className="hidden w-80 shrink-0 border-l border-line bg-surface/40 lg:flex xl:w-96">
        {content}
      </aside>

      {/* Mobile/tablet: bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t border-line bg-surface"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
