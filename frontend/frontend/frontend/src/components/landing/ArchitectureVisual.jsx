import { motion } from "framer-motion";
import { Files, Radar, ShieldCheck, Layers, Sparkles } from "lucide-react";

const stages = [
  { label: "Plan", icon: Layers },
  { label: "Retrieve", icon: Radar },
  { label: "Verify", icon: ShieldCheck },
  { label: "Synthesize", icon: Sparkles },
];

function Node({ children, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md border border-line-strong bg-surface px-4 py-3 ${className}`}
    >
      {children}
    </div>
  );
}

function VLine() {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ transformOrigin: "top" }}
      className="h-8 w-px bg-line-strong"
    />
  );
}

export default function ArchitectureVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-lg border border-line bg-surface/40 p-6 sm:p-8"
    >
      <p className="mb-6 font-mono text-[10px] uppercase tracking-wider text-ink-700">
        System overview
      </p>

      <div className="flex flex-col items-center">
        <Node>
          <Files className="h-4 w-4 text-ink-500" />
          <span className="text-sm text-ink-300">Research Papers</span>
        </Node>

        <VLine />

        <Node className="border-amber-600/50 bg-amber-950/30">
          <span className="font-display text-sm font-semibold tracking-tight text-amber-400">
            NEXUS
          </span>
        </Node>

        <VLine />

        <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-0">
          {stages.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-1 flex-col items-center gap-2 rounded-md border border-line px-2 py-4 text-center sm:rounded-none sm:border-0">
                <span className="font-mono text-[10px] text-ink-700">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <Icon className="h-4 w-4 text-ink-300" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-300">
                  {label}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="hidden h-px w-6 shrink-0 bg-line-strong sm:block" />
              )}
            </div>
          ))}
        </div>

        <VLine />

        <Node className="border-amber-600/50 bg-amber-950/30">
          <span className="text-sm font-medium text-amber-400">
            Evidence-backed Insight
          </span>
        </Node>
      </div>
    </motion.div>
  );
}
