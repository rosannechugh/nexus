import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** Normalizes a persisted Message row into the shape ChatMessage expects. */
function normalizeServerMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.created_at,
    metadata: message.research_metadata || null,
  };
}

/**
 * Loads a single research session (title + full conversation) via
 * GET /api/research/sessions/{id} — the session-detail endpoint already
 * returns the complete message list, so this is the only request needed
 * to open a session. Also exposes local message-list mutators so
 * ResearchChat can append optimistic/real messages without refetching.
 */
export function useResearchSession(sessionId) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const { data } = await api.get(`/api/research/sessions/${sessionId}`);
      setSession({
        id: data.id,
        title: data.title,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
      setMessages((data.messages || []).map(normalizeServerMessage));
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err, "Couldn't load this research session."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    session,
    messages,
    isLoading,
    error,
    notFound,
    refetch: load,
    appendMessage,
    removeMessage,
  };
}
