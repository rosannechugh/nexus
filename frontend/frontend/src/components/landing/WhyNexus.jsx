import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const points = [
  {
    title: "Traceability",
    description: "Every claim links back to the exact page it came from.",
  },
  {
    title: "Source-backed reasoning",
    description: "A dedicated agent verifies findings before they reach you.",
  },
  {
    title: "Persistent research",
    description: "Sessions stay searchable — pick up a thread months later.",
  },
  {
    title: "Multi-agent analysis",
    description: "Specialized agents plan, retrieve, verify, and synthesize.",
  },
];

export default function WhyNexus() {
  return (
    <section id="how-it-works" className="border-t border-line py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink-100 sm:text-4xl lg:text-[2.6rem]"
          >
            Don&apos;t just generate answers.
            <br />
            <span className="text-amber-400">Build evidence.</span>
          </motion.h2>

          <div className="flex flex-col gap-8">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-l border-line pl-5"
              >
                <h3 className="font-display text-base font-medium text-ink-100">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
