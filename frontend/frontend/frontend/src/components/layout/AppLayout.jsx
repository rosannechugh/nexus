import { useMemo, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import TopBar from "@/components/layout/TopBar";
import {
  ResearchSessionsProvider,
  useResearchSessionsContext,
} from "@/context/ResearchSessionsContext";

const STATIC_TITLES = {
  "/dashboard": "Dashboard",
  "/research": "Research",
  "/documents": "Literature Library",
  "/settings": "Settings",
};

function usePageTitle(sessions) {
  const location = useLocation();
  const { sessionId } = useParams();

  return useMemo(() => {
    if (location.pathname.startsWith("/research/") && sessionId) {
      const session = sessions.find((s) => String(s.id) === sessionId);
      return session?.title || "Research Session";
    }
    if (location.pathname.startsWith("/documents/")) {
      return "Document";
    }
    return STATIC_TITLES[location.pathname] || "NEXUS";
  }, [location.pathname, sessionId, sessions]);
}

/**
 * Shell for every authenticated route (/dashboard, /research,
 * /research/:sessionId, /documents, /settings). Research sessions are
 * fetched exactly once (see ResearchSessionsProvider) and shared with
 * the desktop Sidebar, the mobile drawer, the top bar's session-title
 * lookup, and any page (e.g. Dashboard) via context.
 */
export default function AppLayout() {
  return (
    <ResearchSessionsProvider>
      <AppLayoutContent />
    </ResearchSessionsProvider>
  );
}

function AppLayoutContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    sessions,
    isLoading: sessionsLoading,
    error: sessionsError,
    isCreating,
    createSession,
  } = useResearchSessionsContext();

  const title = usePageTitle(sessions);

  return (
    <div className="relative flex min-h-screen bg-void">
      {/* Restrained ambient background: near-black base + soft top-left glow + dot grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(216,155,60,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full">
        <Sidebar
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          sessionsError={sessionsError}
          isCreating={isCreating}
          onCreateSession={createSession}
        />

        <MobileSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          sessionsError={sessionsError}
          isCreating={isCreating}
          onCreateSession={createSession}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
