import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

export default function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex max-w-2xl flex-col items-start gap-3"
    >
      {Icon && (
        <div className="rounded-md border border-line-strong bg-surface p-3">
          <Icon className="h-5 w-5 text-amber-400" />
        </div>
      )}
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-100">
        {title}
      </h1>
      {description && <p className="text-ink-500">{description}</p>}
      <Badge className="mt-2">Coming soon</Badge>
    </motion.div>
  );
}
