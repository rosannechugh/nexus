import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

/**
 * Single source of truth for the authenticated user's research sessions.
 * Fetched once at the AppLayout level and passed down to Sidebar /
 * MobileSidebar as props so the desktop sidebar and the mobile drawer
 * never issue duplicate requests for the same data.
 */
export function useResearchSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/research/sessions");
      setSessions(data);
    } catch {
      setError("Couldn't load research sessions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = useCallback(async (title = "Untitled Research") => {
    setIsCreating(true);
    try {
      const { data } = await api.post("/api/research/sessions", { title });
      setSessions((prev) => [data, ...prev]);
      return data;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    sessions,
    isLoading,
    error,
    isCreating,
    createSession,
    refetch: fetchSessions,
  };
}
