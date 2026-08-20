import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Plus, SearchX, X } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useResearchSessionsContext } from "@/context/ResearchSessionsContext";
import NewResearchModal from "@/components/research/NewResearchModal";

/**
 * Workspace-scoped session navigator — distinct from (and complementary
 * to) the global app Sidebar. That sidebar already lists sessions
 * globally; this panel is specific to the research workspace and is the
 * primary way to switch sessions while inside /research/:sessionId.
 * Reads from the same ResearchSessionsContext as the rest of the app, so
 * no extra fetch is made here.
 */
function SessionList({ sessions, isLoading, error, activeSessionId, onNavigate, onNewResearch }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
          Research
        </span>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onNewResearch}
        className="w-full justify-center"
      >
        <Plus className="h-3.5 w-3.5" />
        New Research
      </Button>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-md bg-surface-raised" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-400">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-line-strong px-3 py-4">
            <SearchX className="h-4 w-4 text-ink-700" />
            <p className="text-xs text-ink-500">No research sessions yet</p>
            <button
              type="button"
              onClick={onNewResearch}
              className="text-xs font-medium text-amber-400 hover:underline"
            >
              Start Research
            </button>
          </div>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {sessions.map((session) => (
              <NavLink
                key={session.id}
                to={`/research/${session.id}`}
                onClick={onNavigate}
                className={`truncate rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors ${
                  String(session.id) === String(activeSessionId)
                    ? "border-amber-500 bg-amber-950/20 text-ink-100"
                    : "border-transparent text-ink-500 hover:bg-surface-raised hover:text-ink-300"
                }`}
              >
                {session.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResearchSidebar({ activeSessionId, mobileOpen = false, onCloseMobile }) {
  const { sessions, isLoading, error, createSession } = useResearchSessionsContext();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);

  return (
    <>
      {/* Desktop: persistent left column */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface/40 lg:flex">
        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          activeSessionId={activeSessionId}
          onNewResearch={openModal}
        />
      </aside>

      {/* Mobile/tablet: drawer */}
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative flex h-full w-[80%] max-w-xs flex-col border-r border-line bg-surface"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
                <Link to="/dashboard" onClick={onCloseMobile} className="font-display text-sm font-semibold text-ink-100">
                  NEXUS
                </Link>
                <IconButton label="Close sessions" onClick={onCloseMobile}>
                  <X className="h-4 w-4" />
                </IconButton>
              </div>
              <SessionList
                sessions={sessions}
                isLoading={isLoading}
                error={error}
                activeSessionId={activeSessionId}
                onNavigate={onCloseMobile}
                onNewResearch={() => {
                  onCloseMobile?.();
                  openModal();
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NewResearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateSession={createSession}
      />
    </>
  );
}
