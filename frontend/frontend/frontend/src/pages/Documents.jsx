import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Compass,
  Search,
  Upload,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import DocumentList from "@/components/documents/DocumentList";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/context/ToastContext";

const STATUS_FILTERS = ["all", "ready", "processing", "failed"];

export default function Documents() {
  const { documents, isLoading, error, refetch, uploadDocument } = useDocuments();
  const { showToast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Only offer filter chips for statuses that actually occur in this
  // user's library — never show a "Processing" chip if nothing is.
  const availableStatuses = useMemo(() => {
    const present = new Set(documents.map((d) => (d.status || "").toLowerCase()));
    return STATUS_FILTERS.filter((s) => s === "all" || present.has(s));
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (doc.status || "").toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const isFiltered = search.trim() !== "" || statusFilter !== "all";

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-500">
              Literature Library
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100">
              Literature Library
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Your indexed research papers and knowledge base.
              {!isLoading && !error && (
                <span className="text-ink-700">
                  {" "}
                  · {documents.length} {documents.length === 1 ? "paper" : "papers"}
                </span>
              )}
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Paper
          </Button>
        </div>

        {!isLoading && !error && documents.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                className="pl-9"
                aria-label="Search documents by filename"
              />
            </div>
            {availableStatuses.length > 2 && (
              <div className="flex flex-wrap gap-1.5">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    aria-pressed={statusFilter === status}
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      statusFilter === status
                        ? "border-amber-500/50 bg-amber-950/30 text-amber-400"
                        : "border-line-strong text-ink-500 hover:text-ink-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-none" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-5 py-6">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
            <Button variant="secondary" size="sm" onClick={refetch}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong px-6 py-14">
            <Upload className="h-5 w-5 text-ink-700" />
            <div>
              <p className="font-display text-base font-medium text-ink-100">
                No papers in your library yet.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Upload your first research paper to give NEXUS a knowledge
                base to work with.
              </p>
            </div>
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              Upload Your First Paper
            </Button>
          </div>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <DocumentList documents={filteredDocuments} isFiltered={isFiltered} />
        )}

        {!isLoading && !error && documents.length > 0 && (
          <Card variant="outline" className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm text-ink-100">
                  Your indexed papers power NEXUS retrieval.
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Ask questions in a research session and NEXUS can retrieve
                  relevant evidence from your library.
                </p>
              </div>
            </div>
            <Link to="/research" className="shrink-0">
              <Button variant="secondary" size="sm">
                Start Research
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        )}
      </motion.div>

      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        uploadDocument={uploadDocument}
        onUploaded={() => showToast("Document uploaded successfully.", "success")}
      />
    </PageContainer>
  );
}
