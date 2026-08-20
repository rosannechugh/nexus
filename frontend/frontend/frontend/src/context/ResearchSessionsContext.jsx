import { createContext, useContext } from "react";
import { useResearchSessions } from "@/hooks/useResearchSessions";

const ResearchSessionsContext = createContext(null);

/**
 * Fetches research sessions exactly once per authenticated session and
 * shares the result (plus create/refetch actions) with every consumer —
 * Sidebar, MobileSidebar, the top bar's session-title lookup, and the
 * Dashboard — so none of them issue their own duplicate request.
 */
export function ResearchSessionsProvider({ children }) {
  const value = useResearchSessions();
  return (
    <ResearchSessionsContext.Provider value={value}>
      {children}
    </ResearchSessionsContext.Provider>
  );
}

export function useResearchSessionsContext() {
  const context = useContext(ResearchSessionsContext);
  if (!context) {
    throw new Error(
      "useResearchSessionsContext must be used within a ResearchSessionsProvider"
    );
  }
  return context;
}
