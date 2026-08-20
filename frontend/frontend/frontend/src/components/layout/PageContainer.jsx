/**
 * Consistent max-width / padding wrapper for authenticated app pages, so
 * spacing values live in exactly one place instead of being repeated in
 * every page component.
 */
export default function PageContainer({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
