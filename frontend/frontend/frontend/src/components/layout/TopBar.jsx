import { Menu } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import UserMenu from "@/components/layout/UserMenu";
import StatusPulse from "@/components/landing/StatusPulse";

export default function TopBar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-void/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          label="Open menu"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </IconButton>
        <h1 className="truncate font-display text-base font-medium tracking-tight text-ink-100">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <StatusPulse
          label="System Operational"
          tone="verified"
          className="hidden sm:inline-flex"
        />
        <UserMenu variant="compact" dropdownSide="bottom" />
      </div>
    </header>
  );
}
