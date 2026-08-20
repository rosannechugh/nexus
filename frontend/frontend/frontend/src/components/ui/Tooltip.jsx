/**
 * Minimal CSS-only tooltip (no JS state/positioning library) — shows on
 * hover/focus of its wrapped trigger. Used for the collapsed sidebar's
 * icon-only navigation items.
 */
export default function Tooltip({ label, children, side = "right" }) {
  const position =
    side === "right"
      ? "left-full top-1/2 ml-2 -translate-y-1/2"
      : "right-full top-1/2 mr-2 -translate-y-1/2";

  return (
    <div className="group/tooltip relative flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${position} z-50 whitespace-nowrap rounded-md border border-line-strong bg-surface-overlay px-2.5 py-1.5 font-mono text-[11px] text-ink-100 opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100`}
      >
        {label}
      </span>
    </div>
  );
}
