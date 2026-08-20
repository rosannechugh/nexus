import { LayoutDashboard, Search, FileText, Settings } from "lucide-react";

// Shared between the desktop Sidebar and the mobile drawer so nav items
// never drift out of sync between the two.
export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/research", label: "Research", icon: Search, exact: false },
  { to: "/documents", label: "Documents", icon: FileText, exact: true },
  { to: "/settings", label: "Settings", icon: Settings, exact: true },
];

export function isNavItemActive(pathname, item) {
  return item.exact ? pathname === item.to : pathname.startsWith(item.to);
}
