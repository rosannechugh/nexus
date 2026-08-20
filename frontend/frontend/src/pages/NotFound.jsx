import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-700">
        Error 404
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-100">
        Page not found
      </h1>
      <p className="text-ink-500">This page doesn&apos;t exist.</p>
      <Link to="/" className="mt-3">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
