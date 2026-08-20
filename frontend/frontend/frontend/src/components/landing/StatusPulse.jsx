const tones = {
  amber: "bg-amber-500",
  verified: "bg-verified",
};

export default function StatusPulse({ label, tone = "amber", className = "" }) {
  const dot = tones[tone];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full animate-pulse-slow rounded-full ${dot}`}
        />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-300">
        {label}
      </span>
    </div>
  );
}
