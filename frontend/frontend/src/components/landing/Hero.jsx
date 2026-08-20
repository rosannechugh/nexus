import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import StatusPulse from "@/components/landing/StatusPulse";
import ArchitectureVisual from "@/components/landing/ArchitectureVisual";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section id="platform" className="relative overflow-hidden bg-grid pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-void) 0%, transparent 70%)",
        }}
      />
      <Container className="relative grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <StatusPulse label="Multi-Agent Research System" />
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink-100 sm:text-5xl lg:text-[3.4rem]"
          >
            Research intelligence,
            <br />
            built around <span className="text-amber-400">evidence.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-500 sm:text-lg"
          >
            NEXUS plans, retrieves, verifies, and synthesizes research so you
            can move from questions to evidence-backed insight.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Start Researching
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">
                Explore the Platform
              </Button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
        >
          <ArchitectureVisual />
        </motion.div>
      </Container>
    </section>
  );
}
