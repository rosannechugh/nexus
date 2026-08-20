import { motion } from "framer-motion";
import { Layers, Radar, ShieldCheck, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";

const features = [
  {
    n: "01",
    icon: Layers,
    title: "Plan",
    description:
      "Break complex research questions into structured investigation steps.",
  },
  {
    n: "02",
    icon: Radar,
    title: "Retrieve",
    description:
      "Find relevant evidence across your indexed research library.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Verify",
    description: "Cross-check claims against supporting sources.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Synthesize",
    description: "Turn evidence into a coherent research answer.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-14 max-w-xl"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-amber-500">
            Agent pipeline
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
            From question to evidence.
          </h2>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ n, icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ backgroundColor: "var(--color-surface-raised)" }}
              className="group flex flex-col gap-5 bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-700">{n}</span>
                <Icon className="h-4 w-4 text-ink-500 transition-colors group-hover:text-amber-400" />
              </div>
              <div>
                <h3 className="font-display text-base font-medium tracking-tight text-ink-100">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
