import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Compass, SearchX } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function RecentResearchList({
  sessions,
  isLoading,
  error,
  onStartResearch,
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-lg font-medium tracking-tight text-ink-100">
            Recent Research
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Pick up where you left off.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-none" />
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
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong px-6 py-10">
            <SearchX className="h-5 w-5 text-ink-700" />
            <div>
              <p className="font-display text-sm font-medium text-ink-100">
                Your research workspace is empty.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Start your first investigation and build an evidence-backed
                research trail.
              </p>
            </div>
            <Button size="sm" onClick={onStartResearch}>
              Start Your First Research
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
                className={`group flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-surface-raised ${
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
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-700 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-300" />
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
