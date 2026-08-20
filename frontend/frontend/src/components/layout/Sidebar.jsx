import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import Tooltip from "@/components/ui/Tooltip";
import UserMenu from "@/components/layout/UserMenu";
import ResearchSessionsList from "@/components/layout/ResearchSessionsList";
import { navItems, isNavItemActive } from "@/components/layout/navConfig";

const COLLAPSE_KEY = "nexus_sidebar_collapsed";

export default function Sidebar({ sessions, sessionsLoading, sessionsError, isCreating, onCreateSession }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "1"
  );

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 268 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-surface/60 lg:flex"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <LogoMark />
          {!collapsed && (
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
              NEXUS
            </span>
          )}
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(location.pathname, item);

          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-amber-950/30 text-amber-400"
                  : "text-ink-300 hover:bg-surface-raised hover:text-ink-100"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          );

          return collapsed ? (
            <Tooltip key={item.to} label={item.label}>
              {link}
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      {!collapsed && (
        <div className="flex min-h-0 flex-1 flex-col border-t border-line p-3">
          <ResearchSessionsList
            sessions={sessions}
            isLoading={sessionsLoading}
            error={sessionsError}
            isCreating={isCreating}
            onCreateSession={onCreateSession}
          />
        </div>
      )}
      {collapsed && <div className="flex-1" />}

      <div className="border-t border-line p-3">
        {collapsed ? (
          <Tooltip label="Account">
            <UserMenu variant="compact" dropdownSide="top" />
          </Tooltip>
        ) : (
          <UserMenu variant="full" dropdownSide="top" />
        )}
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex h-9 shrink-0 items-center justify-center gap-2 border-t border-line text-ink-700 transition-colors hover:bg-surface-raised hover:text-ink-300"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
}
