import { motion } from "framer-motion";
import LogoMark from "@/components/ui/LogoMark";

/**
 * Shown while AuthContext is still determining whether a stored token is
 * valid. Used by both ProtectedRoute and GuestRoute so authenticated /
 * guest-only content never flashes before the redirect decision is made.
 */
export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void">
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <LogoMark size={28} />
      </motion.div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-700">
        Verifying session…
      </p>
    </div>
  );
}
