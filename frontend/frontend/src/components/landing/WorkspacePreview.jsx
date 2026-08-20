import { motion } from "framer-motion";
import { CheckCircle2, FileText } from "lucide-react";
import Container from "@/components/ui/Container";

const sessions = [
  { name: "Parkinson's Review", active: true },
  { name: "AI Hallucinations", active: false },
  { name: "LLM Survey", active: false },
];

const evidence = [
  { source: "Paper 01", ref: "Page 7" },
  { source: "Paper 02", ref: "Page 12" },
  { source: "Paper 03", ref: "Page 18" },
];

export default function WorkspacePreview() {
  return (
    <section id="research" className="border-t border-line py-24 sm:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-12 max-w-xl"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-amber-500">
            The workspace
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
            Every answer, traceable to its source.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="overflow-hidden rounded-lg border border-line bg-surface"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="font-mono text-[11px] text-ink-700">
              nexus / research /
            </span>
            <span className="font-mono text-[11px] text-ink-300">
              parkinson&apos;s-review
            </span>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr_260px]">
            {/* Sessions */}
            <div className="border-b border-line p-4 lg:border-b-0 lg:border-r">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-700">
                Research
              </p>
              <div className="flex flex-col gap-1">
                {sessions.map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-md border-l-2 px-3 py-2 text-sm ${
                      s.active
                        ? "border-amber-500 bg-amber-950/20 text-ink-100"
                        : "border-transparent text-ink-500"
                    }`}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col gap-4 border-b border-line p-5 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
                NEXUS
              </p>
              <div className="max-w-md self-end rounded-md rounded-tr-none bg-surface-raised px-4 py-2.5 text-sm text-ink-100">
                What are the primary approaches used for early detection?
              </div>
              <div className="rounded-md rounded-tl-none border border-line px-4 py-3 text-sm leading-relaxed text-ink-300">
                The literature primarily converges on gait-pattern analysis,
                voice biomarker screening, and dopaminergic imaging as the
                three leading approaches for pre-symptomatic detection.
              </div>
              <div className="mt-auto flex items-center gap-2 rounded-md border border-line-strong px-3 py-2 text-xs text-ink-700">
                Ask a follow-up question…
              </div>
            </div>

            {/* Evidence */}
            <div className="p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-700">
                Evidence
              </p>
              <div className="flex flex-col gap-2">
                {evidence.map((e) => (
                  <div
                    key={e.source}
                    className="flex items-center gap-2 text-sm text-ink-500"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-ink-700" />
                    <span className="text-ink-300">{e.source}</span>
                    <span className="font-mono text-xs text-ink-700">
                      {e.ref}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-md border border-verified/30 bg-verified/5 px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-verified" />
                <span className="text-xs text-verified">
                  Supported by 3 sources
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
