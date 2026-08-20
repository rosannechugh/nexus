import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Compass,
  FileText,
  SearchX,
  Trash2,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import { useDocument } from "@/hooks/useDocument";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/utils/getErrorMessage";

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentDetails() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { document, isLoading, error, notFound } = useDocument(documentId);
  // Reuses the same delete/refresh logic the library list uses — no
  // duplicate document API calls elsewhere.
  const { deleteDocument, refetch: refetchList } = useDocuments();
  const { showToast } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteDocument(documentId);
      await refetchList();
      showToast("Document deleted.", "success");
      navigate("/documents");
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Couldn't delete this document."));
      setIsDeleting(false);
    }
  };

  if (notFound) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-3 py-10">
          <SearchX className="h-5 w-5 text-ink-700" />
          <p className="font-display text-base font-medium text-ink-100">
            Document not found
          </p>
          <p className="text-sm text-ink-500">
            This document doesn&apos;t exist, or doesn&apos;t belong to your
            account.
          </p>
          <Link to="/documents">
            <Button variant="secondary" size="sm">
              Back to Library
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-start gap-3 py-10">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <Link
          to="/documents"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-500 hover:text-ink-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Library
        </Link>

        <Card className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md border border-line-strong bg-surface p-2.5">
                <FileText className="h-5 w-5 text-ink-300" />
              </div>
              <div className="min-w-0">
                <h1
                  className="break-words font-display text-lg font-medium text-ink-100"
                  title={document.name}
                >
                  {document.name}
                </h1>
                <div className="mt-2">
                  <DocumentStatusBadge status={document.status} />
                </div>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
                Type
              </dt>
              <dd className="mt-1 text-sm text-ink-300">
                {document.document_type}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
                Added
              </dt>
              <dd className="mt-1 text-sm text-ink-300">
                {formatDate(document.created_at)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <Link to="/research">
              <Button variant="secondary" size="sm">
                <Compass className="h-3.5 w-3.5" />
                Start Research
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </Card>
      </motion.div>

      <Modal
        open={confirmOpen}
        onClose={() => !isDeleting && setConfirmOpen(false)}
        title="Delete document?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-500">
            This will remove the document from your NEXUS library.
          </p>
          {deleteError && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {deleteError}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Delete Document"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
