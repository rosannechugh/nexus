import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-amber-500 text-void hover:bg-amber-400 disabled:bg-amber-500/40 disabled:text-ink-700",
  secondary:
    "border border-line-strong text-ink-100 hover:border-ink-500 hover:bg-surface-raised disabled:opacity-40",
  ghost:
    "text-ink-300 hover:text-ink-100 hover:bg-surface-raised disabled:opacity-40",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/15 disabled:opacity-40",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
