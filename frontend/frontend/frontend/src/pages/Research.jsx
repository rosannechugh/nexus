import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Compass, Plus, SearchX } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import NewResearchModal from "@/components/research/NewResearchModal";
import { useResearchSessionsContext } from "@/context/ResearchSessionsContext";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function Research() {
  const { sessions, isLoading, error, createSession } = useResearchSessionsContext();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-500">
              Research
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100">
              Your research sessions
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Open an existing investigation or start a new one.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Research
          </Button>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-none" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && sessions.length === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong px-6 py-14">
            <SearchX className="h-5 w-5 text-ink-700" />
            <div>
              <p className="font-display text-base font-medium text-ink-100">
                No research sessions yet
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Start your first investigation and build an evidence-backed
                research trail.
              </p>
            </div>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              Start Research
            </Button>
          </div>
        )}

        {!isLoading && !error && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-lg border border-line"
          >
            {sessions.map((session, i) => (
              <Link
                key={session.id}
                to={`/research/${session.id}`}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-surface-raised ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <Compass className="h-4 w-4 shrink-0 text-ink-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-ink-100">{session.title}</p>
                  <p className="mt-0.5 text-xs text-ink-700">
                    Updated {formatRelativeTime(session.updated_at)}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      <NewResearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateSession={createSession}
      />
    </PageContainer>
  );
}
