import { motion } from "framer-motion";
import LogoMark from "@/components/ui/LogoMark";

/**
 * The backend runs its pipeline synchronously and returns a single
 * result — no per-stage progress is available. This deliberately shows
 * one honest state rather than fabricating "Planning… Retrieving…
 * Verifying…" progress the backend never actually reports.
 */
export default function ResearchThinking({ label = "Researching…" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3"
    >
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface">
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <LogoMark size={14} />
        </motion.div>
      </div>
      <div className="flex items-center rounded-md border border-line bg-surface/60 px-5 py-4">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-500">
          {label}
        </span>
        <span className="ml-1 inline-flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full bg-ink-500"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
