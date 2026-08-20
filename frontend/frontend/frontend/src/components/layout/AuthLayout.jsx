import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Radar, ShieldCheck, Sparkles } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import StatusPulse from "@/components/landing/StatusPulse";

const stages = [
  { label: "Plan", icon: Layers },
  { label: "Retrieve", icon: Radar },
  { label: "Verify", icon: ShieldCheck },
  { label: "Synthesize", icon: Sparkles },
];

/**
 * Shared shell for /login and /register. Left panel carries the brand
 * moment (kept out of the form column so the form itself stays focused);
 * right panel renders whatever form the page passes as children.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface/40 bg-grid p-10 lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, var(--color-void) 0%, transparent 65%)",
          }}
        />

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
            NEXUS
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-md"
        >
          <StatusPulse label="Multi-Agent Research System" />
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink-100 xl:text-4xl">
            Research intelligence,
            <br />
            built around <span className="text-amber-400">evidence.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Every session plans, retrieves, verifies, and synthesizes —
            so what you get back is traceable to its source.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="relative z-10 flex flex-wrap gap-2"
        >
          {stages.map(({ label, icon: Icon }, i) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-md border border-line-strong bg-surface px-3 py-2"
            >
              <span className="font-mono text-[10px] text-ink-700">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <Icon className="h-3.5 w-3.5 text-ink-500" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:justify-center lg:px-16 xl:px-24">
        <div className="flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
              NEXUS
            </span>
          </Link>
        </div>

        <Link
          to="/"
          className="mt-8 hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-700 transition-colors hover:text-ink-300 lg:inline-flex lg:mt-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10 lg:flex-none lg:py-0"
        >
          {children}
        </motion.div>

        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 self-center font-mono text-[11px] uppercase tracking-wider text-ink-700 hover:text-ink-300 lg:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
