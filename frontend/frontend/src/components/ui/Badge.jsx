const tones = {
  neutral: "border-line-strong text-ink-300",
  amber: "border-amber-600/40 text-amber-400 bg-amber-950/40",
  verified: "border-verified/30 text-verified bg-verified/5",
};

export default function Badge({ tone = "neutral", className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
