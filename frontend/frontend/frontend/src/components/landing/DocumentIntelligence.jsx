import { motion } from "framer-motion";
import { FileInput, Scissors, Boxes, Database, Search, FileStack } from "lucide-react";
import Container from "@/components/ui/Container";

const steps = [
  { label: "PDF", icon: FileStack },
  { label: "Extract", icon: FileInput },
  { label: "Chunk", icon: Scissors },
  { label: "Embed", icon: Boxes },
  { label: "Index", icon: Database },
  { label: "Research", icon: Search },
];

export default function DocumentIntelligence() {
  return (
    <section id="documents" className="border-t border-line py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-amber-500">
              Document intelligence
            </p>
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
              Your literature becomes searchable intelligence.
            </h2>
            <p className="mt-5 max-w-md text-balance leading-relaxed text-ink-500">
              Upload research papers and NEXUS extracts, chunks, embeds, and
              indexes them automatically — turning a folder of PDFs into a
              knowledge base you can query directly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-line bg-surface/40 p-6 sm:p-8"
          >
            <div className="flex flex-col">
              {steps.map(({ label, icon: Icon }, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface">
                      <Icon className="h-4 w-4 text-ink-300" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="h-6 w-px bg-line-strong" />
                    )}
                  </div>
                  <span
                    className={`pb-6 font-mono text-xs uppercase tracking-wider ${
                      i === steps.length - 1 ? "text-amber-400" : "text-ink-500"
                    }`}
                    style={{ paddingBottom: i < steps.length - 1 ? "1.5rem" : 0 }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
