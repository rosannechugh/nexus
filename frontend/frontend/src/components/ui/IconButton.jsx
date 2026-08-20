import { motion } from "framer-motion";

export default function IconButton({ className = "", children, label, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-300 transition-colors hover:border-line-strong hover:text-ink-100 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
