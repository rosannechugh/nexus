import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import IconButton from "@/components/ui/IconButton";
import UserMenu from "@/components/layout/UserMenu";
import ResearchSessionsList from "@/components/layout/ResearchSessionsList";
import { navItems, isNavItemActive } from "@/components/layout/navConfig";

export default function MobileSidebar({
  open,
  onClose,
  sessions,
  sessionsLoading,
  sessionsError,
  isCreating,
  onCreateSession,
}) {
  const location = useLocation();

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex h-full w-[85%] max-w-xs flex-col border-r border-line bg-surface"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-2.5"
              >
                <LogoMark />
                <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
                  NEXUS
                </span>
              </Link>
              <IconButton label="Close menu" onClick={onClose}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>

            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(location.pathname, item);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-amber-950/30 text-amber-400"
                        : "text-ink-300 hover:bg-surface-raised hover:text-ink-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex min-h-0 flex-1 flex-col border-t border-line p-3">
              <ResearchSessionsList
                sessions={sessions}
                isLoading={sessionsLoading}
                error={sessionsError}
                isCreating={isCreating}
                onCreateSession={onCreateSession}
                onNavigate={onClose}
              />
            </div>

            <div className="border-t border-line p-3">
              <UserMenu variant="full" dropdownSide="top" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
