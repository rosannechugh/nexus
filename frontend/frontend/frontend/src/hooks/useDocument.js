import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** Loads a single document's detail via GET /api/documents/{id}. */
export function useDocument(documentId) {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const { data } = await api.get(`/api/documents/${documentId}`);
      setDocument(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err, "Couldn't load this document."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    load();
  }, [load]);

  return { document, isLoading, error, notFound, refetch: load };
}
