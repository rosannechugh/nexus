import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";

const links = [
  { label: "Platform", href: "/#platform" },
  { label: "Research", href: "/#research" },
  { label: "Documents", href: "/#documents" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Contact", href: "mailto:hello@nexus.dev" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <Link to="/" className="font-display text-sm font-semibold tracking-tight text-ink-100">
            NEXUS
          </Link>
          <p className="mt-2 max-w-xs text-sm text-ink-700">
            Multi-agent research intelligence, built around evidence.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wider text-ink-500 transition-colors hover:text-ink-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
