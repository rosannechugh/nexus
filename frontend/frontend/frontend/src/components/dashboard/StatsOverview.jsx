import { motion } from "framer-motion";
import { FileStack, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

function StatCard({ icon: Icon, label, value, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.05, ease: "easeOut" }}
    >
      <Card className="flex items-start gap-4">
        <div className="rounded-md border border-line-strong bg-surface p-2.5">
          <Icon className="h-4 w-4 text-ink-300" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
            {label}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-100">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-ink-500">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function StatsOverview({
  sessionsCount,
  documentsCount,
  isLoading,
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium tracking-tight text-ink-100">
        Research Overview
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <StatCard
              index={0}
              icon={Search}
              label="Research Sessions"
              value={sessionsCount}
              description="Active investigations"
            />
            <StatCard
              index={1}
              icon={FileStack}
              label="Documents"
              value={documentsCount}
              description="Indexed research papers"
            />
          </>
        )}
      </div>
    </div>
  );
}
