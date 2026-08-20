import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

/**
 * Authenticated-user control. Two visual variants sharing one dropdown:
 * "full"    — avatar + name + email, used at the bottom of the sidebar.
 * "compact" — avatar only, used in the top bar.
 */
export default function UserMenu({ variant = "full", dropdownSide = "top" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const goToSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  const dropdownPosition =
    dropdownSide === "top"
      ? "bottom-full left-0 mb-2"
      : "top-full right-0 mt-2";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          variant === "full"
            ? "flex w-full items-center gap-2.5 rounded-md border border-transparent p-2 text-left transition-colors hover:border-line hover:bg-surface-raised"
            : "rounded-full transition-opacity hover:opacity-80"
        }
      >
        <Avatar name={user?.name} size={variant === "full" ? "md" : "sm"} />
        {variant === "full" && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-100">
                {user?.name || "—"}
              </p>
              <p className="truncate text-xs text-ink-700">
                {user?.email || ""}
              </p>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-ink-700" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropdownSide === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownSide === "top" ? 4 : -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            role="menu"
            className={`absolute z-50 w-52 overflow-hidden rounded-md border border-line bg-surface-overlay py-1 shadow-xl ${dropdownPosition}`}
          >
            <div className="border-b border-line px-3 py-2.5">
              <p className="truncate text-sm font-medium text-ink-100">
                {user?.name || "—"}
              </p>
              <p className="truncate text-xs text-ink-700">
                {user?.email || ""}
              </p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={goToProfile}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink-300 transition-colors hover:bg-surface-raised hover:text-ink-100"
            >
              <UserRound className="h-3.5 w-3.5" />
              Profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={goToSettings}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink-300 transition-colors hover:bg-surface-raised hover:text-ink-100"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
