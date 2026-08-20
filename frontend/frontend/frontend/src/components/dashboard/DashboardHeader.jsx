import { motion } from "framer-motion";
import { Plus, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DashboardHeader({ name, onNewResearch, onUploadPaper }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-amber-500">
          Research command center
        </p>
        <h1 className="mt-2 text-balance font-display text-2xl font-semibold tracking-tight text-ink-100 sm:text-3xl">
          {name ? `Good to see you, ${name}` : "Good to see you"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Continue your research or start a new investigation.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button variant="secondary" onClick={onUploadPaper}>
          <Upload className="h-4 w-4" />
          Upload Paper
        </Button>
        <Button onClick={onNewResearch}>
          <Plus className="h-4 w-4" />
          New Research
        </Button>
      </div>
    </motion.div>
  );
}
