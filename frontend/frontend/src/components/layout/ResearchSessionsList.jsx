import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Plus, SearchX } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * "Research" block of the sidebar: create-session action + recent
 * sessions list, backed by GET /api/research/sessions. Shared between
 * the desktop Sidebar (expanded state) and the MobileSidebar drawer so
 * the two never fall out of sync or double-fetch.
 */
export default function ResearchSessionsList({
  sessions,
  isLoading,
  error,
  isCreating,
  onCreateSession,
  onNavigate,
}) {
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const session = await onCreateSession();
      navigate(`/research/${session.id}`);
      onNavigate?.();
    } catch {
      // Swallowed here — createSession already leaves state consistent;
      // a toast/inline error can be layered on in a later task.
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
          Research
        </span>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleCreate}
        disabled={isCreating}
        className="w-full justify-center"
      >
        <Plus className="h-3.5 w-3.5" />
        {isCreating ? "Creating…" : "New Research"}
      </Button>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col gap-1.5 px-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-md bg-surface-raised"
              />
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
              onClick={handleCreate}
              className="text-xs font-medium text-amber-400 hover:underline"
            >
              Start your first research
            </button>
          </div>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-0.5"
          >
            {sessions.map((session) => (
              <NavLink
                key={session.id}
                to={`/research/${session.id}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `truncate rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-amber-500 bg-amber-950/20 text-ink-100"
                      : "border-transparent text-ink-500 hover:bg-surface-raised hover:text-ink-300"
                  }`
                }
              >
                {session.title}
              </NavLink>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
