import { motion } from "framer-motion";
import { ArrowRight, Library, PlayCircle, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";

function ActionCard({ eyebrow, title, description, icon: Icon, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Card
        as="button"
        variant="raised"
        onClick={onClick}
        className="group flex w-full flex-col items-start gap-3 text-left transition-colors hover:border-line-strong"
      >
        <div className="flex w-full items-center justify-between">
          <div className="rounded-md border border-line-strong bg-surface p-2">
            <Icon className="h-4 w-4 text-amber-400" />
          </div>
          <ArrowRight className="h-4 w-4 text-ink-700 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-300" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
            {eyebrow}
          </p>
          <p className="mt-1 font-display text-sm font-medium text-ink-100">
            {title}
          </p>
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function QuickActions({ onNewResearch, onOpenLibrary, latestSession, onContinueResearch }) {
  const actions = [
    {
      eyebrow: "New research",
      title: "Start an investigation",
      description: "Evidence-backed research, planned and verified.",
      icon: Sparkles,
      onClick: onNewResearch,
    },
    {
      eyebrow: "Literature library",
      title: "Browse your papers",
      description: "Search your indexed research documents.",
      icon: Library,
      onClick: onOpenLibrary,
    },
  ];

  if (latestSession) {
    actions.push({
      eyebrow: "Continue research",
      title: latestSession.title,
      description: "Pick up your most recent session.",
      icon: PlayCircle,
      onClick: onContinueResearch,
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, i) => (
        <ActionCard key={action.eyebrow} index={i} {...action} />
      ))}
    </div>
  );
}
