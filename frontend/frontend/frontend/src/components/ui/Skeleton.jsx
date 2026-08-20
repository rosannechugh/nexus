export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-raised ${className}`}
      aria-hidden="true"
    />
  );
}
