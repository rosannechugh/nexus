function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
};

export default function Avatar({ name, size = "md", className = "" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-raised font-mono font-medium text-amber-400 ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
