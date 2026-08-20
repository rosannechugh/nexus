export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-line-strong bg-void px-3 py-2.5 text-sm text-ink-100 outline-none transition-colors placeholder:text-ink-700 focus:border-amber-500 ${className}`}
      {...props}
    />
  );
}
