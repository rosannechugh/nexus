import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

/**
 * Fetches and manages the authenticated user's indexed documents.
 * Centralizes all document list/upload/delete calls so components never
 * talk to Axios directly (per the app's existing hook pattern).
 */
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/documents");
      setDocuments(data);
    } catch {
      setError("Couldn't load your literature library.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Uploads a real PDF via multipart/form-data, then refetches the list
  // so the new document appears with its canonical DocumentResponse shape
  // (created_at etc), rather than reconstructing one from the upload
  // response, which doesn't include every list field.
  const uploadDocument = useCallback(
    async (file) => {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/api/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDocuments();
      return data;
    },
    [fetchDocuments]
  );

  const deleteDocument = useCallback(async (documentId) => {
    await api.delete(`/api/documents/${documentId}`);
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  }, []);

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments,
    uploadDocument,
    deleteDocument,
  };
}
